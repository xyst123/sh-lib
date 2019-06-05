const path = require('path');
// [id]，被chunk的id替换
// [name]，被chunk的name替换（chunk没有name时使用id替换）
// [hash]，被compilation生命周期的hash替换
// [chunkhash]，被chunk的hash替换
// src/assets中的资源webpack会当做模块解析；static中的资源webpack只是简单地复制

module.exports = {
  env: {
    NODE_ENV: '"test"', // 输出的环境变量名
  },
  assetsRoot: path.resolve(__dirname, '../dist'), // webpack输出的目标文件夹路径，必须是本地文件系统的绝对路径
  assetsSubDirectory: 'static', // 打包后除了index.html之外的静态资源存放的路径
  assetsPublicPath: '/', // 打包后，index.html里面引用资源的的相对地址
  filename: 'js/[name].js', // 编译输出js文件名格式
  chunkFilename: 'js/[name].js', // 没有指定输出名的js文件输出的文件名格式
  styleFilename: 'css/[name].css', // 输出css文件名格式
  imgName: 'img/[name].[ext]', // [src/assets/**/*]中图片在文件中引入的名字
  fontName: 'font/[name].[ext]', // [src/assets/**/*]中字体在文件中引入的名字
  // 编译生成html时的配置选项，详见https://github.com/kangax/html-minifier#options-quick-reference
  htmlMinify: {
    removeComments: true,
  },
  vendor: [], // 可自由配置vendor要包含的模块，默认引入所有从node_modules文件夹中引入并使用的模块

  // manifest提取vendor中的运行时代码，防止在vendor中打包模块不变，但是每次重新打包生成新的hash值
  // 默认不生成manifest，以减少网络请求链接数
  manifest: false,
  productionSourceMap: true, // 是否生成sourcemap

  // 运行`npm run build test --report`，在打包结束后可在浏览器查看打包分析报告
  bundleAnalyzerReport: process.env.npm_config_report,
};
