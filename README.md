<p align="center">
  <a href="https://suntzu.gg"><img src="./docs/assets/banner.png" alt="Suntzu"></a>
</p>
<p align="center">
    <em>“ If you know the enemy and know yourself, you need not fear the result of a hundred battles. If you know yourself but not the enemy, for every victory gained you will also suffer a defeat. If you know neither the enemy nor yourself, you will succumb in every battle. ”</em>
</p>

---

**Documentation**: <a href="https://suntzu.gg/docs" target="_blank">https://suntzu.gg/docs</a>

**Source Code**: <a href="https://github.com/rodolphebarbanneau/suntzu" target="_blank">https://github.com/rodolphebarbanneau/suntzu</a>

**Discord**: <a href="https://discord.gg/eXqmagTNrr" target="_blank">https://discord.gg/eXqmagTNrr</a>

---

## Extension

✨ Enhancing [FACEIT](https://www.faceit.com) experience with detailed matchmaking insights.

| Browser | Status | Marketplace | Docs for developpers |
| ------- | ------ | ----------- | ------------- |
| Chrome  | ✅ | TBA | [Getting Started ⇲](https://developer.chrome.com/docs/extensions/mv3/getstarted) |
| Firefox | ✅ | TBA | [Getting Started ⇲](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension) |
| Opera   | ✅ | TBA | [Getting Started ⇲](https://dev.opera.com/extensions/) |
| Edge    | 😓 | TBA | [Getting Started ⇲](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/part1-simple-extension?tabs=v3) |

The extension distribution will generate a folder with the following structure:
```
extension/
├── assets/
│   ├── content-xxx.js
│   ├── index-xxx.js
│   ├── service-xxx.js
│   └── ...
├── images/
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   └── icon-128.png
├── favicon.ico
├── index.html
└── manifest.json
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

## [Connect with us on Discord 🎯](https://discord.gg/eXqmagTNrr)
