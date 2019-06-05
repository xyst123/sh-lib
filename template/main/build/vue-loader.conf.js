const utils = require('./utils');
const config = require('../config');

const isDev = process.env.NODE_ENV === 'dev';
const buildEnv = process.env.NODE_ENV || 'dev';

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isDev
      ? config.dev.cssSourceMap
      : config[buildEnv].productionSourceMap,
    extract: !isDev,
    isDev,
  }),
};
