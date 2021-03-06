const path = require('path');

module.exports = {
  context: __dirname,
  entry: './src/coinstats.js',
  output: {
    path: path.resolve(__dirname, 'app', 'assets'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '*']
  },
  module: {
    loaders: [
    {
      test: /jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['babel-preset-es2015']
      }
    }
    ]
  },
  devtool: 'source-map',
};
