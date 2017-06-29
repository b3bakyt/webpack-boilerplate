const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const isProd = process.env.NODE_ENV === 'production';

const extractSass = new ExtractTextPlugin({
  filename: '/css/[name].css',
  disable: !isProd,
  allChunks: true
});

const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
const cssProd = extractSass.extract({
  fallback: 'style-loader',
  use: ['css-loader', 'sass-loader'],
  publicPath: path.resolve(__dirname, 'dist')
});

const cssConf = isProd ? cssProd : cssDev;
const bootstrapConf = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
  entry: {
    app: './src/app.js',
    contact: './src/contact.js',
    bootstrap: bootstrapConf,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: cssConf
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.pug$/,
        use: ['html-loader', 'pug-html-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg)/,
        use: [
          // 'file-loader?name=/images/[name].[ext]',
          // 'file-loader?name=[name].[ext]&outputPath=/images/&publicPath=/images/',
          'file-loader?name=[name].[ext]&outputPath=/images/',
          'image-webpack-loader'
        ],
      },
      { test: /\.(woff2?|svg)$/, loader: 'url-loader?limit=10000&name=/fonts/[name].[ext]' },
      { test: /\.(ttf|eot)$/, loader: 'file-loader?name=/fonts/[name].[ext]' },
      // Bootstrap 3
      { test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports-loader?jQuery=jquery' },
    ],

  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    hot: true,
    port: 9000,
    stats: "errors-only",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My first project',
      // minify: {
      //   collapseWhitespace: true
      // },
      hash: true,
      excludeChunks: ['contact'],
      template: './src/index.html'
    }),
    new HtmlWebpackPlugin({
      title: 'Contact page',
      hash: true,
      chunks: ['contact'],
      filename: 'contact.html',
      template: './src/contact.html'
    }),
    extractSass,
    new webpack.HotModuleReplacementPlugin(), // Enable HMR
    new webpack.NamedModulesPlugin(),
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html'))
    })
  ]
}