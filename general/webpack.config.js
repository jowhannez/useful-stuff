const path                 = require('path');
const glob                 = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin    = require('browser-sync-webpack-plugin');
const RemoveStylesJSFiles  = require('webpack-fix-style-only-entries');

function scanDir(pattern) {
	let sources = {};

	glob.sync(pattern).forEach((file) => {
		let filename = file.replace(/.+\//, '').split('.')[0];
		if (!sources.hasOwnProperty(filename)) {
			sources[filename] = [];
		}
		sources[filename].push(path.join(__dirname, file));
	});

	return sources;
}

const paths = {
	src    : 'resources',
	dist   : 'web/resources',
	jsDir  : 'js',
	scssDir: 'scss',
	cssDir : 'css',
	js     : '*.js',
	scss   : '*.scss'
};

const browsers = [
	'last 2 versions',
	'safari >= 7',
	'ie >= 11'
];

const pattern = `${paths.src}/*(${paths.jsDir}|${paths.scssDir})/*(${paths.js}|${paths.scss})`;

module.exports = (env, argv) => {
	const isDevMode = argv.mode === 'development';

	return {
		entry       : scanDir(pattern),
		output      : {
			path    : path.resolve(__dirname, `${paths.dist}`),
			filename: `${paths.jsDir}/[name].min.js`
		},
		devtool     : isDevMode ? 'inline-source-map' : false,
		stats       : {
			children: false
		},
		module      : {
			rules: [
				{
					// sass / scss loader for webpack
					test: /\.(sass|scss)$/,
					use : [
						{
							loader: MiniCssExtractPlugin.loader
						},
						{
							loader : 'css-loader',
							options: {
								sourceMap    : isDevMode,
								importLoaders: 1
							}
						},
						{
							loader : 'postcss-loader',
							options: {
								ident    : 'postcss',
								sourceMap: isDevMode,
								plugins  : [
									require('autoprefixer')({
										browsers: browsers
									})
								]
							}
						},
						{
							loader : 'sass-loader',
							options: {
								outputStyle: 'compressed',
								sourceMap  : isDevMode
							}
						},
						{
							loader: 'webpack-import-glob'
						}
					]
				},
				{
					// JS
					test   : /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use    : [
						{
							loader : 'babel-loader',
							options: {
								presets: [
									['@babel/preset-env', {
										targets    : {browsers: browsers},
										loose      : true,
										modules    : false,
										useBuiltIns: 'usage',
										corejs     : '3.0.0'
									}]
								],
								plugins: [
									['transform-strict-mode']
								]
							}
						},
						{
							loader: 'webpack-import-glob'
						}
					]
				}
			]
		},
		plugins     : [
			new RemoveStylesJSFiles({
				silent: true
			}),
			new MiniCssExtractPlugin({
				filename: `${paths.cssDir}/[name].min.css`
			}),
			new BrowserSyncPlugin({
				open    : false,
				watch   : paths.dist,
				logLevel: 'silent',
				socket  : {
					domain: 'localhost:3000'
				}
			})
		]
	};
};