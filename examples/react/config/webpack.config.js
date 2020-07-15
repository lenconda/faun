const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const env = require('./env.config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const developmentPlugins = env.isDev
  ? [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      openAnalyzer: false,
    }),
  ]
  : [];

module.exports = {
  mode: (env.isDev ? 'development' : 'production'),

  entry: [
    path.resolve(__dirname, '../src/index.tsx')
  ],

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/' + (env.isDev ? '[name].bundle.js' : '[name].[hash].bundle.js'),
    chunkFilename: 'static/js/' + (env.isDev ? '[name].chunk.js' : '[name].[contenthash].chunk.js'),
    publicPath: '//localhost:8182/',
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'common',
          chunks: 'all',
          minSize: 20,
          minChunks: 2
        },
        '@ant-design': {
          name: 'ant-design',
          test: /[\\/]@ant-design[\\/]/,
          priority: 30,
          chunks: 'initial',
        },
      }
    },

    minimizer: [
      new TerserWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      }),
    ]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx']
  },

  devtool: false,

  devServer: {
    hot: true,
    host: '0.0.0.0',
    port: 8182,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
    },
    inline: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://101.132.184.52:6217',
    //     secure: true,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': '/api'
    //     }
    //   }
    // },
    contentBase: path.resolve(__dirname, '../public')
  },

  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(ts|js|tsx|jsx)?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            },
          },
          {
            test: /\.(ts|js|tsx|jsx)?$/,
            exclude: /node_modules/,
            loader: require.resolve('babel-loader'),
            options: {
              customize: require.resolve('babel-preset-react-app/webpack-overrides'),
              cacheDirectory: true,
              cacheCompression: true,
              compact: true,
            }
          },
        ]
      },
      {
        test: /\.(html)$/,
        exclude: /node_modules/,
        use: 'html-loader'
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '_[hash:base64:5]',
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
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
    new MiniCssExtractPlugin({
      filename: env.isDev ? 'static/css/[name].css' : 'static/css/[name].[contenthash].css',
      chunkFilename: env.isDev ? 'static/css/[id].css' : 'static/css/[id].[contenthash].css'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../assets/'),
        to: path.resolve(__dirname, '../dist/assets')
      }
    ]),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ...developmentPlugins,
  ]
};
