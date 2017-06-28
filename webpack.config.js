var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

const extractSass = new ExtractTextPlugin({
  filename: 'app.css',
  disable: !isProd,
  allChunks: true
});

const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
const cssProd = extractSass.extract({
  fallback: 'style-loader',
  use: ['css-loader', 'sass-loader'],
  publicPath: path.resolve(__dirname, 'dist')
});
let cssConf = isProd ? cssProd : cssDev;

module.exports = {
  entry: {
    app: './src/app.js',
    contact: './src/contact.js'
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
          'file-loader?name=/images/[name].[ext]',
          // 'file-loader?name=[name].[ext]&outputPath=/images/&publicPath=/images/',
          'image-webpack-loader'
        ],
      }
    ]
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
  ]
}