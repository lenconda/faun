import Faun from '../../../src';
import axios from 'axios';

const app = new Faun();

app.addGlobalDependence('axios', axios);

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
      assetURLMapper: url => `//localhost:8181${url}`,
    },
    {
      // name: 'demo_react_app',
      activeWhen: '/react',
      scripts: [
        '//localhost:8182/static/js/main.bundle.js',
        '//localhost:8182/static/js/vendors.chunk.js',
      ],
      styles: [
        '//localhost:8182/static/css/main.css',
      ],
      mountPointID: 'root',
      useCSSPrefix: false,
      assetURLMapper: url => `//localhost:8182${url}`,
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
