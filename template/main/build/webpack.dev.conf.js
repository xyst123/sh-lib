const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');
const config = require('../config');
const utils = require('./utils');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach((name) => {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, isDev: true }),
  },

  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
  ],
});

utils.iterateObject(config.pages, (page) => {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      filename: page.filename,
      template: page.template,
      chunks: page.chunks,
      inject: page.inject,
      env: 'dev',
    }),
  );
});

module.exports = webpackConfig;
