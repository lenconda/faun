const path = require('path');
const resolve = require('@rollup/plugin-node-resolve').default;
const { babel } = require('@rollup/plugin-babel');
const originalBabelConfig = require('../.babelrc.js');
const terser = require('rollup-plugin-terser');
const commonjs = require('@rollup/plugin-commonjs');
const packageJson = require('../package.json');
const globals = require('rollup-plugin-node-globals');

function resolveFile(filePath) {
  return path.join(__dirname, '../', filePath);
};

const babelOpts = {
  exclude: 'node_modules/**',
  babelHelpers: 'runtime',
};

function generateBanner() {
  return `/* faun@${packageJson.version} */`;
}

Object.assign(babelOpts, originalBabelConfig);

module.exports = [
  {
    input: resolveFile('src/index.js'),
    output: {
      file: resolveFile('dist/faun.min.js'),
      format: 'umd',
      name: 'Faun',
      banner: generateBanner(),
    },
    plugins: [
      resolve(),
      commonjs(),
      globals(),
      babel(babelOpts),
      terser.terser(),
    ],
  },
];
