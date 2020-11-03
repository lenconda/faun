---
title: faun
hero:
  title: faun
  desc: 📦 快速、通用、轻量级的微前端解决方案。
  actions:
    - text: 开发指南
      link: /zh/guide
footer: 遵循 MIT 开源协议 | 版权所有 © 2020<br />由 [dumi](https://d.umijs.org) 提供支持
---

<div style="height: 20px;"></div>

## 安装

```bash
$ npm i faun -S
# 或者
$ yarn add faun
```

## 快速上手

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
