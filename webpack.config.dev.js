const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const HOT_SERVER_URL = '//localhost:3000';

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    index: [`webpack-dev-server/client?http:${HOT_SERVER_URL}`, 'webpack/hot/only-dev-server', 'babel-polyfill', './public/js/index']
  },
  output: {
    path: path.join(__dirname, 'target/classes/public'),
    filename: '[name]-bundle.js',
    publicPath: `${HOT_SERVER_URL}/static/`
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
    new WriteFilePlugin({ log: false }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
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
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
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
