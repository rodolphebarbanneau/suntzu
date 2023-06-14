/// <reference types="vitest" />
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';

// read environment variable
const env = {
  bundle: process.env.BUNDLE === 'true',
  outDir: process.env.OUT_DIR || 'dist/chrome',
}

/**
 * Retrieve the argument from the command line.
 *
 * @param {string} argName - The name of the argument to retrieve.
 * @returns {string} The value of the argument.
 */
function getArgValue(argName: string): string | undefined {
  const arg = process.argv.find(arg => arg.startsWith(`--${argName}`));
  if (arg) {
    return arg.split(new RegExp(`--${argName}[ =]*`))[1];
  } else {
    return undefined;
  }
}

/**
 * Process manifest template file.
 *
 * This function creates a Rollup plugin that copies a manifest template file from a source
 * directory to a target browser directory. The template file is then processed and updated with the
 * path of built `js` files found in the target asset directory. The function operates during the
 * `post` enforcement stage of the Rollup build lifecycle.
 *
 * @param {object} options - The options object.
 * @param {string} options.src - The relative path to the source manifest template file.
 * @param {string} options.dist - The relative path to the distribution directory.
 * @param {string} options.browser - The manifest target browser.
 * @returns {Plugin} A Rollup Plugin that performs the processing of the manifest file.
 */
function createManifest(
  { src, dist, browser }: { src: string, dist: string, browser: string }
): Plugin {
  return {
    name: 'create-manifest',
    enforce: 'post',
    writeBundle() {
      // export manifest template
      const assets = `./${dist}/${browser}/assets`;
      const target = `./${dist}/${browser}/manifest.json`;
      fs.copyFileSync(
        path.resolve(__dirname, src),
        path.resolve(__dirname, target)
      );

      // render manifest template
      let template = fs.readFileSync(target, 'utf-8');
      fs.readdirSync(assets).forEach(file => {
        if (file.match(/^content.*\.js$/)) {
          template = template.replace('{{content}}', file);
        }
        if (file.match(/^service.*\.js$/)) {
          template = template.replace('{{service}}', file);
        }
      });
      fs.writeFileSync(target, template);
    },
  };
}

/**
 * Creates a zip bundle of a given distributed target browser directory.
 *
 * This function creates a Rollup plugin that compresses a given directory into a zip file with a
 * high compression level. It operates during the `post` enforcement stage of the Rollup build
 * lifecycle. If the distribution packages directory does not exist, it will be created. The bundle
 * will be named according to the provided browser name and placed in the distribution package
 * directory.
 *
 * @param {object} options - The options object.
 * @param {string} options.dist - The relative path to the distribution directory.
 * @param {string} options.browser - The target browser for the bundle (without .zip extension).
 * @returns {Plugin} A Rollup Plugin that performs the compression of the directory into a zip file.
 */
function createBundle(
  { dist, browser }: { dist: string, browser: string }
): Plugin {
  return {
    name: 'create-bundle',
    enforce: 'post',
    writeBundle() {
      // check if bundling is enabled
      if (!env.bundle) return;

      // create output directory if it does not exist
      if (!fs.existsSync(`${dist}/packages`)) {
        fs.mkdirSync(`${dist}/packages`, { recursive: true });
      }

      // create zip archive
      const stream = fs.createWriteStream(`${dist}/packages/${browser}.zip`);
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
 * Generates the Vite configuration object for a browser extension project.
 *
 * This function uses the command line arguments and the provided `command` and `mode` to generate
 * an appropriate Vite configuration object. The output directory is extracted from the command line
 * arguments, and the distribution directory and target browser are  parsed from the output
 * directory path. The function also sets up the server, preview, plugins, build, and test
 * configurations for Vite. The plugins configuration includes the `createManifest` and
 * `createBundle` functions to process the manifest file and create a zip bundle of the output
 * directory.
 *
 * @param {object} args - The object containing the command and mode.
 * @param {string} args.command - The command given to Vite, e.g., 'build'.
 * @param {string} args.mode - The mode in which Vite is running.
 * @returns {object} The Vite configuration object.
 */
export default defineConfig(({ command, mode }) => {
  // retrieve output directory
  const outDir = getArgValue('outDir') || env.outDir;

  // retrieve distribution and target browser directory
  const outDirIndex = outDir.lastIndexOf('/');
  if (outDirIndex === -1) throw new Error('invalid output directory path');
  const dist = outDir.slice(0, outDirIndex);
  if (!dist) throw new Error('missing distribution directory in output directory path');
  const browser = outDir.slice(outDirIndex + 1);
  if (!browser) throw new Error('missing browser extension in output directory path');

  // generate configuration
  console.log(`processing "${browser}" browser extension ${command} in "${mode}" mode...`);

  return {
    cacheDir: './node_modules/.vite/suntzu',

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
      createManifest({
        src: `./src/browsers/manifest.${browser}.json`,
        dist,
        browser,
      }),
      createBundle({
        dist,
        browser,
      }),
    ],

    build: {
      rollupOptions: {
        input: {
          index: './index.html',
          content: './src/scripts/content/index.ts',
          service: './src/scripts/service/index.ts',
        },
        output: {
          dir: outDir,
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].[ext]',
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
