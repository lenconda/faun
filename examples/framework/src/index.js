import Polyatomic from '../../../src/polyatomic';

const app = new Polyatomic();
app
  .setMountPoint('app')
  .registerModules({
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
  })
  .run();
