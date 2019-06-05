require('./check-versions')();

const fs = require('fs');
const path = require('path');
const net = require('net');
const opn = require('opn');
const express = require('express');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const apiFallback = require('connect-history-api-fallback');

let server;
const webpackConfig = require('./webpack.dev.conf');
const config = require('../config');
const mock = require('./dev-mock');

const port = process.env.PORT || config.dev.port;
const autoOpenBrowser = Boolean(config.dev.autoOpenBrowser);

// https://github.com/chimurai/http-proxy-middleware
const { proxyTable } = config.dev;

const app = express();
const compiler = webpack(webpackConfig);

const devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
});

const hotMiddleware = webpackHotMiddleware(compiler, {
  log: () => { },
});

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', (compilation) => {
  compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddleware.publish({ action: 'reload' });
    cb();
  });
});

// mock
if (Object.keys(proxyTable).length === 0) {
  const dir = path.resolve(__dirname, '../mock');
  const serve = mock(app);
  const searchMock = (mockDir) => {
    fs.readdirSync(mockDir).forEach((file) => {
      if (file.indexOf('.') === 0) return;
      const mockFile = path.resolve(mockDir, file);
      if (fs.lstatSync(mockFile).isDirectory()) {
        searchMock(mockFile);
      } else {
        if (path.extname(mockFile) !== '.js') return;
        const obj = {};
        /* eslint-disable */
        const mockObj = require(mockFile);
        obj[mockObj.api] = mockObj.response;
        fs.watch(mockFile, (eventType, filename) => {
          const filePath = path.resolve(mockDir, filename);
          console.info('file changed %s', filePath);
          delete require.cache[filePath];
          try {
            const changedFile = require(filePath);
            obj[changedFile.api] = changedFile.response;
            console.log(changedFile.response);
            hotMiddleware.publish({ action: 'reload' });
          } catch (error) {
            console.error('mock', error);
          }
        });
        /* eslint-enable */
        serve(obj || {});
      }
    });
  };
  searchMock(dir);
}

// proxy api requests
Object.keys(proxyTable).forEach((context) => {
  let options = proxyTable[context];
  if (typeof options === 'string') {
    options = { target: options };
  }
  app.use(proxyMiddleware(options.filter || context, options));
});

// handle fallback for HTML5 history API
app.use(apiFallback());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

let uri = `http://localhost:${port}`;

let outerResolve;
const readyPromise = new Promise((resolve) => {
  outerResolve = resolve;
});

console.log('> Starting dev server...');
devMiddleware.waitUntilValid(() => {
  console.log(`> Listening at ${uri}\n`);
  if (autoOpenBrowser) {
    opn(uri);
  }
  outerResolve();
});

function bindPoint(portNum) {
  const testServer = net.createServer().listen(portNum);
  testServer.on('listening', () => {
    testServer.close();
    server = app.listen(portNum);
    uri = `http://localhost:${portNum}`;
  });

  testServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (portNum < port + 20) {
        console.log(`当前端口${portNum}被替换为${portNum + 1}`);
        portNum += 1;
        bindPoint(portNum);
      } else console.log(`端口${port}~${port + 20}均已被占用`);
    }
  });
}
bindPoint(port);

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close();
  },
};
