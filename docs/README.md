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
          '//localhost:8181/app.js',
        ],
      },
      container: 'app',
      assetPublicPath: '//localhost:8181',
    },
    {
      name: 'app2',
      activeWhen: '/app2',
      scripts: [
        '//localhost:8182/static/js/main.bundle.js',
      ],
      styles: [
        '//localhost:8182/static/css/main.css',
      ],
      container: document.querySelector('#root'),
      assetPublicPath: '//localhost:8182',
    },
  ],
  {
    loading: pathname => {
      console.log('loading', this);
      console.log('pathname: ', pathname);
    },
    // ...
  },
);

app.run();
```
