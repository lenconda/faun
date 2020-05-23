const path = require('path');
const resolve = require('@rollup/plugin-node-resolve').default;
const { babel } = require('@rollup/plugin-babel');
const babelOptions = require('../.babelrc.js');
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
  return `/* polyatomic@${packageJson.version} */`;
}

Object.assign(babelOpts, babelOptions);

module.exports = [
  {
    input: resolveFile('src/polyatomic.js'),
    output: {
      file: resolveFile('dist/polyatomic.min.js'),
      format: 'umd',
      name: 'Polyatomic',
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
