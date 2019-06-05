const chalk = require('chalk');
const express = require('express');
const utils = require('./utils');

let server = null;
const router = express.Router();

// 合法的http请求method
const REG_VALID_METHOD = /^(get|post)\s+/i;
// 合法的路由pattern
const REG_VALID_PATTERN = /^(get|post)\s+\/([\w\d/]*(\?\$[\w\d]+(&\$[\w\d]+)*)*)*[\w\d/]$/i;

function resolve(options) {
  /**
   * 通用请求
   * 每接到一个请求都遍历options对象
   */
  router.all('*', (req, res, next) => {
    const reqPath = req.path;
    const reqMethod = req.method.toLowerCase();
    let flag = false;
    utils.iterateObject(options, (item, key) => {
      if (REG_VALID_PATTERN.test(key)) {
        // 滤出请求方法类型
        const method = (REG_VALID_METHOD.exec(key)[0]).trim().toLowerCase();
        // 滤出url规则
        const keyArr = key.split(REG_VALID_METHOD);
        const urlPattern = (keyArr[keyArr.length - 1] || '').trim();
        if (reqMethod === method && reqPath === urlPattern) {
          const response = options[key].ok || {
            code: 0,
            msg: '请求成功',
          };
          if (req.query.callback) {
            res.jsonp(response);
          } else {
            res.json(response);
          }
          flag = true;
        }
      }
    });
    if (!flag) next();
  });
  server.use(router);
}

module.exports = function (app) {
  server = app;
  return function (options) {
    if (!options) {
      console.log(chalk.red('Mock: invalid parameters'));
      process.exit();
    }
    resolve(options);
  };
};
