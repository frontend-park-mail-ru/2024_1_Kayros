const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const buildPath = path.resolve(__dirname, 'dist');

const isDevelopment = process.env.NODE_ENV === 'development';

Dotenv.config({ path: './.env.development' });

module.exports = {
	entry: path.resolve(__dirname, './src/index.js'),
	target: isDevelopment ? 'web' : 'browserslist',
	output: {
		path: buildPath,
		filename: 'bundle.js',
	},

	module: {
		rules: [
			{
				test: /\.(png|svg|jpg)$/,
				type: 'asset',
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024,
					},
				},
			},
			{
				test: /\.s?css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.hbs$/,
				loader: 'handlebars-loader',
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|dist)/,
				use: 'babel-loader',
				resolve: {
					fullySpecified: false,
				},
			},
		],
	},

	devServer: {
		host: process.env.HOST,
		port: process.env.PORT,
		hot: true,
		historyApiFallback: true,
		static: {
			directory: buildPath,
		},
		proxy: [
			{
				context: ['/api'],
				target: 'http://109.120.180.238:8000',
				pathRewrite: { '^/api': '' },
			},
			{
				context: ['/tiles'],
				target: 'http://109.120.180.238/minio-api/map-tiles/',
				pathRewrite: { '^/tiles': '' },
			},
		],
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'Resto',
			favicon: './src/assets/favicon.png',
			base: '/',
		}),
		new MiniCssExtractPlugin({
			filename: '[name]-[hash].css',
		}),
		new CopyWebpackPlugin({ patterns: [{ from: 'src/assets', to: 'assets' }] }),
	],

	resolve: {
		extensions: ['.js'],
	},
};
