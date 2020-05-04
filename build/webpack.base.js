const webpack = require('webpack');
const env = require('./utils/env');
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',

  entry: path.resolve(__dirname, '../src/polyatomic.js'),

  output: {
    path: path.resolve(__dirname, '../dist'),
    libraryTarget: 'umd',
    library: 'Polyatomic',
  },

  resolve: {
    extensions: ['.js'],
  },

  devtool: 'eval',

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
      },
    ],
  },
}
