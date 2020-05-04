import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import terser from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import { isDev, isProduction } from './build/env';

export default (async () => [
  {
    input: './src/polyatomic.js',
    output: {
      file: `./dist/polyatomic${isProduction() ? '.min' : ''}.js`,
      name: 'polyatomic',
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
      }),
      (isProduction() && terser.terser()),
      (isDev() && serve({
        contentBase: 'dist',
        host: '0.0.0.0',
        port: 12386,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })),
    ],
  },
]);
