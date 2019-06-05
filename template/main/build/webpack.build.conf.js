const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');
const config = require('../config');
const utils = require('./utils');

const buildEnv = process.env.NODE_ENV || 'dev';
const { env } = config[buildEnv];
let entry = {};
let htmlBundleConcat = ['vendor'];
let CommonsChunkConfig = {
  name: 'vendor',
  minChunks(module) {
    return (
      module.resource
      && /\.js$/.test(module.resource)
      && module.resource.indexOf(
        path.join(__dirname, '../node_modules'),
      ) === 0
    );
  },
};

if (config[buildEnv].vendor && config[buildEnv].vendor.length > 0) {
  entry = {
    vendor: config[buildEnv].vendor,
  };
  CommonsChunkConfig = {
    name: 'vendor',
    minChunks: Infinity,
  };
}

const webpackConfig = merge(baseWebpackConfig, {
  entry,
  module: {
    rules: utils.styleLoaders({
      sourceMap: config[buildEnv].productionSourceMap,
      extract: true,
    }),
  },
  devtool: config[buildEnv].productionSourceMap ? '#source-map' : false,
  output: {
    path: config[buildEnv].assetsRoot,
    filename: utils.assetsPath(config[buildEnv].filename),
    chunkFilename: utils.assetsPath(config[buildEnv].chunkFilename),
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // 插件文档https://doc.webpack-china.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env': env,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // 生产环境压缩时移除调试信息
        drop_debugger: buildEnv === 'production',
        drop_console: buildEnv === 'production',
      },
      mangle: {
        safari10: true,
      },
      sourceMap: config[buildEnv].productionSourceMap,
      parallel: true,
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath(config[buildEnv].styleFilename),
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
      },
    }),
  ],
});

if (config[buildEnv].manifest) {
  htmlBundleConcat = ['vendor', 'manifest'];
}
// 多入口配置
utils.iterateObject(config.pages, (page) => {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      filename: page.filename,
      template: page.template,
      chunks: [].concat(page.chunks).concat(htmlBundleConcat),
      inject: page.inject,
      minify: typeof (config[buildEnv].htmlMinify) === 'object' ? Object.assign({}, config[buildEnv].htmlMinify) : {},
      chunksSortMode: 'dependency',
      env: buildEnv,
    }),
  );
});

// vendor配置
webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin(CommonsChunkConfig));

if (config[buildEnv].manifest) {
  webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor'],
    }),
  );
}

webpackConfig.plugins.push(
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../static'),
      to: config[buildEnv].assetsSubDirectory,
      ignore: ['.*'],
    },
  ]),
);

if (config[buildEnv].productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin');

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        `\\.(${config[buildEnv].productionGzipExtensions.join('|')})$`,
      ),
      threshold: 10240,
      minRatio: 0.8,
    }),
  );
}

if (config[buildEnv].bundleAnalyzerReport) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
