---
hero:
  title: Faun
  desc: 📦 Fast, general and light-weight library for building micro-frontend apps.
  actions:
    - text: Getting Started
      link: /guide
footer: Open-source MIT Licensed | Copyright © 2020<br />Powered by [dumi](https://d.umijs.org)
---

## Installation

```bash
$ npm install faun -S

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
      name: 'demo_vue_app',
      activeWhen: '/vue',
      scripts: [
        '//localhost:8181/app.js',
      ],
      styles: [],
      mountPointID: 'app',
      useCSSPrefix: false,
      assetPublicPath: '//localhost:8181',
    },
    {
      name: 'demo_react_app',
      activeWhen: '/react',
      scripts: [
        '//localhost:8182/static/js/main.bundle.js',
      ],
      styles: [
        '//localhost:8182/static/css/main.css',
      ],
      mountPointID: 'root',
      useCSSPrefix: false,
      assetPublicPath: '//localhost:8182',
    },
  ],
  {
    loading: function(pathname) {
      console.log('loading', this);
      console.log('pathname: ', pathname);
    },
    // ...
  },
);

app.run();
```
