# API

## Prototype Methods

### `Faun.prototype.registerSubApplications(config)`

- Parameters
  - `config`: `ISubApplicationConfigMap`. Required, a key-value map structure stores sub applications configuration
- Types
  - `ISubApplicationConfigMap`
    - [Type definition](#doc-isubapplicationconfigmap)
    - `key`: `string`. Required, the active route for one sub application, each key is unique in one map. e.g. `/foo`
    - `ISubApplicationConfig`. Required, the configuration for current sub application
  - `ISubApplicationConfig`
    - [Type definition](#doc-isubapplicationconfig)
    - `mountPointID`: `string`. Required, the mount point ID for current sub application. e.g. if pass `app` to `mountPointID`, Faun will create a `HTMLDivElement` element with ID of `app`
    - `scripts`: `Array<string>`. Optional, default `null`. JavaScript resource URLs for current sub application
    - `styles`: `Array<string>`. Optional, default `null`. CSS resource URLS for current sub application
    - `useCSSPrefix`: `boolean`. Optional, default `true`. By default, Faun will add a random string to `document.documentElement.classList`, such as `<html class="qz7Ux3v0">...</html>`
    - `assetURLMapper`: `(url: string) => string`. Optional, default `url => url`. When the [`publicPath`](https://webpack.js.org/guides/public-path/) of the sub application is not the absolute path, such as `/` or `./`, `assetURLMapper` will help to add the proper prefix. e.g. `url => '//example.com/foo' + url` can add `//example.com/foo` to all of the chunked assets: `/0.chunk.js` -> `//example.com/foo/0.chunk.js`
    - `prefixElementSelector`: `() => Node`. Optional, default `() => document.documentElement`. Related to `useCSSPrefix`, it will help to change the default element while default behavior is prefixing a CSS class to `document.documentElement`

### `Faun.prototype.run()`



## Lifecycle Hooks

# Type Definitions

## `ISubApplicationConfigMap` :id=doc-isubapplicationconfigmap

The declerations for sub application configuration map.

- Entry

```javascript
import { ISubApplicationConfigMap } from 'faun';
```

- Typing

```typescript
declare interface ISubApplicationConfigMap {
  [key: string]: Partial<ISubApplicationConfig>;
}
```

## `ISubApplicationConfig` :id=doc-isubapplicationconfig

- Entry

```javascript
import { ISubApplicationConfig } from 'faun';
```

- Typing

```typescript
declare interface ISubApplicationConfig {
  scripts?: Array<string>;
  styles?: Array<string>;
  mountPointID: string;
  useCSSPrefix?: boolean;
  assetURLMapper?: (url: string) => string;
  prefixElementSelector?: () => Node;
}
```
