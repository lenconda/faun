# Destruction

![Travis Build](https://img.shields.io/travis/lenconda/destruction)
![License](https://img.shields.io/github/license/lenconda/destruction)
![GitHub Version](https://img.shields.io/github/package-json/v/lenconda/destruction)


`Destruction` is a light-weight library to easily make [micro-frontend](https://micro-frontends.org/) applications.

## Introduction

`Destruction` means an object composed with multiple atoms, which is called *molecule*. The molecule could be divided into multiple atoms, and atoms could work relatively dependently.

Therefore, if we treat a huge front-end application as a molecule application, we can just make several atomic applications, and then gather them together with some proper combinations and make it sense to constitute the molecule application. It is what [micro-frontend](https://micro-frontends.org/) aims for.

Yet, when we trying to break down a huge application into several independent sub-applications, we might stuck in trouble with some annoying problems, such as:

- The form to organize sub-applications
  - Where to host sub-applications' bundles and static assets
  - How could a sub-application communicate with other sub-application or framework
- The behavior when handling router change
  - When route changes, what should be load, and what should be unload
  - How to clean up the global variables, event listeners, and so on

To avoid making the rules for every applications repeatedly, we made a common rule for building micro-frontend applications, and abstracted them into a library, named `Destruction`.

> [NOTE] `Destruction` is only an implementation of the rules we made and the definition from [Micro Frontend](https://micro-frontends.org/), which does not mean `Destruction` could be used as a production-ready micro-frontend framework.

## Features

- Light weight: only 47 kB with terser
- COMPLETELY framework-independent
- Control the sub-applications by sandboxes and snapshots
- Load sub-applications based on JavaScript entries
- Style isolation supported
- History routing cache supported
- Lifecycle hooks integration
- Global event bus integration for communication

## Installation

> The package is now under development mode, if you seriously want to play with it, just read [Getting Started](#getting-started)

## Documentation

Coming soon...

## Getting Started

To run the project and the examples, you should clone the repository from GitHub:

```bash
$ git clone https://github.com/lenconda/destruction.git
```

Then install the dependencies. The repository's dependencies are managed by `npm`:

```bash
$ cd destruction
$ npm i
```

Then you would have to install the dependencies for framework application and sub-applications:

```bash
$ npm run install:vue
$ npm run install:react
$ npm run install:framework
```

If it is a mode that you think is troublesome and makes you dislike it, just run:

```bash
$ npm run example:install
```

This command will serially install all dependencies for those applications.

It is the time to run the examples:

```bash
$ npm run start:vue
$ npm run start:react
$ npm run start:framework
```

Or by executing a simpler command:

```bash
$ npm run example:start
```

This command will start framework and sub-applications in parallel.

After finishing the steps above, and if everything goes well, these examples may already be running correctly, the examples will listen to following addresses:

- Framework App: `http://localhost:8080`, if there is another process listening on it, the framework will look backward to find a free port, such as `http://localhost:8081`
- Vue App: `http://localhost:8181`
- React App: `http://localhost:8182`

Make sure `8081` and `8082` are not listening by another process.

You just open the browser and visit the framework's address.

## Todo

- [ ] Global key-value storage support
- [ ] More lifecycle hooks integration
- [ ] Custom plugins support
- [ ] Global interceptors support
- [ ] Development kit support

## FAQ

Coming soon...

## Community

Coming soon...

## Contributing

Just tell us what can we do for you! Before contributing, please check the [Issues](https://github.com/lenconda/destruction/issues) first for existing bugs and/or suggestions.

Want to be a contributor? Please refer to our [Contribution Guide](CONTRIBUTING.md).

Grazie to all contributors!

## Acknowledgements

- [single-spa](https://github.com/CanopyTax/single-spa) What an awesome meta-framework for micro-frontends!
- [umijs/qiankun](https://github.com/umijs/qiankun) 📦🚀Blazing fast, simple and completed solution for micro frontends.
- [ice-lab/icestark](https://github.com/ice-lab/icestark) 🐯 Micro Frontends solution for large application

## License

`Destruction` is licensed under [WTFPL](LICENSE).
