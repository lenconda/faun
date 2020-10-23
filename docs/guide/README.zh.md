---
order: 0
toc: 'menu'
title: '开发指南'
nav:
  title: '开发指南'
  order: 0
---

# 开发指南

## 介绍

Faun (国际标准音标：/ˈfɔːn/) 是一个对 [micro-frontends.org](https://micro-frontends.org/) 规范的实现。它旨在提供更简单的构建微前端架构应用的方式，与此同时以最小侵入性将既有应用接入到微前端架构。

### 概念与技术术语

- 微前端：一种用于构建前端微服务化架构应用的技术、实现手段或方法论
- 微前端应用: 使用微前端技术构建的项目或应用
- 框架（或 *框架应用、 主应用*)：加载子应用的容器。并且可以处理全局事件以及存储全局状态
- 子应用：可以被框架应用加载，并且也可以作为一个独立应用单独在特定条件下被部署运行

### 什么是微前端

> 请先阅读[微前端](https://micro-frontends.org/)以及[微前端模式 - ThoughtWorks 技术讨论会](https://www.youtube.com/watch?v=tcQ1nWdb7iw&t=269s)！

正如 [Michael Geers](http://geers.tv/) 在[微前端](https://micro-frontends.org/)中所说：

> 微前端背后的思想就是将一个网站或 Web 应用当作多个独立团队所提供的（用于构成这个网站或 Web 应用的）特性的聚合物。每个团队有他们自己关心和专长的独特的业务领域或任务。一个团队是一个全栈的，并且可以从数据库到用户界面提供全方位开发支持。

与[前端巨石应用](https://www.youtube.com/watch?v=pU1gXA0rfwc)相反，微前端应用聚合了很多独立的子应用，其核心思想如下：

- **技术栈黑盒化**

每个团队都可以不受其他团队约束地选择和升级他们的技术栈。自定义元素是一个面向其他团队提供完整接口时隐藏实现细节的非常棒的方式。

- **代码隔离**

即使所有的团队都使用同一个框架，也不要共享同一个运行时。构建可以自托管的独立应用，并且不要依赖共享的状态或全局变量。

- **建立团队前缀规则**

在代码隔离尚无法做到的地方就命名约定达成一致：在 CSS 命名空间、事件、LocalStorage 以及 Cookie 上避免冲突以及分清所有权。浏览器原生特性优先，而不是自定义 API 优先。使用浏览器事件进行通信，而不是创建全局的发布订阅系统。如果确实必须提供跨团队 API，尝试使它尽可能地简单。

- **构建健壮性足够的应用**

即使 JavaScript 出错或一直没有被执行，你提供的功能也应该是有效的。使用单一通用的渲染方式以及渐进增强方案来提高可以预见的性能。

### Faun 是如何运行的

To get understand of how Faun works, here we put an image to show the main processes of what will Faun do when starting a micro-frontend-powered application:

<img src="../_media/faun.png" width="40%" />

Firstly, Faun uses `history` to manage the top-level routes, especially listens on route changes. All the route and sandbox changes would be managed by the `history` listener.

Once the `history.push` is triggered, Faun will call the loaders to load resources, and finally mount the resources on framework. Faun abstracts this process as an independent component, named *Sandbox*. Sandbox is the container of a sub-application in Faun, which provides a pure environment for each sub-application. When the user request a path of the application, the framework would make a request to a server to obtain the sub-application configuration map for this application.

Then Faun would load sandbox with the top-level route. For example, if a user request a route like `https://foo.com/bar/baz` while base path was set as `http://foo.com/`, while `/bar` hits the route config, Faun will create a new sandbox to load resources, and take snapshots from `window`.

In the meantime, sandbox will overwrite DOM operations on `Element.prototype` (such as `appendChild`, `insertBefore`) and `window.addEventListener` in order to catch snapshot and make some mutations.

A polyfilled `MutationObserver` would be settled in order to catch the DOM changes and push them in an array. When unloading sandbox, the elements in this array would be removed.

> It is worth paying attention that Faun will only match the first level of the route: if get a path like `/bar/baz`, it will only take `/bar` to find a matching route config. Downward routes, like `/baz`, would be taken over by current sub-application.

After finishing loading resources, sandbox will execute the bundle by `new Function()`, and the other resources by appending child nodes into targeted parent nodes.

When the top-level route changing, the former sandbox will unmount, then mount next sandbox with the new path. The `loading`, `loaded`, `mounted`, `beforeUnmount` and `umounted` lifecycle hooks will be triggered when changing route.

### Features

All the features are updated in [here](https://github.com/lenconda/faun/tree/docs#features)

## Migrate or Create a New Faun Application

### Provide a Framework Application

The simplest HTML structure Faun required is:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title></title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
  </head>
  <body></body>
</html>
```

Route links that could be intercepted by Faun should be added a `data-faun-link` attribute:

In HTML or Vue template or JSX:

```html
<!-- It will be intercepted by Faun's history listener -->
<a href="/foo" data-faun-link>Foo</a>

<!-- It will not be intercepted by Faun, just jump to /foo/index.html -->
<a href="/foo"></a>
```

Install Faun:

```bash
$ npm i faun -S
# or
$ yarn add faun
```

Import Faun in your framework:

**By CommonJS:**

```javascript
const Faun = require('faun').default;
```

**By ES Module:**

```javascript
import Faun from 'faun';
```

**By UMD:**

```html
<script src="https://unpkg.com/faun@latest/dist/umd/faun.min.js"></script>
```

**By AMD:**

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"></script>
<script src="https://unpkg.com/faun@latest/dist/amd/faun.min.js"></script>
<script type="text/javascript">
  require(['faun@$VERSION'], function(Faun) {
    // do something with Faun
  });
</script>
```

Initialize the framework application with:

```javascript
const app = new Faun();
```

Register sub-applications map, for example:

```javascript
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
      entry: {
        scripts: [
          '//localhost:8182/static/js/main.bundle.js',
        ],
        styles: [
          '//localhost:8182/static/css/main.css',
        ],
      },
      container: document.querySelector('#root'),
      assetPublicPath: '//localhost:8182',
    },
  ],
);
```

it is also easy to load route configuration from a remote server:

```javascript
fetch('https://foo.com/api/routes')
  .then(routes =>
    app.registerModules(routes.json())
  );
```

Define a listener for hooks:

```javascript
app.registerSubApplications(
  [
    // ...
  ],
  {
    loading: pathname => {
      console.log('loading', this);
      console.log('pathname: ', pathname);
    },
    // ...
  },
);
```

Finally, run the framework:

```javascript
app.run();
```

### Migrate Sub Applications

Since Faun is low invasive, we can just make a few modifications on sub-applications. The ONLY thing that you might have to pay attention to is that make sure all of the CSS and JavaScript resource URLs are right when sending to framework application.

It is usually seen that many Webpack applications has assets' `output.publicPath` like `/`. Since the application's URL is not the same as framework's, it could cause `404` errors when loading chunked assets.

To avoid this, we recommend to modify `output.publicPath` with absolute hostname. For example, an application is deployed at `example.com`, the `output.publicPath` could be `//example.com`.

Faun's sandbox also provide a more perfect method: `assetURLMapper` to modify URLs, just add it in your sub-application config map:

```javascript
app.registerSubApplications({
  // ...
  '/app': {
    entry: {
      scripts: [
        // ...
      ],
      styles: [
        // ...
      ],
      // ...
    },
    assetURLMapper: url => mapURL(url),
  },
});
```

the `assetURLMapper` method should return a new URL which is the right one to load resources.

### Config the Servers

## Advanced Guide

### Define a Container

### Clean DOM When Unmounting or Not

### CSS Prefixes

### Static Resource URL Prefixes

### Event and Store
