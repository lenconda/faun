const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(baseConfig, {
  output: {
    filename: 'polyatomic.js',
  },

  devServer: {
    hot: true,
    host: '0.0.0.0',
    port: 8192,
    inline: true,
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin(),
  ],
});
