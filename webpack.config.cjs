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
				use: ['style-loader', 'css-loader', 'sass-loader'],
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
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, './public/index.html'),
		}),
		new MiniCssExtractPlugin({
			filename: '[name]-[hash].css',
		}),
		new CopyWebpackPlugin({ patterns: [{ from: 'src/assets', to: 'assets' }] }),
	].filter(Boolean),

	resolve: {
		extensions: ['.js'],
	},
};