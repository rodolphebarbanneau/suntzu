<p align="center">
  <a href="https://suntzu.gg"><img src="./www/assets/suntzu-banner.png" alt="FastAPI"></a>
</p>
<p align="center">
    <em>Enhancing <a href="https://www.faceit.com">FACEIT</a> experience with detailed matchmaking insights</em>
</p>

---

**Documentation**: <a href="https://suntzu.gg/docs" target="_blank">https://suntzu.gg/docs</a>

**Source Code**: <a href="https://github.com/rodolphebarbanneau/suntzu" target="_blank">https://github.com/rodolphebarbanneau/suntzu</a>

---

## Extension

| Browser | Status | Marketplace | Documentation |
| ------- | ------ | ----------- | ------------- |
| Chrome  | ✅ | | [Getting Started](https://developer.chrome.com/docs/extensions/mv3/getstarted/) |
| Firefox | ✅ | | |
| Edge    | 😓 | | |
| Opera   | 😓 | | |

The extension distribution will generate a folder with the following structure:
```
extension/
├── images/
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   └── icon-128.png
├── scripts/
│   ├── content.css
│   ├── content.js
│   ├── index.css
│   ├── index.js
│   └── service.js
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

## Want better Editor Integration?

Have a look at the [Nx Console extensions](https://nx.dev/nx-console). It provides autocomplete support, a UI for exploring and running tasks & generators, and more! Available for VSCode, IntelliJ and comes with a LSP for Vim users.

## Ready to deploy?

Just run `nx build suntzu` to build the application. The build artifacts will be stored in the `dist/` directory, ready to be deployed.

## Connect with us!

- [Join the community](https://www.reddit.com/r/suntzugg)
- [Follow us on Twitter](https://twitter.com/suntzugg)
