const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [
					// Take CommonJS module string and write it as CSS to a separate .css file
					MiniCssExtractPlugin.loader,
					// Translates CSS into CommonJS
					"css-loader",
				],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Take CommonJS module string and write it as CSS to a separate .css file
					MiniCssExtractPlugin.loader,
					// Translates CSS into CommonJS
					"css-loader",
					// Building Bootstrap scss files requires postcss-loader (with Autoprefixer config, specified in postcss.config.js)
					"postcss-loader",
					// Compiles Sass to CSS
					"sass-loader",
				],
			},
			{
				test: /\.html$/i,
				loader: "html-loader",
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin(),
		new CopyPlugin({
			patterns: [{ from: "public", to: "." }],
		}),
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: `src/index.html.ejs`,
		}),
	],
};
