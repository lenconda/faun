import Polyatomic from '../../../src/polyatomic';
import axios from 'axios';

const app = new Polyatomic('app');

app.addGlobalDependence('axios', axios);

app.registerModules({
  '/vue': {
    scripts: [
      '//localhost:8181/app.js',
    ],
    styles: [],
  },
  '/react': {
    scripts: [
      '//localhost:8182/static/js/main.bundle.js',
      '//localhost:8182/static/js/vendors.chunk.js',
    ],
    styles: [
      '//localhost:8182/static/css/main.css',
    ],
  },
});

app.hooks.loading = function(pathname) {
  console.log('loading', this);
  console.log('pathname: ', pathname);
};

app.hooks.loaded = function(pathname, sandbox) {
  console.log('loaded', this);
  console.log('pathname: ', pathname);
  console.log('sandbox: ', sandbox);
};

app.hooks.mounted = function(pathname, sandbox) {
  console.log('mounted', this);
  console.log('pathname: ', pathname);
  console.log('sandbox: ', sandbox);
};

app.hooks.beforeUnmount = function(prev, next) {
  console.log('beforeUnmount', this);
  console.log('prev: ', prev);
  console.log('next: ', next);
  return true;
};

app.hooks.unmounted = function(prev, next, sandbox) {
  console.log('unmounted', this);
  console.log('prev: ', prev);
  console.log('next: ', next);
  console.log('sandbox: ', sandbox);
};

app.run();
