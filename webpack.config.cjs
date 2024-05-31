const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CreateFilePlugin = require('create-file-webpack');

const buildPath = path.resolve(__dirname, 'dist');

const isDevelopment = process.env.NODE_ENV === 'development';

Dotenv.config({ path: './.env.development' });

const cacheEnable = !isDevelopment || process.env.CACHE_ENABLE;

const assets = fs.readdirSync('src/assets/').map((filename) => {
	return `"/assets/${filename}"`;
});

module.exports = {
	entry: {
		app: path.resolve(__dirname, './src/index.js'),
		...(cacheEnable && { 'service-worker': './src/service-worker.js' }),
	},
	target: isDevelopment ? 'web' : 'browserslist',
	output: {
		path: buildPath,
		filename: '[name].js',
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
				context: ['/api/v1'],
				target: 'http://5.35.12.15:8000',
			},
			{
				context: ['/minio-api'],
				target: 'http://5.35.12.15',
			},
		],
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'Resto',
			favicon: './src/assets/favicon.png',
			base: '/',
			meta: {
				viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
			},
		}),
		new MiniCssExtractPlugin({
			filename: 'styles.css',
		}),
		new CopyWebpackPlugin({ patterns: [{ from: 'src/assets', to: 'assets' }] }),
		new CreateFilePlugin({
			path: buildPath,
			fileName: 'assets_filenames.txt',
			content: `[${assets}]`,
		}),
		new webpack.DefinePlugin({
			'process.env.CACHE_ENABLE': cacheEnable,
		}),
	],

	resolve: {
		extensions: ['.js'],
	},
};
