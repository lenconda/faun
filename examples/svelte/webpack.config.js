const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const productionPlugins = [
  new MiniCssExtractPlugin({
    filename: '[name].css'
  }),
];

const developmentPlugins = [];

const plugins = prod ? productionPlugins : developmentPlugins;

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					(prod ? MiniCssExtractPlugin.loader : 'style-loader'),
					'css-loader'
				]
			}
		]
	},
	mode,
	plugins,
  devtool: prod ? false: 'source-map',
  devServer: {
    hot: true,
    host: '0.0.0.0',
    port: 8184,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
    },
    inline: true,
    contentBase: path.resolve(__dirname, 'public')
  },
};
