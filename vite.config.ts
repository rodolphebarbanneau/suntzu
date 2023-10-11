/// <reference types='vitest' />
import archiver from 'archiver';
import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';

import type { Plugin } from 'vite';
import { build, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';

// retrieve project package.json
const project = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json'), 'utf8'));

// initialize environment variable defaults
process.env = {
  ...{
    BUNDLE: 'false',
    OUT_DIR: 'dist/chrome',
    VERSION: project.version,
  },
  ...process.env,
};

/**
 * Retrieve the argument from the command line.
 * @param argName - The name of the argument to retrieve.
 * @returns The value of the argument.
 */
function getArgValue(argName: string): string | undefined {
  const value = process.argv.find((arg) => arg.startsWith(`--${argName}`));
  if (value) {
    return value.split(new RegExp(`--${argName}[ =]*`))[1];
  } else {
    return undefined;
  }
}

/**
 * Create a browser extension.
 *
 * The process of creating a browser extension involves the following steps:
 *
 * 1. Build the commonjs scripts for the browser extension:
 *    Iterate over the scripts array and invoke the Vite build function for each script, using the
 *    provided `outDir` as the output directory. The configuration options for each build are set
 *    according to the script's entry file and the specified output directory.
 *
 * 2. Process the manifest template file.
 *    Copy the manifest template file from the source directory to the target browser directory. The
 *    template file is then processed and updated with the path of built `js` files found in the
 *    target asset directory.
 *
 * @param options - The options object.
 * @param options.scripts - The array of script entries.
 * @param options.manifest - The relative path to the source manifest template file.
 * @param options.dist - The relative path to the distribution directory.
 * @param options.browser - The manifest target browser.
 * @param options.mode - The mode in which Vite is running.
 * @returns A Rollup Plugin that performs the processing of the manifest file.
 */
async function createExtension(
  { scripts, manifest, dist, browser, mode }: {
    scripts: { entry: string; name: string }[];
    manifest: string;
    dist: string;
    browser: string;
    mode: string;
  },
): Promise<void> {
  // build commonjs scripts for the browser extension
  await Promise.all(scripts.map((script) => build({
    cacheDir: './node_modules/.vite/suntzu',
    configFile: false,

    define: {
      'process.env': process.env,
    },

    plugins: [
      react(),
      viteTsConfigPaths({
        root: './',
      }),
    ],

    build: {
      sourcemap: mode === 'production' ? false : true,
      emptyOutDir: false,
      rollupOptions: {
        input: {
          [script.name]: script.entry,
        },
        output: {
          format: 'cjs',
          dir: `${dist}/${browser}`,
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
  })));

  // export manifest template
  const assets = `./${dist}/${browser}/assets`;
  const target = `./${dist}/${browser}/manifest.json`;
  fs.copyFileSync(
    path.resolve(__dirname, manifest),
    path.resolve(__dirname, target)
  );

  // render manifest template
  let template = fs.readFileSync(target, 'utf-8');
  template = template.replace('{{version}}', process.env.VERSION?.split('-')[0] ?? '0.0.0');
  fs.readdirSync(assets).forEach(file => {
    if (file.match(/^content.*\.js$/)) {
      template = template.replace('{{content}}', `assets/${file}`);
    }
    if (file.match(/^service.*\.js$/)) {
      template = template.replace('{{service}}', `assets/${file}`);
    }
  });
  fs.writeFileSync(target, template);
}

/**
 * Create a zip bundle of a given distributed target browser directory.
 *
 * This function creates a Rollup plugin that compresses a given directory into a zip file with a
 * high compression level. It operates during the `post` enforcement stage of the Rollup build
 * lifecycle. If the distribution packages directory does not exist, it will be created. The bundle
 * will be named according to the provided browser name and placed in the distribution package
 * directory.
 *
 * @param options - The options object.
 * @param options.dist - The relative path to the distribution directory.
 * @param options.browser - The target browser for the bundle (without .zip extension).
 * @returns A Rollup Plugin that performs the compression of the directory into a zip file.
 */
function createBundle(
  { dist, browser }: { dist: string; browser: string }
): Plugin {
  return {
    name: 'create-bundle',
    enforce: 'post',
    writeBundle() {
      // check if bundling is enabled
      if (process.env.BUNDLE !== 'true') return;

      // create output directory if it does not exist
      if (!fs.existsSync(`${dist}/packages`)) {
        fs.mkdirSync(`${dist}/packages`, { recursive: true });
      }

      // create zip archive
      const stream = fs.createWriteStream(`${dist}/packages/${browser}.${process.env.VERSION}.zip`);
      const archive = archiver('zip', {
        zlib: { level: 9 } // set the compression level
      });

      // listen for all archive data to be written
      return new Promise((resolve, reject) => {
        // handle stream events
        stream.on('close', resolve);
        stream.on('end', resolve);
        stream.on('error', reject);
        // pipe stream to output archive file
        archive.pipe(stream);
        archive.directory(`${dist}/${browser}`, false);
        archive.finalize();
      });
    }
  };
}

/**
 * Generate the Vite configuration object for a browser extension project.
 *
 * This function uses the command line arguments and the provided `command` and `mode` to generate
 * an appropriate Vite configuration object. The output directory is extracted from the command line
 * arguments, and the distribution directory and target browser are  parsed from the output
 * directory path. The function also sets up the server, preview, plugins, build, and test
 * configurations for Vite. The plugins configuration includes the `createManifest` and
 * `createBundle` functions to process the manifest file and create a zip bundle of the output
 * directory.
 *
 * @param args - The object containing the command and mode.
 * @param args.command - The command given to Vite, e.g., 'build'.
 * @param args.mode - The mode in which Vite is running.
 * @returns The Vite configuration object.
 */
export default defineConfig(async ({ command, mode }) => {
  // load environment variables
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  // set vite environment variables
  process.env.VITE_VERSION = process.env.VERSION;

  // retrieve output directory
  const outDir = getArgValue('outDir') || process.env.OUT_DIR || '';
  const emptyOutDir = getArgValue('emptyOutDir') ?? true;

  // retrieve distribution and target browser directory
  const outDirIndex = outDir.lastIndexOf('/');
  if (outDirIndex === -1) throw new Error('invalid output directory path');
  const dist = outDir.slice(0, outDirIndex);
  if (!dist) throw new Error('missing distribution directory in output directory path');
  const browser = outDir.slice(outDirIndex + 1);
  if (!browser) throw new Error('missing browser extension in output directory path');

  // generate configuration
  // eslint-disable-next-line no-console
  console.log(`processing "${browser}" browser extension ${command} in "${mode}" mode...`);

  // clear out directory
  if (emptyOutDir) await fsExtra.emptyDir(`${dist}/${browser}`);

  // create browser extension
  await createExtension({
    scripts: [
      { name: 'content', entry: './src/scripts/content/index.ts' },
      { name: 'service', entry: './src/scripts/service/index.ts' },
    ],
    manifest: `./src/browsers/manifest.${browser}.json`,
    dist,
    browser,
    mode,
  });

  return {
    cacheDir: './node_modules/.vite/suntzu',

    define: {
      'process.env': process.env,
    },

    server: {
      port: 4200,
      host: 'localhost',
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    plugins: [
      react(),
      viteTsConfigPaths({
        root: './',
      }),
      createBundle({
        dist,
        browser,
      }),
    ],

    build: {
      sourcemap: mode === 'production' ? false : true,
      emptyOutDir: false,
      rollupOptions: {
        input: {
          index: './index.html',
        },
        output: {
          dir: outDir,
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },

    test: {
      globals: true,
      cache: {
        dir: './node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  };
});
