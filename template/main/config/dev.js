module.exports = {
  env: {
    NODE_ENV: '"dev"', // 输出的环境变量名
  },
  port: 8081, // dev-server监听的端口
  autoOpenBrowser: true, // 启动dev-server之后是否自动打开页面
  assetsSubDirectory: 'static',
  assetsPublicPath: '/',
  cssSourceMap: false, // 是否开启cssSourceMap
  imgName: 'img/[name].[ext]',
  fontName: 'font/[name].[ext]',
  // 需要代理的接口（可跨域）
  proxyTable: {
    // '/api/**': {  // 需要代理的路径
    //   target: 'https://api.interaction.sohu.com/', // 代理地址
    //   changeOrigin: true
    // }
  },
};
