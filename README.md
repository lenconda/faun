# Faun

![Circle CI Build](https://circleci.com/gh/lenconda/faun/tree/dev.svg?style=svg)
![License](https://img.shields.io/github/license/lenconda/faun)
![GitHub Version](https://img.shields.io/github/package-json/v/lenconda/faun)


`Faun` is a light-weight library to easily make [micro-frontend](https://micro-frontends.org/) applications.

## Introduction

If we treat a huge front-end application as a molecule application, we can just make several atomic applications, and then gather them together with some proper combinations and make it sense to constitute the molecule application. It is what [micro-frontend](https://micro-frontends.org/) aims for.

Yet, when we trying to break down a huge application into several independent sub-applications, we might stuck in trouble with some annoying problems, such as:

- The form to organize sub-applications
  - Where to host sub-applications' bundles and static assets
  - How could a sub-application communicate with other sub-application or framework
- The behavior when handling router change
  - When route changes, what should be load, and what should be unload
  - How to clean up the global variables, event listeners, and so on

To avoid making the rules for every applications repeatedly, we made a common rule for building micro-frontend applications, and abstracted them into a library, named `Faun`.

> [NOTE] `Faun` is only an implementation of the rules we made and the definition from [Micro Frontend](https://micro-frontends.org/), which does not mean `Faun` could be used as a production-ready micro-frontend framework.

## Features

- Light weight: only 54 kB with terser
- COMPLETELY framework-independent
- Control the sub-applications by sandboxes and snapshots
- Load sub-applications based on JavaScript entries
- Style isolation supported
- History routing cache supported
- Lifecycle hooks integration
- Global event bus integration for communication

## Installation

> The package is now under development mode, if you seriously want to play with it, just read [Getting Started](#getting-started)

Since the package was ready to switch itself as a published NPM package, its name would be `faun` at NPM registry, in the near future, it could be installed by:

```bash
$ npm install faun
```

Another way to install it is link the AMD-bundled `faun.min.js` through `script` tag:

```javascript
<script src="https://unpkg.com/faun@latest/dist/umd/faun.min.js"></script>
```

## Documentation

Seriously coming soon, now part of the documentation is already in `docs` folder.

## Getting Started

To run the project and the examples, you should clone the repository from GitHub:

```bash
$ git clone https://github.com/lenconda/faun.git
```

Then install the dependencies. The repository's dependencies are managed by `npm`:

```bash
$ cd faun
$ npm i
```

Then you would have to install the dependencies for framework application and sub-applications:

```bash
$ npm run examples:install:vue
$ npm run examples:install:react
$ npm run examples:install:framework
```

If it is a mode that you think is troublesome and makes you dislike it, just run:

```bash
$ npm run examples:install
```

This command will serially install all dependencies for those applications.

It is the time to run the examples:

```bash
$ npm run examples:start:vue
$ npm run examples:start:react
$ npm run examples:start:angular
$ npm run examples:start:svelte
$ npm run examples:start:framework
```

Or by executing a simpler command:

```bash
$ npm examples:start
```

This command will start framework and sub-applications in parallel.

After finishing the steps above, and if everything goes well, these examples may already be running correctly, the examples will listen to following addresses:

- Framework App: `http://localhost:8080`, if there is another process listening on it, the framework will look backward to find a free port, such as `http://localhost:8081`
- Vue App: `http://localhost:8181`
- React App: `http://localhost:8182`
- Angular App: `http://localhost:8183`
- Svelte App: `http://localhost:8184`

Make sure `8181` to `8184` are not listened by other processes.

You just open the browser and visit the framework's address.

## Todo

- [x] Global key-value storage support
- [x] Custom plugins support
- [ ] Global interceptors support
- [ ] Development kit support
- [ ] Higher test coverage
- [x] API docs

## FAQ

Checkout FAQ at [here](https://faun.lenconda.top/#/faq/).

> You can make some questions at [issues](https://github.com/lenconda/faun/issues) **with `FAQ` tag**, or directly contact me at [i@lenconda.top](mailto:i@lenconda.top) or [prexustech@gmail.com](mailto:prexustech@gmail.com).

## Community

[lenconda/faun/issues](https://github.com/lenconda/faun/issues)

## Contributing

Just tell us what can we do for you! Before contributing, please check the [Issues](https://github.com/lenconda/faun/issues) first for existing bugs and/or suggestions.

Want to be a contributor? Please refer to our [Contribution Guide](CONTRIBUTING.md).

Grazie to all contributors!

## Acknowledgements

- [single-spa](https://github.com/CanopyTax/single-spa) What an awesome meta-framework for micro-frontends!
- [umijs/qiankun](https://github.com/umijs/qiankun) 📦🚀Blazing fast, simple and completed solution for micro frontends.
- [ice-lab/icestark](https://github.com/ice-lab/icestark) 🐯 Micro Frontends solution for large application

## License

`Faun` is licensed under [WTFPL](LICENSE).
