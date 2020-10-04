import Faun from '../../../src';
import axios from 'axios';

const app = new Faun({ singular: false });

app.addGlobalDependence('axios', axios);

app.registerSubApplications(
  [
    {
      name: 'demo_vue_app',
      activeWhen: '/vue',
      entry: {
        scripts: [
          '//localhost:8181/app.js',
        ],
        styles: [],
      },
      container: 'app',
      useCSSPrefix: false,
      assetPublicPath: '//localhost:8181',
    },
    {
      name: 'demo_react_app',
      activeWhen: '/react',
      entry: {
        scripts: [
          '//localhost:8182/static/js/main.bundle.js',
        ],
        styles: [
          '//localhost:8182/static/css/main.css',
        ],
      },
      container: 'root',
      useCSSPrefix: false,
      assetPublicPath: '//localhost:8182',
    },
    {
      name: 'demo_ng_app',
      activeWhen: '/angular',
      entry: {
        scripts: [
          '//localhost:8183/polyfills.js',
          '//localhost:8183/runtime.js',
          '//localhost:8183/main.js',
          '//localhost:8183/vendor.js',
          '//localhost:8183/styles.js',
        ],
      },
      container: (() => document.createElement('app-root'))(),
      useCSSPrefix: false,
      // assetPublicPath: '//localhost:8183',
    },
  ],
  {
    loading: function(pathname) {
      console.log('loading', this);
      console.log('pathname: ', pathname);
    },
    loaded: function(pathname, sandbox) {
      console.log('loaded', this);
      console.log('pathname: ', pathname);
      console.log('sandbox: ', sandbox);
    },
    mounted: function(pathname, sandbox) {
      console.log('mounted', this);
      console.log('pathname: ', pathname);
      console.log('sandbox: ', sandbox);
    },
    beforeUnmount: function(prev, next) {
      console.log('beforeUnmount', this);
      console.log('prev: ', prev);
      console.log('next: ', next);
      return true;
    },
    unmounted: function(prev, next, sandbox) {
      console.log('unmounted', this);
      console.log('prev: ', prev);
      console.log('next: ', next);
      console.log('sandbox: ', sandbox);
    },
  },
);

app.run();
