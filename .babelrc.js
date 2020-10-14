module.exports = {
  presets: [
    // [
    //   '@babel/preset-env',
    //   {
    //     exclude: ['transform-regenerator'],
    //   },
    // ],
    '@babel/preset-env',
    '@babel/preset-flow',
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/transform-runtime'],
    ['transform-class-properties'],
    ['@babel/transform-typescript'],
  ],
};
