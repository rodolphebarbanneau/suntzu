<p align="center">
  <a href="https://suntzu.gg"><img src="./docs/assets/banner.png" alt="Suntzu"></a>
</p>
<p align="center">
    <em>“ If you know the enemy and know yourself, you need not fear the result of a hundred battles. If you know yourself but not the enemy, for every victory gained you will also suffer a defeat. If you know neither the enemy nor yourself, you will succumb in every battle. ”</em>
</p>
<br/>
<img src="./docs/assets/demo.gif" alt="Suntzu (demo)">

---

**Discord** - <a href="https://discord.gg/eXqmagTNrr" target="_blank"><i>https://discord.gg/eXqmagTNrr</i></a>
<br/>
**Documentation** - <a href="https://suntzu.gg/docs" target="_blank"><i>https://suntzu.gg/docs</i></a>
<br/>
**Source Code** - <a href="https://github.com/rodolphebarbanneau/suntzu" target="_blank"><i>https://github.com/rodolphebarbanneau/suntzu/tree/main/src</i></a>

---

## Extension

✨ Enhancing [FACEIT](https://www.faceit.com) experience with detailed matchmaking insights.

| Browser | Status | Marketplace | Docs for developpers |
| ------- | ------ | ----------- | ------------- |
| Chrome | ✅ | TBA 😓 | [Getting Started ⇲](https://developer.chrome.com/docs/extensions/mv3/getstarted) |
| Edge _(chrome)_ | ✅ | TBA 😓 | [Getting Started ⇲](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/part1-simple-extension?tabs=v3) |
| Opera _(chrome)_ | ✅ | TBA 😓 | [Getting Started ⇲](https://dev.opera.com/extensions/) |
| Firefox | ✅ | TBA 😓 | [Getting Started ⇲](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension) |

The extension distribution will generate a folder for the target browser with the following structure:
```
dist/
├── chrome/
│   ├── assets/
│   │   ├── content-xxx.js
│   │   ├── index-xxx.js
│   │   ├── service-xxx.js
│   │   └── ...
│   ├── images/
│   │   ├── icon-16.png
│   │   ├── icon-32.png
│   │   ├── icon-48.png
│   │   └── icon-128.png
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── ...
```

## Initialize repo

Install `nx` globally and load dependencies:
```
npm install -g nx
npm install
```

## Start the app 

To start using the extension in development environment, run first `nx bundle suntzu`. Then, add manually the extension to your favorite browser or use VS Code with the provided debugging task `Attach Viewer (chrome)`.

Happy gaming!

## Running tasks

To execute tasks with Nx use the following syntax:
```
nx <target> <project> <...options>
```

You can also run multiple targets:
```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects
```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/core-features/run-tasks).

## Ready to deploy?

Just run `nx build suntzu` to build the application. The build artifacts will be stored in the `dist/` directory, ready to be deployed.

## Connect with us!

- [**Follow us on X**](https://x.com/suntzugg)
- [**Join the Discord community 🎯**](https://discord.gg/eXqmagTNrr)
