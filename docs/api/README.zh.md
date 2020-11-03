---
order: 1
toc: 'menu'
title: 'API 说明'
nav:
  title: 'API'
  order: 1
---

# API 说明

## 方法

### `Faun.prototype.registerSubApplications(config, hooks?)`

注册子应用配置，以及定义生命周期钩子。

- 参数
  - `config`：`SubApplicationsType`。必须，一个存储子应用配置的数组
  - `hooks`：`IFaunLifecycleHooks`。可选，一个定义生命周期的键值对，前往[生命周期钩子](#生命周期钩子)查阅详情
- 类型
  - `SubApplicationsType`
    - `Array<ISubApplicationConfig>`
  - `ISubApplicationConfig`
    - `name`：`string`。分条件可选，定义当前沙箱的名称。如果 `useCSSPrefix` 为 `true`，它将会是必须的
    - `entry`：`ISubApplicationEntry`。可选，定义沙箱的 JavaScript 和 CSS 入口
    - `activeWhen`：`SubApplicationActiveRuleType`。必须，沙箱的激活规则。当路径匹配到当前沙箱的激活规则时，沙箱将会被挂载
    - `container`：`SubApplicationContainerType`。必须，当前子应用的挂载点 ID 或 `HTMLElement` 类型的 DOM 节点
    - <span id="doc_use-css-prefix">`useCSSPrefix`：`boolean`。可选，默认值为 `false`。在默认情况下，Faun 将会把 `name` 用于以 `data-f-*` 的属性设置在容器元素上。例如：`<div data-f-i8zjUoZ6__app1></div>`</span>
    - `assetPublicPath`：`SubApplicationAssetPublicPathType`。可选，当子应用的 [`publicPath`](https://webpack.js.org/guides/public-path/) 不是绝对路径，例如 `/` 或者 `./` 时，`assetPublicPath` 将会帮助添加一个合适的前缀。例如 `url => '//example.com/foo' + url` 会向所有 Chunked 资源添加 `//example.com/foo`：`/0.chunk.js` -> `//example.com/foo/0.chunk.js`
    - <span id="doc_asset-matchers">`assetMatchers`：`SubApplicationAssetMatchersType`。可选，由于 Faun 仅拦截 <code>&lt;script&gt;</code> 和 `<link>` 元素，但是还有其他元素，例如 `<img>` 也需要这种重写机制。这个选项帮助添加自定义的元素和属性来重写各自的 `publicPath`</span>
    - <span id="doc_preserve-chunks">`preserveChunks`：`boolean`。可选，默认为 `false`，用于决定在子应用卸载时是否删除 Chunked 资源</span>
    - `extra`：`SubApplicationExtraType`。可选，沙箱的附加属性，当 JavaScript 入口传入一个执行器时，它将会被当作形式参数传入该执行器
    - <span id="doc_clean-dom-when-unmounting">`cleanDOMWhenUnmounting`：`boolean`。默认值为 `false`，决定在子应用卸载时是否需要将容器元素的 `innerHTML` 设置为空</span>
  - `ISubApplicationEntry`
    - `scripts`：`Array<string>`。可选，默认值为 `null`。当前子应用的 JavaScript 资源 URL
    - `styles`：`Array<string>`。可选，默认值为 `null`。当前子应用的 CSS 资源 URL
  - `SubApplicationActiveRuleType`
    - `(location: Location<History.PoorMansUnknown> | {}) => boolean | RegExp | Array<string> | string`
  - `SubApplicationContainerType`
    - `(extra: SubApplicationExtraType) => HTMLElement | HTMLElement | string`
  - <span id="doc_sub-application-asset-public-path-type">`SubApplicationAssetPublicPathType`</span>
    - `(url: string) => string | string`
  - `SubApplicationAssetMatchersType`
    - `Array<ISubApplicationAssetsConfigMatcherItem>`
  - `ISubApplicationAssetsConfigMatcherItem`
    - `nodeName`：`string`。必须，定义具有这个 `nodeName` 的节点应该被捕获
    - `attributes`：`Array<string>`。必须，定义值应该被重写的属性名称
  - `SubApplicationExtraType`
    - `Record<string, any>`

### `Faun.prototype.run()`

启动 Faun 实例。所有的配置工作都完成后，它将会被调用。

### `Faun.prototype.history` & `Faun.history`

`history` 是一个通过 `createBrowserHistory` 生成的 [ReactTraining/history](https://github.com/ReactTraining/history) 实例，在[这里](https://github.com/ReactTraining/history/blob/master/docs/api-reference.md)查看文档。

### `Faun.prototype.addGlobalDependence(name, dep)`

- 参数
  - `name`：`string`。必须，当前依赖的名称。依赖将会作为全局变量被加入 `window`：`window[name] = dep`
  - `dep`：`any`。必须，可以是任何值。它将可以通过 `window[name]` 被访问

### `Faun.prototype.use(plugin, options?)`

向 `Faun.prototype` 中添加一个插件。

- 参数
  - `plugin`：`IPlugin`。必须，传入一个类型为 `IPlugin` 的插件，该插件应该会被注入 `Faun.prototype`
  - `options`：`Record<string, any>`。可选，传入当前插件的选项
- 类型
  - `IPlugin`
    - `install`：`(Faun: Faun) => any`。必须，`install` 方法应该在所有插件中被实现，因为插件系统在安装这些插件时调用插件的 `install` 方法

### `Faun.prototype.events`

#### `emit(key, data?)`

触发一个特定的事件，并调用该事件的所有处理器。

- `key`：`string`。必须，被触发事件的名称
- `data`：`any`。可选，被传入事件处理器的数据

#### `on(key, callback)`

向指定事件中添加一个事件处理器。

- `key`：`string`。必须，事件名称
- `callback`：`(data?) => any`。必须，事件处理器

#### `off(key, callback)`

移除指定事件的指定回调。

- `key`：`string`。必须，事件名称
- `callback`：`(data?) => any`。必须，指定事件中指定的将要被删除的回调

#### `has(key, callback)`

- `key`：`string`。必须，事件名称
- `callback`：`(data?) => any`。必须，指定事件中指定的将要搜寻的回调

### `Faun.prototype.store`

#### `set(key, value)`

向 Store 中添加一条记录/

- `key`：`string`。必须，Store 中某条记录的名称
- `value`：`any`。必须，Store 中某条记录的值

#### `get(key)`

从 Store 中获取一条记录。

- `key`：`string`。必须，Store 中某条记录的名称

## 生命周期钩子

### `loading(pathname)`

在一个新的子应用在加载开始时被执行。

- 参数
  - `pathname`：`string`。当前顶级路由的路径

### `loaded(pathname)`

在子应用成功加载后被执行。

- 参数
  - `pathname`：`string`。当前顶级路由的路径

### `mounted(pathname, sandbox)`

在子应用被成功挂载后被执行。

- 参数
  - `pathname`：`string`。当前顶级路由的路径
  - `sandbox`：`Sandbox`。当前被挂载的沙箱
- 类型
  - `Sandbox`

### `beforeUnmount(prev, next)`

在当前子应用将要被卸载时被执行。

- 参数
  - `prev`：`string`。当前顶级路由的路径
  - `next`：`string`。下一个顶级路由的路径

### `mounted(pathname, sandbox)`

在当前子应用被成功卸载后被执行。

- 参数
  - `prev`：`string`。当前顶级路由的路径
  - `next`：`string`。下一个顶级路由的路径
  - `sandbox`：`Sandbox`。当前被挂载的沙箱
- 类型
  - `Sandbox`

## `IFaunInstanceProps`

- 属性
  - `id`：`string`。一个用于识别当前 Faun 实例的独有的字符串
  - `registeredSubApplications`：`Array<iSubApplicationConfig>`。存储所有子应用的配置
  - `currentLocation?`：`Location<History.PoorMansUnknown>`。`history` 的实例，存储当前的 `location` 信息
  - `routes`：`Array<IFaunRouteItem>`。一个存储路径与沙箱关系的映射
  - `position`：`number`。当前在 `history` 栈中所处的位置
  - `direction`：`'forward' | 'backward'`。指示用户在 `history` 栈中是前进还是后退
  - `hooks?`：`IFaunLifecycleHooks`。一个定义生命周期钩子的键值对，在[生命周期钩子](#生命周期钩子)中获取详情
  - `appConfig`：`IFaunInstanceConfig`。存储作为参数传入构造函数的 Faun 实例的配置
- 接口
  - `IFaunRouteItem`
    - `pathname?`：`string`。一个可以触发 Faun 激活规则的字符串
    - `sandboxes`：`Array<Sandbox>`。一个存储可以在当前路径下被挂载的数组，在 [Sandbox](#sandbox) 中获取详情
  - `IFaunInstanceConfig`
    - `singular?`: `boolean`. 决定 Faun 每次是否只可以挂载一个沙箱
    - `onError?`: `(error: FaunError) => void`. Faun 全局错误处理函数

## `Sandbox`

- 构造函数
  - `(name: string, useCSSPrefix = true, customAssetMatchers: SubApplicationAssetMatchersType = [] => void`
- 公有成员
  - `name`：`string`。沙箱名称
  - `scripts`：`SandboxScriptsType`。JavaScript 入口配置
  - `styles`：`SandboxStylesType`。CSS 入口配置
  - `useCSSPrefix`：`boolean`。在[这里](#doc_use-css-prefix)获取详情
  - `preserveChunks`：`boolean`。在[这里](#doc_preserve-chunks)获取详情
  - `assetPublicPath?`：`SandboxAssetPublicPathType`。静态资源的 `publicPath` 选项
  - `takeDOMSnapshot`：`() => {}`。在沙箱被卸载前复制 DOM 节点
  - `restoreDOMSnapshot`：`() => {}`。在沙箱被挂载时把在快照中的 DOM 节点放置进容器元素中
  - `takeWindowSnapshot`：`() => {}`。在沙箱被卸载之前复制 `window` 对象
  - `restoreDOMSnapshot`：`() => {}`。在沙箱被挂载后恢复 `window` 对象
  - `create`：`(subApplicationConfig: ISubApplicationConfig, appConfig: IFaunInstanceConfig) => {}`。创建沙箱并加载资源
  - `mount`：`() => {}`。挂载沙箱
  - `unmount`：`() => {}`。卸载沙箱
- 私有成员
  - `cssPrefixString`：`string`。当前沙箱的 CSS 前缀，通常是 `data-f-` 开头
  - `domSnapshot`：`Array<HTMLElement>`。存储当前沙箱的 DOM 快照
  - `windowSnapshot`：`Partial<Window>`。存储当前 `window` 对象的变化
  - `scriptExecutor`：`Array<Function>`。以函数形式存储当前沙箱的所有 JavaScript 包
  - `styleElements`：`Array<HTMLStyleElement>`。以 `HTMLStyleElement` 类型的 DOM 节点存储所有的 CSS 资源
  - `singular`：`boolean`。决定 Faun 每次是否只可以挂载一个沙箱
  - `modifiedPropsMap`：`Record<string, any>`。存储 `window` 对象上被更改的属性
  - `observer?`：`MutationObserver`。`MutationObserver` 实例
  - `childNodeOperator`：`IChildOperate`。子节点操作重写
  - `sandboxWindow`：`Partial<Window>`。一个 `window` 对象的仿冒对象
  - `cleanDOMWhenUnmounting`：`boolean`。在[这里](#doc_clean-dom-when-unmounting)获取详情
  - `container`：`HTMLElement`。子应用的容器元素
  - `mountPointElement`：`HTMLElement`。子应用挂载点
  - `disableRewriteEventListeners?`：`Function`。取消对 `EventListeners` 重写的方法
  - `assetMatchers`：`SubApplicationAssetMatchersType`。在[这里](#doc_asset-matchers)获取详情
- 类型
  - `SandboxScriptsType`
    - `Array<string | IEntryCustomScriptConfig>`
  - `SandboxStylesType`
    - `Array<string>`
  - `SandboxAssetPublicPathType`
    - `SubApplicationAssetPublicPathType`。在[这里](#doc_sub-application-asset-public-path-type)获取详情
  - `IChildOperate`
    - `intercept`：`(callback: Function) => void`。重写 DOM 操作的方法
    - `stop`：`() => void`。停止重写 DOM 操作的方法
  - `IEntryCustomScriptConfig`
    - `url`：`string`。JavaScript 资源的 URL
    - `scriptExecutor`：`(data: string, defaultExecutor: Function, extra: SubApplicationExtraType) => Function`。自定义 JavaScript 执行器
