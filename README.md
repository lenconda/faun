# Polyatomic

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

## Installation

> The package is now under development mode, if you seriously want to play with it, just read (Getting Started)[#getting-started]

## Getting Started
