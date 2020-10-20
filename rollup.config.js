const path = require('path');
const resolve = require('@rollup/plugin-node-resolve').default;
const { babel } = require('@rollup/plugin-babel');
const terser = require('rollup-plugin-terser');
const commonjs = require('@rollup/plugin-commonjs');
const packageJson = require('./package.json');
const globals = require('rollup-plugin-node-globals');

function resolveFile(filePath) {
  return path.join(__dirname, filePath);
};

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

function generateBanner() {
  return `/* faun@${packageJson.version} */`;
}

module.exports = [
  {
    input: resolveFile('src/index.umd.ts'),
    output: [
      {
        file: resolveFile('dist/umd/faun.min.js'),
        format: 'umd',
        name: 'Faun',
        banner: generateBanner(),
        exports: 'default',
      },
      {
        file: resolveFile('dist/amd/faun.min.js'),
        format: 'amd',
        amd: {
          id: `${packageJson.name}@${packageJson.version}`,
        },
        banner: generateBanner(),
        exports: 'default',
      },
    ],
    plugins: [
      resolve({ browser: true, extensions }),
      commonjs(),
      globals(),
      babel({
        extensions,
        include: ['src/**/*'],
        babelHelpers: 'runtime',
      }),
      terser.terser(),
    ],
  },
];
