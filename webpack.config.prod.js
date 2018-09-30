const path = require('path');
const webpack = require('webpack');
const EncodingPlugin = require('webpack-encoding-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: ['babel-polyfill', './public/js/index']
  },
  output: {
    path: path.join(__dirname, 'target/classes/public'),
    filename: '[name]-bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Painel de sequenciamento de costura',
      chunks: ['index'],
      filename: 'index.html',
      template: path.join(__dirname, 'public/template.html')
    }),
    new CopyWebpackPlugin([{
      from: './public/vendor',
      to: 'vendor'
    }]),
    new EncodingPlugin({
      encoding: 'utf-8'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('[name]-styles.css')
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /css/],
        include: path.join(__dirname, 'public'),
        use: ['babel-loader']
      },  
      {
        test: /\.scss$/,
        include: path.join(__dirname, 'public/css'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?minimize=true', 'sass-loader', 'postcss-loader']
        })
      },
      {
        test: /\.css$/, loader: 'style-loader!css-loader'
      },
      {
        test: /\.(ttf|eot|svg|woff(2)|png|jpg|jpeg|gif?)(\?[a-z0-9=&.]+)?$/,
        use: ['file-loader?name=./[hash].[ext]']
      }
    ]
  },
  externals: {
    jquery: 'parent.$',
    nxj: 'parent.clientManager'
  }
};
