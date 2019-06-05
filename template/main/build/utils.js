const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('../config');

const buildEnv = process.env.NODE_ENV || 'dev';
const { userMySprite } = config.commonConfig;

function iterateObject(object, handler) {
  const keys = Object.keys(object);
  keys.forEach((key) => {
    const value = object[key];
    handler(value, key, object);
  });
}

function cssLoaders(options) {
  options = options || {};
  const isDev = options.isDev === true;
  const addMySpriteLoader = userMySprite && !isDev;
  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV !== 'dev',
      sourceMap: options.sourceMap,
    },
  };

  const msprite = {
    loader: 'msprite-loader',
    options: {
      outputPath: './src/assets/icon/',
      scale: 0.3333333333333,
    },
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = [cssLoader];
    if (addMySpriteLoader) {
      loaders.push(msprite);
    }

    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap,
        }),
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
      });
    }
    return ['vue-style-loader'].concat(loaders);
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders('postcss', { path: '../.postcssrc.js' }),
    less: generateLoaders('less'),
    scss: generateLoaders('sass'),
  };
}

module.exports = {
  iterateObject,
  assetsPath(_path) {
    const { assetsSubDirectory } = config[buildEnv];
    return path.posix.join(assetsSubDirectory, _path);
  },
  cssLoaders,
  styleLoaders(options) {
    const output = [];
    const loaders = cssLoaders(options);
    iterateObject(loaders, (loader, extension) => {
      output.push({
        test: new RegExp(`\\.${extension}$`),
        use: loader,
      });
    });
    return output;
  },
};
