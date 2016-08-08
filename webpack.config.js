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
    sourceMapFileName: "[file].map"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src/scripts"),
          path.resolve(__dirname, "src/entries")
        ],
        loader: 'babel?optional=runtime'
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src/scripts"),
        loader: "style!css?sourceMap&modules"
      },
      {
        test: /\.json$/,
        include: path.resolve(__dirname, "src/content"),
        loader: 'json'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  devtool: 'source-map',
  devServer: {
    port: 8050,
    contentBase: "./build",
    quiet: true,
  }
};
