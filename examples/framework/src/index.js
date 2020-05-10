import Polyatomic from '../../../src/polyatomic';

const app = new Polyatomic('app');

app.registerModules({
  '/a': {
    scripts: [
      '//demo.lenconda.top/vue/static/js/manifest.a01aa52dcf96ddb64f09.js',
      '//demo.lenconda.top/vue/static/js/vendor.4ad267b4786a3ebd3327.js',
      '//demo.lenconda.top/vue/static/js/app.b22ce679862c47a75225.js',
    ],
    styles: [
      '//demo.lenconda.top/vue/static/css/app.30790115300ab27614ce176899523b62.css',
    ],
  },
  '/b': {
    scripts: [
      '//demo.lenconda.top/vue/static/js/manifest.a01aa52dcf96ddb64f09.js',
      '//demo.lenconda.top/vue/static/js/vendor.4ad267b4786a3ebd3327.js',
      '//demo.lenconda.top/vue/static/js/app.b22ce679862c47a75225.js',
    ],
    styles: [
      '//demo.lenconda.top/vue/static/css/app.30790115300ab27614ce176899523b62.css',
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
