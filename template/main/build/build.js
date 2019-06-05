require('./check-versions')();

const buildEnv = process.env.NODE_ENV || 'dev';

const path = require('path');
const ora = require('ora');
const rimraf = require('rimraf');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.build.conf');

const spinner = ora(`building for ${chalk.green(buildEnv)} env...`);
spinner.start();

const targetPath = path.join(config[buildEnv].assetsRoot, config[buildEnv].assetsSubDirectory);
rimraf(targetPath, (errorLevel1) => {
  if (errorLevel1) throw errorLevel1;
  webpack(webpackConfig, (errorLevel2, stats) => {
    spinner.stop();
    if (errorLevel2) throw errorLevel2;
    process.stdout.write(`${stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    })}\n\n`);
    console.log(chalk.cyan('  Build complete.\n'));
  });
});
