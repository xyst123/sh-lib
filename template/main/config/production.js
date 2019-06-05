const path = require('path');

module.exports = {
  env: {
    NODE_ENV: '"production"',
  },
  assetsRoot: path.resolve(__dirname, '../dist'),
  assetsSubDirectory: 'static',
  assetsPublicPath: '/',
  filename: 'js/[name].[hash:7].js',
  chunkFilename: 'js/[name].[hash:7].js',
  styleFilename: 'css/[name].[hash:7].css',
  imgName: 'img/[name].[hash:7].[ext]',
  fontName: 'font/[name].[hash:7].[ext]',
  htmlMinify: {
    removeComments: true,
  },
  vendor: [],
  manifest: false,
  productionSourceMap: false,
  bundleAnalyzerReport: process.env.npm_config_report,
};
