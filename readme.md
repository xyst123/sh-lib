# sh-cli资源库

## 添加组件
1. 将组件vue文件复制到component文件夹，组件需写好注释
2. 在/component/intro.json文件中添加组件描述
  ```
  // key为组件名，可省略“.vue”
  "Uploader": {
    "desc": "视频上传组件", // 组件功能说明
    "keyWords": ["文件", "视频", "上传"], // 搜索关键词
    "demo": "https://mp.sohu.com/mpfe/v3/main/news/addvideo", // demo地址
    "demoDesc": "上传视频按钮使用该组件", // demo说明
    "author": "xyst"  // 作者，有问题就找TA
  }
  ```
3. 将代码提交到远程

## 使用新添加的组件
1. 全局安装sh-cli
2. 执行sc u，更新本地资源库
3. 执行sc c uploader，自动安装Uploader组件到/src/component或/src/components，sh-cli详细使用方法参见sh-cli文档

## 添加函数
1. 将函数js文件复制到function文件夹，函数需写好注释
2. 在/function/intro.json文件中添加组件描述
  ```
  // key为函数名，可省略“.js”
  "throttle": {
    "desc": "节流函数，降低函数触发频率", // 函数功能说明
    "keyWords": ["节流"], // 搜索关键词
    "demo": "", // demo地址
    "demoDesc": "", // demo说明
    "author": "xyst"  // 作者，有问题就找TA
  }
  ```
3. 将代码提交到远程

## 使用新添加的函数
1. 全局安装sh-cli
2. 执行sc u，更新本地资源库
3. 执行sc f throttle，将throttle函数复制到剪贴板，sh-cli详细使用方法参见sh-cli文档

> 希望大家开发中把遇到的常用组件和函数添加到这个项目中，方便自己和小伙伴们使用