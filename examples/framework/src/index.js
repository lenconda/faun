import Polyatomic from '../../../src/polyatomic';

const app = new Polyatomic();
app
  .setMountPoint('root')
  .registerModules({
    '/a': {
      scripts: [
        '//lenconda.top/static/js/main.533e50d53e34501c0453.bundle.js',
        '//lenconda.top/static/js/vendors.80aed72de2ee559981d4.chunk.js',
      ],
      styles: [
        '//lenconda.top/static/css/main.3b02ea5f20a71172ee1e.css',
      ],
    },
    '/b': {
      scripts: [
        '//lenconda.top/static/js/main.533e50d53e34501c0453.bundle.js',
        '//lenconda.top/static/js/vendors.80aed72de2ee559981d4.chunk.js',
      ],
      styles: [
        '//lenconda.top/static/css/main.3b02ea5f20a71172ee1e.css',
      ],
    },
  })
  .run();
