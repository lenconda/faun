---
title: faun
hero:
  title: faun
  desc: 📦 Fast, general and light-weight library for building micro-frontend apps.
  actions:
    - text: Getting Started
      link: /guide
footer: Open-source MIT Licensed | Copyright © 2020<br />Powered by [dumi](https://d.umijs.org)
---

<div style="height: 20px;"></div>

## Installation

```bash
$ npm i faun -S
# or
$ yarn add faun
```

## Getting Started

```js
import Faun from 'faun';

const app = new Faun();

app.registerSubApplications(
  [
    {
      name: 'app1',
      activeWhen: '/app1',
      entry: {
        scripts: [
          '//app1.example.com/app.js',
        ],
      },
      container: 'app',
      assetPublicPath: '//app1.example.com',
    },
    {
      name: 'app2',
      activeWhen: '/app2',
      entry: {
        scripts: [
          '//app2.example.com/static/js/main.bundle.js',
        ],
        styles: [
          '//app2.example.com/static/css/main.css',
        ],
      },
      container: document.querySelector('#root'),
      assetPublicPath: '//app2.example.com',
    },
  ],
  {
    loading: pathname => {
      console.log('loading: ', this);
      console.log('pathname: ', pathname);
    },
    beforeUnmount: (prev, next) => {
      console.log('prev: ', prev);
      console.log('next: ', next);
      return true;
    },
    // ...
  },
);

app.run();
```
