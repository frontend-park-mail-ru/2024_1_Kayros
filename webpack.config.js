import * as path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildPath = path.resolve(__dirname, 'dist');

const isProd = process.env.NODE_ENV === 'production';

export default {
	entry: path.resolve(__dirname, './src/index.js'),
	target: !isProd ? 'web' : 'browserslist',
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
			},
		],
	},

	devServer: {
		host: 'localhost',
		port: 3000,
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
		new ESLintWebpackPlugin(),
	].filter(Boolean),
};
