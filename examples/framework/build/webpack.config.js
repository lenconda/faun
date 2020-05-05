const env = require('../../../build/utils/env');
const path = require('path');
const webpack = require('webpack');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/index.bundle.js',
    chunkFilename: 'static/js/index.chunk.js',
    publicPath: '/',
  },

  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
  },

  resolve: {
    extensions: ['.js'],
  },

  devtool: 'eval',

  devServer: {
    hot: true,
    host: '0.0.0.0',
    inline: true,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, '../public'),
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: path.resolve(__dirname, '../public/index.html'),
      inject: true,
      chunksSortMode: 'none',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
