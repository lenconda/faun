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

- Light weight: only 17 kB with terser
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
- [ ] More lifecycle hooks integration
- [ ] Custom plugins support
- [ ] Global interceptors support
- [ ] Development kit support

## FAQ

Coming soon...

## Community

Coming soon...

## Contributing

We are grateful for your selfless contribution to the project. We hope that contributing to this project would be as simple and transparent as possible, regardless whatever it is (including but not limited to):

- Reporting bugs
- Fixing bugs
- Submitting Pull Requests
- Suggestions for new feature(s)
- Becoming a maintainer (for this project)

The following content is a serial of guidelines for contributing to `Polyatomic`. Before starting your work, you are supposed to read the following advice:

- Understand what changes you want to make
- Look through the issue list and check if there's an issue to solve the same problem
- **Publish** or/and **redistribute** this project should under [WTFPL](LICENSE) license

### Our Code of Conduct

We have proposed a [Code of Conduct](CODE_OF_CONDUCT.md) to *regulate* the behavior of each participant. We sincerely hope each participant would be able to firmly entrenched to this conduct. Therefore, please take some time to read the full content of it.

### We are Using Git Flow

We are currently working under [GitHub Flow](https://guides.github.com/introduction/flow/index.html), which is the best practices recommended by GitHub through Pull Requests. Our three permanent branches are as below:

- `master`: keeps consistent with the latest stable code only
- `dev`: stores code that under developing, testing, and next feature
- `docs`: keeps up with `dev`, but ahead of `dev` in documentation.

New branches could be checked out from these branches, and also allowed to be merged into the three branches:

- `master`
  - `fix-${FIX_NAMESPACE}` or `hotfix-${HOTFIX_NAMESPACE}`: fix some bugs
  - `dev` (Already checked out)
- `dev`
  - `feature-${FEATURE_NAMESPACE}`: add some new features
  - `refactor-${REFACTOR_NAMESPACE}`: refactor or delete some code in current branch
  - `docs` (Already checked out)
- `docs`
  - `feature-doc-${DOC_NAMESPACE}`: Add new docs for a new feature
  - `refactor-doc-${DOC_NAMESPACE}`: Refactor or delete docs
  - `fix-doc-${DOC_NAMESPACE}`: Fix typo or syntax

> [NOTE] `master`, `dev` and `docs` are not allowed to force push, neither participants nor maintainers.

The follow tips help you get familiar to make a Pull Request:

- Adding a feature
  - Checkout from `dev` to a new branch, or fork this repo from `dev` to your own repo
  - If you added some code that should be tested, please add corresponding test scripts and make sure all tests would pass
  - If you modified APIs and/or functionalities, add corresponding docs JUST IN CURRENT BRANCH (cause it is unnecessary to checkout a new branch from `docs`)
  - Lint your code before committing
- Refactoring code
  - The same as *Adding a feature*

### Report Bugs and Suggestions Using Issues

We are using [Issues](https://github.com/lenconda/polyatomic/issues) to track bugs and suggestions. As mentioned above, before starting your work, please check [Issues](https://github.com/lenconda/polyatomic/issues) first. Known bugs, problems and coming, under-developing features would possibly shown in issues.

### Bug Reports Should be Readable

An acceptable format of a report should be:

```
Version: # get the version from package.json
System:
  Node Version:
  System:
  System Version (Kernel Version):
  Browser User-Agent:
Description:
  Expected:
  Result:
```

### Commit Message Should be Readable

An acceptable format of a commit message should be:

```
<type>(<scope>): <subject><mentioning>
```

These types of commit messages are acceptable:

- `feat`: new feature
- `refactor`: refactoring code
- `remove`: removing code
- `test`: adding, removing, modifying test scripts
- `deps`: dependencies related operations
- `fix`: fix bugs
- `chore`: modifying tools

These scopes of commit messages are acceptable:

- `doc`: related to docs
- `function`: related to functions or methods
- `api`: related to APIs
- `deploy`: related to deployments

Do not forget mentioning issues that related to your work, such as `closes #1`.

## Acknowledgements

- [single-spa](https://github.com/CanopyTax/single-spa) What an awesome meta-framework for micro-frontends!
- [umijs/qiankun](https://github.com/umijs/qiankun) 📦🚀Blazing fast, simple and completed solution for micro frontends.
- [ice-lab/icestark](https://github.com/ice-lab/icestark) 🐯 Micro Frontends solution for large application

## License

`Polyatomic` is licensed under [WTFPL](LICENSE).
