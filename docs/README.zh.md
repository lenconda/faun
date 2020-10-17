---
hero:
  title: faun
  desc: 📦 快速、通用、轻量级的微前端解决方案。
  actions:
    - text: 快速上手
      link: /guide
footer: Open-source MIT Licensed | Copyright © 2020<br />Powered by [dumi](https://d.umijs.org)
---

## 安装

```bash
$ npm i faun -S

# 或

$ yarn add faun
```

## 快速上手

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
