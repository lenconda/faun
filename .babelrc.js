module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        exclude: ['transform-regenerator']
      },
      '@babel/preset-flow'
    ]
  ],
  plugins: [
    ['@babel/transform-runtime']
  ],
}
