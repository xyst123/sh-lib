const path = require('path');
const SpriteSmithPlugin = require('webpack-spritesmith');
const formatter = require('eslint-friendly-formatter');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');

const buildEnv = process.env.NODE_ENV || 'dev';
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const eslintRule = {
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter,
    fix: config.commonConfig.autoFix,
  },
};
const exportsEslintRule = config.commonConfig.useEslint ? eslintRule : {};

const mutiEntry = {};
utils.iterateObject(config.pages, (value, key) => {
  mutiEntry[key] = config.pages[key].src;
});
const webpackConfig = {
  entry: mutiEntry,
  output: {
    path: config[buildEnv].assetsRoot,
    filename: '[name].js',
    publicPath: config[buildEnv].assetsPublicPath,
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: ['node_modules', path.resolve(__dirname, '../src/style/sprite')],
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js',
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      exportsEslintRule,
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: config.commonConfig.img2base64Limit,
          name: utils.assetsPath(config[buildEnv].imgName),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: config.commonConfig.font2base64Limit,
          name: utils.assetsPath(config[buildEnv].fontName),
        },
      },
    ],
  },
  plugins: [],
};

// 配置sprite插件
const spriteConfig = config.commonConfig.spriteConfig || false;
if (config.commonConfig.useSprite && spriteConfig) {
  const cssPath = [];
  if (spriteConfig.target.css) {
    cssPath.push([path.resolve(__dirname, `../${spriteConfig.target.css}`), {
      format: 'css_template',
    }]);
  }
  webpackConfig.plugins.push(new SpriteSmithPlugin({
    src: {
      cwd: path.resolve(__dirname, `../${spriteConfig.src.path}`),
      glob: spriteConfig.src.glob,
    },
    target: {
      image: path.resolve(__dirname, `../${spriteConfig.target.image}`),
      css: cssPath,
    },
    apiOptions: {
      cssImageRef: spriteConfig.cssImageRef,
    },
    spritesmithOptions: {
      algorithm: 'top-down',
      padding: spriteConfig.padding || 10,
    },
    customTemplates: {
      css_template: spriteConfig.template.css(spriteConfig.scale, spriteConfig.unit),
    },
  }));
}

module.exports = webpackConfig;
