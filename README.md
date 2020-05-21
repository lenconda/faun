# Polyatomic

![Travis Build](https://img.shields.io/travis/lenconda/polyatomic)
![License](https://img.shields.io/github/license/lenconda/polyatomic)
![GitHub Version](https://img.shields.io/github/package-json/v/lenconda/polyatomic)


`Polyatomic` is a light-weight library to easily make [micro-frontend](https://micro-frontends.org/) applications.

## Introduction

`Polyatomic` means an object composed with multiple atoms, which is called *molecule*. The molecule could be divided into multiple atoms, and atoms could work relatively dependently.

Therefore, if we treat a huge front-end application as a molecule application, we can just make several atomic applications, and then gather them together with some proper combinations and make it sense to constitute the molecule application. It is what [micro-frontend](https://micro-frontends.org/) aims for.

Yet, when we trying to break down a huge application into several independent sub-applications, we might stuck in trouble with some annoying problems, such as:

- The form to organize sub-applications
  - Where to host sub-applications' bundles and static assets
  - How could a sub-application communicate with other sub-application or framework
- The behavior when handling router change
  - When route changes, what should be load, and what should be unload
  - How to clean up the global variables, event listeners, and so on

To avoid making the rules for every applications repeatedly, we made a common rule for building micro-frontend applications, and abstracted them into a library, named `Polyatomic`.

> [NOTE] `Polyatomic` is only an implementation of the rules we made and the definition from [Micro Frontend](https://micro-frontends.org/), which does not mean `Polyatomic` could be used as a production-ready micro-frontend framework.

## Features

- Load resources based on JavaScript entries
- JavaScript sandboxes supported
- Control the sub-applications through sandboxes and snapshots
- Routing cache supported
- Style isolation supported
- Lifecycle hooks integration
- Global event bus integration

## Installation

> The package is now under development mode, if you seriously want to play with it, just read [Getting Started](#getting-started)

## Documentation

Coming soon...

## Getting Started

To run the project and the examples, you should clone the repository from GitHub:

```bash
$ git clone https://github.com/lenconda/polyatomic.git
```

Then install the dependencies. The repository's dependencies are managed by `npm`:

```bash
$ cd polyatomic
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
- [ ] Development kit to help increase efficiency
- [ ] More lifecycle hooks integration
- [ ] Custom hooks and plugins support

## FAQ

Coming soon...

## Community

Coming soon...

## Contributing

We are grateful for your selfless contribution to the project. The following content is a serial of guidelines for contributing to `Polyatomic`.

Please spend several minutes reading these guidelines before you create an issue or pull request.

Before you starting your contribution work, you are supposed to read the following advice:

- Read the [README](README.md) first
- Understand what changes you want to make
- Look through the issue list and check if there's an issue to solve the same problem
- **Publish** or/and **redistribute** this project should under [WTFPL](LICENSE) license

### Code of Conduct

We have proposed a [Code of Conduct](CODE_OF_CONDUCT.md) to *regulate* the behavior of each participant. We are sincerely hope each participant would be able to firmly entrenched to this conduct. Therefore, please take some time to read the full content of it.

### Branches

We are currently maintaining three branches: `master` for publishing and deploying the stable features, `dev` for testing new features and `docs` for update the docs.

Normally, when developing a new feature, you should checkout a new branch from `dev`, named as `feature/${FEATURE_NAME}`, the `FEATURE_NAME` is supposed to summarize the new feature. The feature branches will ultimately be merged into `dev` branch. When fixing a bug, you should checkout a new branch from `master` or `dev`, named as `hotfix/${FIX_NAME}` or `fix/${FIX_NAME}`. Once you make a [Pull Request](https://github.com/lenconda/polyatomic/pulls) from GitHub to apply to merge the fix branch and if there are issues related to this, you should mention them in your pull message.

### Issues

As said above, before you starting your work, you should check [Issues](https://github.com/lenconda/polyatomic/issues) first. The issue list of this project can probably contains known bugs, problems, new demands and future development plans. If you can find an issue or many issues that solves the same problem, it would be great if you can join them to solve the problem.

### Fork & Pull Requests

You should fork this repository if you want to contribute your code into this project.

If you want to commit your changes, you are supposed to make a [Pull Request](https://help.github.com/articles/about-pull-requests/), once you submit the request, the review process will start, if the code meets the requirements, the pull request will pass, and then your code will be in the project. If the request does not be passed, please contact [i@lenconda.top](mailto:i@lenconda.top) or [prexustech@gmail.com](mailto:prexustech@gmail.com).

## Acknowledgements

- [single-spa](https://github.com/CanopyTax/single-spa) What an awesome meta-framework for micro-frontends!
- [umijs/qiankun](https://github.com/umijs/qiankun) 📦🚀Blazing fast, simple and completed solution for micro frontends.
- [ice-lab/icestark](https://github.com/ice-lab/icestark) 🐯 Micro Frontends solution for large application

## License

[WTFPL](LICENSE) &copy; [lenconda](https://github.com/lenconda)<[i@lenconda.top](mailto:i@lenconda.top)>
