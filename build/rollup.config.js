const path = require('path');
const resolve = require('@rollup/plugin-node-resolve').default;
const { babel } = require('@rollup/plugin-babel');
const originalBabelConfig = require('../.babelrc.js');
const terser = require('rollup-plugin-terser');
const commonjs = require('@rollup/plugin-commonjs');
const packageJson = require('../package.json');
const globals = require('rollup-plugin-node-globals');
const { merge } = require('lodash');
const typescript = require('@rollup/plugin-typescript');

function resolveFile(filePath) {
  return path.join(__dirname, '../', filePath);
};

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

function generateBanner() {
  return `/* faun@${packageJson.version} */`;
}

const babelBuildOptions = merge({
  exclude: 'node_modules/**',
  babelHelpers: 'runtime',
}, originalBabelConfig);

module.exports = [
  {
    input: resolveFile('src/index.ts'),
    output: [
      {
        file: resolveFile('dist/umd/faun.min.js'),
        format: 'umd',
        name: 'Faun',
        banner: generateBanner(),
      },
    ],
    plugins: [
      resolve({ browser: true, extensions }),
      commonjs(),
      globals(),
      babel(babelBuildOptions),
      terser.terser(),
      typescript(),
    ],
    include: ['*.ts+(|x)', '**/*.ts+(|x)', '*.js'],
  },
];
