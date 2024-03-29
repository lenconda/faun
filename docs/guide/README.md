---
order: 0
toc: 'menu'
title: 'Guide'
nav:
  title: 'Guide'
  order: 0
---

# Guide

## Introduction

Faun (IPA: /ˈfɔːn/) is an implementation of concepts from [micro-frontends.org](https://micro-frontends.org/). It was designed to make it easier to build micro-frontend applications and at the same time be less intrusive migrating existed project to micro-frontend architecture.

### Concepts and Technical Terms

- Micro Frontend: technology, implemented methods or methodology to build micro-frontend apps
- Micro Frontend Apps: the projects or applications build with micro-frontend technology
- Framework (or *framework-application(s), master-application(s)*): the container to load sub-applications. It also keeps and handles the global events and stores global states
- Sub-application(s): could be loaded by framework-application, but also be able to work independently as an independent application under certain circumstances

### What is Micro-Frontend

> Please check the [Micro Frontends](https://micro-frontends.org/) and [Patterns for Micro Frontends - ThoughtWorks Talks Tech
](https://www.youtube.com/watch?v=tcQ1nWdb7iw&t=269s) first!

As [Michael Geers](http://geers.tv/) said in [Micro Frontends](https://micro-frontends.org/):

> The idea behind Micro Frontends is to think about a website or web app as a composition of features which are owned by independent teams. Each team has a distinct area of business or mission it cares about and specialises in. A team is cross functional and develops its features end-to-end, from database to user interface.

Opposite from [Frontend Monolith](https://www.youtube.com/watch?v=pU1gXA0rfwc), Micro-frontend apps are composition of many independent sub-applications, and the core ideas of micro-frontend are shown as below:

- **Be Technology Agnostic**

Each team should be able to choose and upgrade their stack without having to coordinate with other teams. Custom Elements are a great way to hide implementation details while providing a neutral interface to others.

- **Isolate Team Code**

Don’t share a runtime, even if all teams use the same framework. Build independent apps that are self contained. Don’t rely on shared state or global variables.

- **Establish Team Prefixes**

Agree on naming conventions where isolation is not possible yet. Namespace CSS, Events, Local Storage and Cookies to avoid collisions and clarify ownership.

Favor Native Browser Features over Custom APIs
Use Browser Events for communication instead of building a global PubSub system. If you really have to build a cross team API, try keeping it as simple as possible.

- **Build a Resilient Site**

Your feature should be useful, even if JavaScript failed or hasn’t executed yet. Use Universal Rendering and Progressive Enhancement to improve perceived performance.

### How Does Faun Works

To get understand of how Faun works, here we put an image to show the main processes of what will Faun do when starting a micro-frontend-powered application:

<img src="../_media/faun.png" width="40%" />

Firstly, Faun uses `history` to manage the top-level routes, especially listens on route changes. All the route and sandbox changes would be managed by the `history` listener.

Once the `history.push` is triggered, Faun will call the loaders to load resources, and finally mount the resources on framework. Faun abstracts this process as an independent component, named *Sandbox*. Sandbox is the container of a sub-application in Faun, which provides a pure environment for each sub-application. When the user request a path of the application, the framework would make a request to a server to obtain the sub-application configuration map for this application.

Faun loads sandbox with the top-level route. For example, if a user request a route like `https://foo.com/bar/baz` while base path was set as `https://foo.com/`. If `/bar` hits the route config, Faun will create a new sandbox to load resources, and take snapshots from `window`.

In the meantime, sandbox will overwrite DOM operations on `Element.prototype` (such as `appendChild`, `insertBefore`) and `window.addEventListener` in order to catch snapshot and make some mutations.

A polyfilled `MutationObserver` would be settled in order to catch the DOM changes and push them in an array. When unmounting sandbox, the elements in this array would be removed.

> It is worth paying attention that Faun only matches the first level of the route: if get a path like `/bar/baz`, it will only take `/bar` to find a matching route config. Downward routes, like `/baz`, would be taken over by current sub-application.

After finishing loading resources, sandbox will execute the bundle by `new Function()`, and the other resources by appending child nodes into targeted parent nodes.

When the top-level route changing, the former sandbox will be unmounted, then mount next sandbox with the new path. The `loading`, `loaded`, `mounted`, `beforeUnmount` and `unmounted` lifecycle hooks will be triggered when changing route.

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

To avoid this, we recommend to modify `output.publicPath` with absolute path. For example, an application is deployed at `example.com`, the `output.publicPath` could be `//example.com`.

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
    assetURLMapper: url => `//example.com/${url}`,
  },
});
```

the `assetURLMapper` method should return a new URL which is the right one to load resources.

### Config the Servers

Since Faun loads and obtains resources by sending [Ajax](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX) requests, which would be blocked by [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) of browsers when sub-applications' origin are not the same as framework-application. In this circumstance, you should set the [HTTP CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) header: `Access-Control-Allow-Origin` and set it to your framework-application's origin or `*`.

If the sub-application is served by Nginx, you can just add this parameter to the configuration file:

```nginx
server {
  listen 80;
  server_name app1.example.com;
  # ...
  location / {
    add_header Access-Control-Allow-Origin framework.example.com;
    # ...
  }
}
```

or by Apache:

```apache
Header set Access-Control-Allow-Origin framework.example.com
```

## Advanced Guide

### Define a Container

Each sub-application will choose a DOM node when it is being mounted, which is called *container*. When configuring sub-applications, a `container` parameter should be defined and passed a value typed as `HTMLElement`, a function that returns a `HTMLElement` value or a `string` indicates a DOM node's ID.

e.g.

```javascript
app.registerSubApplications([
  {
    name: 'app1',
    // ...
    container: 'app',
  },
  {
    name: 'app2',
    // ...
    container: document.querySelector('#app'),
  },
  {
    name: 'app3',
    // ...
    container: (() => {
      const el = document.createElement('div');
      el.setAttribute('id', 'app');
      return el;
    })(),
  },
]);
```

If the container is specified, Faun will make them reusable when the sub-applications are repeatedly mounted.

### Clean DOM Nodes When Unmounting

By default, Faun directly removes container when current sub-application is being unmounted, at the meantime records the nodes inside container as a snapshot which could be used when sub-application's next lifecycle starts. However, things would be strange when your sub-application does not diff the DOM tree when mounting or does not use the Virtual DOM at all, because it might render the DOM tree even if there is an exist one just inside the container (restored as a snapshot by sandbox), e.g. Svelte.

To cover the contingent behavior mentioned above, Faun provides a optional parameter on sub-application configuration, named `cleanDOMWhenUnmounting`, whose default value is `false`. If pass it with `true`, sandbox would clean all nodes inside the container by setting container's `innerHTML` with an empty string.

> [NOTE] Do not use this option with your React sub-applications, or it may cause some other issues.

### CSS Prefixes

Adding a prefix to CSS selectors could be a very powerful mode avoiding global style pollution. Faun provide `useCSSPrefix` to add prefixes to sub-applications' styles. But the default value of it is `false`, since it might spend a lot of time to add prefixes for all of the selectors recursively, especially the amount of the selectors are enormous. If pass a value to it with `true`, sandbox would use a the name of current config as prefix.

There is the effect when set this option as `true`:

```javascript
app.registerSubApplications([
  // ...
  {
    name: 'demo_react_app',
    // ...
    useCSSPrefix: true,
  },
]);
```

<img src="../_media/css_prefix.jpg" width="36%" />

### Static Resource URL Prefixes

Applications, especially built by Webpack, might have some chunked assets to lazy load components. In most circumstances, they are managed by the main bundles, usually with no URL prefixes, just like `/static/js/0.chunk.js`, when it should be load, its URL may follow current URL, like `//app1.example.com/static/js/0.chunk.js`. This may cause troubles when sub-application's origin is not the same as framework's, so sub-application's chunks might have framework's URL prefix, which might cause a 404 error.

There are two solutions, the common one is adding the absolute URL prefix for chunks, in Webpack configuration, it could be:

```javascript
module.exports = {
  // ...
  output: {
    // ...
    filename: '[name].chunk.js',
    publicPath: '//app1.example.com/static/js',
  },
};
```

Another one is easier, using Faun's `assetPublicPath` and `assetMatchers`. In every sub-application's configuration, pass value to `assetPublicPath` as a `string`, the chunks would be add the string as the URL for request, e.g. a `assetPublicPath` is `//app1.example.com/static/js`, and the chunk's URL is '0.chunk.js', the URL for request is `//app1.example.com/static/js/0.chunk.js`. `assetPublicPath` also accepts `Function` value, the function would receive the current URL as callback parameter, you should return a value with type `string` as the ultimate URL for Faun to request:

```javascript
app.registerSubApplications([
  {
    // ...
    assetPublicPath: url => `//app1.example.com/static/js/${url}`,
  },
]);
```

Unfortunately, Faun only recognizes `<script>` and `<link>` tags to match `assetPublicPath` rule, but there are other resources like images and favicons also need this feature. Faun provides `assetMatchers` to add these tags for capture:

```javascript
app.registerSubApplications([
  {
    // ...
    assetPublicPath: url => `//app1.example.com/static/js/${url}`,
    assetMatchers: [
      {
        nodeNames: 'img',
        attributes: ['src'],
      },
    ],
  },
]);
```
