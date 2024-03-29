const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const getEntryPath = () => {
  const devEntryPath = path.resolve(__dirname, '../src/index.dev.ts');

  if (!fs.existsSync(devEntryPath)) {
    return path.resolve(__dirname, '../src/index.ts');
  }

  return devEntryPath;
}

module.exports = {
  entry: getEntryPath(),

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
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
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
        test: /\.(ts|js|tsx|jsx)?$/,
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
