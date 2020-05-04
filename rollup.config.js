import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';

export default (async () => [
  {
    input: './src/polyatomic.js',
    output: {
      file: './dist/polyatomic.min.js',
      name: 'polyatomic',
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
      }),
      uglify.uglify(),
    ],
  },
]);
