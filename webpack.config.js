var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    '../dist/dist': "./src/entries/dist.js",
    'dev': "./src/entries/dev.js"
  },
  output: {
    path: path.join(__dirname, '/build'),
    filename: "[name].js",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src/scripts"),
          path.resolve(__dirname, "src/entries")
        ],
        loader: 'babel'
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src/scripts"),
        loader: "style!css!postcss?sourceMap=inline"
      },
      {
        test: /\.json$/,
        include: path.resolve(__dirname, "src/content"),
        loader: 'json'
      }
    ]
  },
  postcss: function () {
    return [autoprefixer];
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 8051,
    contentBase: "./build",
    quiet: true,
  }
};
