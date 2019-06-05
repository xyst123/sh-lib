# template
> Vue项目模板，只适用于前后端分离的项目

## Build Setup

```` bash
# install dependencies
cnpm install

# serve with hot reload at localhost:8080
npm run dev

# 测试环境构建（如果build后不加参数默认为test）
npm run build:test

# 沙箱环境构建
npm run build:sandbox

# 线上环境构建
npm run build:prod

````
## 配置多入口
+ 在`config/index.js`的导出对象的pages属性中修改，参见注释掉的部分

## 配置mock数据
+ 在mock目录，添加一个目录用以区分不同的空间，然后在目录里添加一个mock数据文件，可以参考`mock/user/info.js`
+ 如果项目比较小，也可以不区分不同的空间，直接在mock目录下新建一个mock数据文件，可以参考`mock/submit.js`
+ 开发过程中，mock文件修改时，会自动更新页面

## 配置开发环境代理
+ 在`config/dev.js`的导出对象的proxyTable属性处修改，参考文件内注释，修改后必须重新npm run dev才能生效
+ 如果proxyTable中配置了代理，会导致所有mock数据全部失效（即mock和proxyTable只能选用其一，这是为了避免数据来源错乱），要想恢复mock数据，请将proxyTable置为空对象。具体代码参见`build/dev-server.js`

## 自动生成雪碧图及sprite.css配置
### 方法1：小型项目，整个项目所有的图标都合并到一张图上
1. 把`config/index.js`导出对象中的useSprite属性设置为true；`spriteConfig.src`中的path属性设置需要合并的小图标文件的路径，默认是`src/image/icon/`；`spriteConfig.target`配置合成的图片和scss文件的路径
2. 在使用雪碧图的Vue文件中，`@import "../style/sprite.scss"`，在模板中直接引用合成后的图标样式'icon-xxx'，可以参考`src/view/Demo.vue`中weibo、qq图标
### 方法2：大型项目，一个页面的图标合到一张图片上，
1. 把`config/index.js`导出对象中的userMySprite属性设置为true
2. 每一个页面的图标文件单独存放在`src/image/icon/`下的一个独立的文件夹中，参见`src/image/icon/demo/`
3. 在使用雪碧图的Vue文件中，引用到背景图片url添加`?_sprite`后缀，参见`src/view/Demo.vue`中weixin图标
4. 构建后，每一个页面的css中图片自动合成到一张图片上，同时修改相关的样式属性

## vuex使用提供两种示例，参考`src/store/`

## 基于`fuck-env`这个库，开发过程支持自定义本地构建的环境变量
1. 在package.json中的config增加需要的环境变量缺省的key和vulue值
2. 在项目根目录的.env中文件中可以根据需要，动态修改环境变量的值，来达到不同的构建结果

