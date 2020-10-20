---
title: faun
hero:
  title: faun
  desc: 📦 快速、通用、轻量级的微前端解决方案。
  actions:
    - text: 快速上手
      link: /guide
footer: Open-source MIT Licensed | Copyright © 2020<br />Powered by [dumi](https://d.umijs.org)
---

<div style="height: 20px;"></div>

## 安装

```bash
$ npm i faun -S
# 或者
$ yarn add faun
```

## 快速开始

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
