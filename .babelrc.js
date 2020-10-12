module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        exclude: ['transform-regenerator']
      },
      '@babel/preset-flow'
    ],
    ['@babel/typescript'],
  ],
  plugins: [
    ['@babel/transform-runtime'],
    ['transform-class-properties'],
    ['@babel/transform-typescript'],
  ],
};
