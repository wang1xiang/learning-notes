#### `webpack`提升前端生产力的利器

##### 现代化项目

- 要求前端有独立的项目
- 采用数据驱动开发的方式增强可维护性
- 复杂项目结构必须进行模块化管理
- 重复规律性工作必须采取自动化工具实现

##### `webpack`与模块化开发

大多数人直接使用官方`cli`，通用配置，奉行“够用就行”；对于优秀开发人员，应学会因地治宜，灵活应用

使用高度集成的`cli`对特殊资源加载、打包过程优化、资源代码分块、Tree-shaking这样相对复杂的需求无从下手

模块化：复杂的代码按照功能的不同划分为不同的模块，提高开发效率、降低维护成本

两大核心特性：Loader机制和插件机制

#### `webpack`究竟解决了什么问题

前端项目中更高效地管理和维护项目中每一个资源

#### 模块化的演进过程

1. 文件划分方式

   `web`最原始的模块系统 每个功能及相关状态数据单独放在不同`js`文件中 约定每个文件是一个独立的模块

       ├── module-a.js
       ├── module-b.js
       └── index.html
   缺点：

   - 模块直接在全局工作，污染全局作用域
   - 没有私有空间，模块内成员可以在外部被访问或修改
   - 模块增多，容易产生命名冲突
   - 无法管理模块与模块之间依赖关系
   - 维护过程中很难分辨每个成员所属的模块

2. 命名空间方式

   约定每个模块只暴露一个全局对象 将每个模块包裹到一个全局对象

   ```js
   window.moduleA = {
   	method1() {
   		console.log('a')
       }
   }
   ```

   只解决了命名冲突问题，其他问题依旧存在

3. `IIFE`

   立即执行函数为模块提供私有空间 将每个模块放在立即执行函数形成的私有作用域 需暴露的成员 通过全局对象挂载

   ```js
   (function() {
   	const name = 'a'
       function method1 () {
   		console.log('a')
       }
       window.moduleA = {
   		method1
       }
   })()
   ```

   解决全局污染和命名冲突问题

4. `IIFE`依赖参数

   使用`IIFE`参数作为依赖声明使用 使模块之间依赖关系更明显

   ```js
   (function ($) { // 通过参数明显表明这个模块的依赖
     var name = 'module-a'
     function method1 () {
       console.log(name + '#method1')
       $('body').animate({ margin: '200px' })
     }
     window.moduleA = {
       method1: method1
     }
   })(jQuery)
   ```

##### 模块加载问题

时间久、项目大时难维护

更为理想的页面引入一个`JS`文件入口 用到的模块通过代码控制、按需加载

##### 模块化标准规范

- `nodejs`中遵循`commonJS`规范来组织模块
- 浏览器环境中遵循ES Modules规范

##### 模块打包工具出现

随着模块化思想引入 产生一些新的问题

- 首先 `ES Modules`存在环境兼容问题  用户浏览器不统一
- 其次 模块化划分出的模块文件过多 前端频繁请求 影响工作效率
- 最后 `JS`模块化基础上的发散 `HTML`、`CSS`等需要模块化

#### 如何使用`webpck`实现模块化打包

- `webpack`作为模块打包工具，可以实现模块化代码打包的问题
- 对于有环境兼容问题的代码：可以在打包过程中通过`Loader`机制对其进行编译转换，在进行打包
- 对于不同种类的前端模块，支持在`javaScript`中以模块化的方式载入任意类型的资源文件：例如可以通过`webpack`实现在`JavaSCript`中加载`css`文件，被加载的`css`文件通过`style`的方式工作
- 具备代码拆分能力 项目所有模块按需分块打包  按需加载

##### `webpack`快速上手

##### 配置`webpack`打包过程

`webpack.config.js`运行在`nodejs`环境，可以直接在文件中使用`path`之类的`nodejs`内置模块

[例子](F:\github\webpack-all-demo\mydemo2)

##### `webpack`工作模式

针对不同环境的三组预设配置

- `production`模式 启动内置优化插件，自动优化打包结果，打包速度较慢（默认）
- `development`模式 自动优化打包速度，添加一些调试过程中的辅助插件以便于更好的调试错误
- `none`模式 运行最原始的打包，不做任何额外处理，分析模块打包结果

修改方式

- 通过`cli --mode`参数传入
- 通过配置文件设置`mode`属性

#### 通过Loader实现特殊资源加载

`webpack`实现整个项目的模块化 项目中各种资源都需要被管理

实现不同资源加载的核心是loader

##### 如何加载模块

通过`css-loader`加载`css`资源 `webpack`使用`loader`处理模块 内部loader只能处理`js`模块

`css`文件经过`css-loader`打包之后再由`webpack`打包

`css-loader` 只会把 `CSS` 模块加载到 `JS` 代码中，而并不会使用这个模块 需要在添加额外的`style-loader`才能正常工作

![image-20201112104146536](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20201112104146536.png)

`loader`是`webpack`实现前端模块化的核心 只有通过不同的`loader` 才能史西安任何类型资源的加载

##### 通过`js`加载资源模块

一般`webpack`入口都是`js`文件 打包入口就是应用的运行入口 

##### 开发一个 Loader

深入了解`loader`的工作原理

开发`markdown`文件转换为`html`

`webpack`资源加载类似工作管道 可以使用多个`loader` 输出结果必须是标准的`js`代码

![image-20201112120025547](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20201112120025547.png)

##### 多个`loader`配合

首先使用自己的`loader`转换为`html`文件 再次使用`html-loader`转换为`js`代码

#### 利用插件机制横向扩展`webpack`构建能力

`webpack`插件机制是为了增强`webpack`在项目自动化构建方面的能力（解决除`loader`资源模块打包外的其他自动化工作）

##### 常见应用场景：

- 实现自动在打包之前清除`dist`目录 `clean-webpack-plugin`

  每次打包都会覆盖到`dist`目录 只能覆盖同名文件 需要配置`output.path`

- 自动生成应用所需的`HTML`文件 `html-webpack-plugin`

  在`html`中自动注入`webpack`打包生成的`bundle`

- 根据不同环境为代码注入类似`API`地址这种可能变化的部分

- 拷贝不需要参与打包的资源文件到输出目录 `copy-webpack-plugin`

- 压缩`webpack`打包完成后输出的文件

- 自动发布打包结果到服务器实现自动部署

##### 开发一个插件

`webpack`的插件机制是软件开发中最常见的钩子机制（类似`web`中的事件）

在`webpack`整个工作过程有很多环节 便于插件的扩展 `webpack`在每个环节都埋下一颗钩子 这样开发插件的时候 通过往这些节点挂在不同的任务 就可以轻松扩展`webpack`的能力

需求：清除`webpack`打包结果的注释

#### 探索`webpack`运行机制和核心工作原理

了解`webpack`整个工作过程细节 （查阅代码）

#### 使用`Dev Server`提高本地开发效率

开发过程：编写源代码 --> `webpack`打包 --> 运行应用 --> 浏览器查看

提高开发效率（`webpack`已经提供相应功能）

1. 使用HTTP服务运行而不是文件形式预览  一来更接近生产环境状态 二来项目使用`AJAX`等`API`
2. 修改代码后`webpack`自动构建 浏览器即时显示最新结果
3. 提供`Source Map`支持 快速定位源代码位置

##### `webpack`自动编译

使用`webpack-cli`提供的`watch`工作模式

1. 启动添加`--watch`参数 打包完成`cli`不会退出
2. 初次构建后 项目中源文件会被监视
3. 发生更改 `webpack`会自动重新运行打包任务

此时开发体验 修改代码 → `Webpack` 自动打包 → 手动刷新浏览器 → 预览运行结果

需要用到[serve](https://github.com/zeit/serve) 直接运行静态资源 `serve dist`

接着使用[BrowserSync](https://www.browsersync.io/)实现浏览器自动刷新  `browser-sync dist --watch`

此时开发体验 修改代码 → `Webpack` 自动打包 → 自动刷新浏览器 → 预览运行结果

原理：`webpack`监视源代码变化 自动打包 dist目录被`BrowserSync`监听 自动编译并刷新浏览器

##### `Webpack Dev Server`

官方推出开发工具 提供开发服务器 集成自动编译和自动刷新浏览器

使用需要通过`npm`引入

运行`webpack-dev-server`过程

1. 内部启动一个`Http server` 为打包结果提供静态文件服务 并自动使用`webpack`打包我们应用
2. 监听源代码变化 变化后重新打包

![image-20201113142535492](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20201113142535492.png)

##### 配置选项

`devServer`专门用来为`webpac-dev-server`提供配置

```js
// ./webpack.config.js
const path = require('path')
module.exports = {
  // ...
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.github.com',
        pathRewrite: {
          '^/api': '' // 替换掉代理地址中的 /api
        },
        changeOrigin: true // 确保请求 GitHub 的主机名就是：api.github.com
      }
    },
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
    // ...
    // 详细配置文档：https://webpack.js.org/configuration/dev-server/
  }
}
```

##### `webpack`常用功能

- 静态资源访问

  `contentBase` 指定额外的静态资源路径 类似`copy-webpack-plugin`

- Proxy代理

  处理跨域请求

#### 配置`webpack SourceMap`

通过构建或编译之后 开发阶段编写的源代码转换为在生产环境运行的代码 这种进步同时也意味着实际运行的代码和真正编写的代码之间的差异

`Source Map`：映射转换后的代码与源代码之间的关系

`webpack`配置

```js
// ./webpack.config.js
module.exports = {
  devtool: 'source-map' // source map 设置
}
```

#### 模块支持热替换（`HMR`）机制

`webpack dev server`自动刷新问题：自动刷新导致页面状态丢失

每次修改完代码 `webpack`监视到变化 自动打包 并通过浏览器自动刷新 一旦页面整体刷新 页面中的任何操作状态都会丢失

##### `HMR`（`Hot Module Replacement`模块热替换）

”热拔插“ 计算机正在运行  插上去的设备可以立即工作  “热"指在运行过程中的即时变化

`webpack`模块热替换 实时的替换掉应用中某个模块 整体运行状态不会因此改变 例如上面的问题 使用`HMR` 就可以实现将修改的模块实时替换到应用中 不整体刷新

##### 开启`HMR`

两种方式

- 运行命令`webpack-dev-server --hot` 开启
- 将`devServer`对象的`hot`属性设置未`true` 然后需导入`HotModuleReplacementPlugin` 

`css`文件热更新正常 `js`文件热更新页面自动刷新 状态丢失

##### `HMR`疑问

`HMR`并不像`webpack`其他特性一样开箱即用 需要额外操作（手动通过代码处理 当模块更新过后 如何把更新后模块替换到页面中）

1. 为什么样式文件热更新？

   样式文件经过`loader`处理 在`style-loader`中已经自动处理了样式文件的热更新 不需要额外手动处理

2. 为什么脚本需要自己手动处理？

   样式文件更新后 只需把更新后的`CSS`及时替换到页面中 覆盖之前样式 实现更新

   而`JavaScript`模块没有规律 可能导出对象、字符串或函数 `webpack`面对毫无规律的`JS`模块 不知道怎么处理更新后的模块 也就无法直接实现一个可以通用所有情况的模块替换方案

3. 为什么`vue-cli`、`create-react-app`脚手架`javaScript`代码会热更新？

   框架中每个文件都有规律 例如`react`要求每个模块导出必须是一个函数或类 这样就有了通用的替换方法

##### `HMR APIs`

`HotModuleReplacementPlugin`提供一套处理`HMR`的`API` 使用这些`API`将更新后的模块替换到正在运行的页面

#### 玩转`webpack`高级特性应对项目优化需求

#####  `Tree Shaking`清除未引用代码（dead-code）

`webpack`生产模式打包的优化过程中 自动开启`tree shaking` 检测未引用代码 然后清除

在`mode`为`development`、`none`时 需要配置`optimization`

```json
module.exports = {
  // ... 其他配置项
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
    // 开启压缩代码功能 压缩输出结果
    minimize: true
  }
}
```

`tree-shaking`实现 过程用到`webpack`的两个优化功能

- `usedExports`-打包结果只导出外部用到的成员
- `minimize`-压缩打包结果

##### `sideEffects`副作用

用于标识代码是否有副作用 从而提供更大的压缩空间

模块副作用指的是模块执行的时候除了导出成员 是否还做了其他事情

##### `Code Splitting`分块打包

`webpack`实现前端模块化优势固然明显 但也存在弊端：最终会将包打包到一起 `All In One`的方式导致包过大

合理方案：`code Splitting`将打包结果按照一定规则分离到每个`bundle`中 按需加载 降低应用的启动成本 提高响应速度

`webpack`实现分包的方式

1. 根据业务配置多个打包入口 输出多个打包结果
2. 结合ES Modules`动态导入 按需加载模块

###### 多入口打包

多入口打包适用于多页应用 一个页面对应一个打包入口 对于不同页面公用的部分 提取到公共的结果中

##### 动态导入

按需加载：应用运行过程中 需要哪个模块资源 才去加载

`webpack`支持使用动态导入的方式实现模块按需加载 而且所有导入的模块都会被提取到单独的`bundle `从而实现分包

#### 优化`webpack`构建速度和打包结果

为了开发阶段更好的体验 打包结果会越来越臃肿 因为`webpack`为实现这些特性 自动往打包结果中添加一些内容

##### 不同环境配置

`webpack`创建不同环境配置的方式：

- 配置文件中添加相应的判断条件
- 为不同环境单独添加一个配置文件

判断环境名返回不同配置对象 适用中小型项目 项目复杂 配置也会变得复杂

```xml
├── webpack.common.js ···························· 公共配置
├── webpack.dev.js ······························· 开发模式配置
└── webpack.prod.js ······························ 生产模式配置
```

##### 生产环境下的优化插件

`webpack`4的`production`模式 内部已开启很多通用的优化功能

几个主要优化功能：

###### `Define Pluginn`

用来为代码中注入全局成员 `production`模式下 默认通过`DefinePlugin`往代码中注入`proces.env.NODE_ENV`变量

很多第三方模块通过这个变量去判断运行环境

###### `Mini CSS Extract Plugin`

`css`文件打包 一般使用`style-loader`处理 最终打包结果是`CSS`代码嵌入到`SJS`代码中

`mini-css-extract-plugin`可以将`CSS`代码从打包结果中提取出来

需要使用插件提供的`loader`替换掉`style-loader` 以此来获取所有样式

打包之后 样式存入独立的文件中 通过`link`标签引入页面

#### `Optimize CSS Assets Webpack Plugin`

生产模式会自动压缩`js`代码 但是通过`mini-css-extract-plugin`打包的`css`文件不会自动压缩

此插件不是配置在`plugins`中 而是添加到`optimization`对象中的`minimizer`属性

原因：配置在`plugins`中 插件在任何情况下都会工作 配置在`minimizer`中 只会在`minimizer`特性开启会工作

这样配置会导致`js`文件不会被压缩

原因：设置了`minimizer`使用自定义压缩器插件 内部的`js`压缩器（`terser-webpack-plugin`）会被覆盖 需手动添加回来

#### 使用`Dev Server`提高本地开发效率

开发过程：编写源代码 --> `webpack`打包 --> 运行应用 --> 浏览器查看

提高开发效率（`webpack`已经提供相应功能）

1.  使用HTTP服务运行而不是文件形式预览，一来更接近生产环境状态，二来项目使用`AJAX`等`API`

2.  修改代码后`webpack`自动构建，浏览器即时显示最新结果

3.  提供`Source Map`支持，快速定位源代码位置

##### `webpack`自动编译

使用`webpack-cli`提供的`watch`工作模式

1.  启动添加`--watch`参数，打包完成`cli`不会退出

2.  初次构建后，项目中源文件会被监视

3.  发生更改，`webpack`会自动重新运行打包任务

此时开发体验修改代码 → `Webpack` 自动打包 → 手动刷新浏览器 → 预览运行结果

需要用到[serve](https://github.com/zeit/serve) 直接运行静态资源 `serve dist`

接着使用[BrowserSync](https://www.browsersync.io/)实现浏览器自动刷新 `browser-sync dist --watch`

此时开发体验 修改代码 → `Webpack` 自动打包 → 自动刷新浏览器 → 预览运行结果

原理：`webpack`监视源代码变化，自动打包，dist目录被`BrowserSync`监听，自动编译并刷新浏览器
[例子](https://github.com/wang1xiang/webpack-tutorial/tree/main/05watch-model)
##### `Webpack Dev Server`

官方推出开发工具，提供开发服务器，集成自动编译和自动刷新浏览器

使用需要通过`npm`引入

运行`webpack-dev-server`过程

1.  内部启动一个`Http server`，为打包结果提供静态文件服务，并自动使用`webpack`打包我们应用

2.  监听源代码变化，变化后重新打包
![image-20201113142533359.png](https://upload-images.jianshu.io/upload_images/24129137-3e366565b620ed23.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
##### 配置选项

`devServer`专门用来为`webpack-dev-server`提供配置
```js
// ./webpack.config.js
const path = require('path')
module.exports = {
  // ...
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.github.com',
        pathRewrite: {
          '^/api': '' // 替换掉代理地址中的 /api
        },
        changeOrigin: true // 确保请求 GitHub 的主机名就是：api.github.com
      }
    },
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
    // ...
    // 详细配置文档：https://webpack.js.org/configuration/dev-server/
  }
}
```
[例子](https://github.com/wang1xiang/webpack-tutorial/tree/main/06webpack-devServer)
##### `webpack`常用功能

*   静态资源访问

    `contentBase` 指定额外的静态资源路径，类似`copy-webpack-plugin`

*   Proxy代理

    处理跨域请求

#### 配置`webpack SourceMap`

通过构建或编译之后，开发阶段编写的源代码转换为在生产环境运行的代码，这种进步同时也意味着实际运行的代码和真正编写的代码之间的差异

`Source Map`：映射转换后的代码与源代码之间的关系
[例子](https://github.com/wang1xiang/webpack-tutorial/tree/main/04source-map%E5%A4%9A%E7%A7%8D%E6%96%B9%E5%BC%8F%E6%89%93%E5%8C%85)
`webpack`配置
```js
// ./webpack.config.js
module.exports = {
  devtool: 'source-map' // source map 设置
}
```
#### 模块支持热替换（`HMR`）机制

`webpack dev server`自动刷新问题：自动刷新导致页面状态丢失

每次修改完代码，`webpack`监视到变化，自动打包，并通过浏览器自动刷新，一旦页面整体刷新，页面中的任何操作状态都会丢失

##### `HMR`（`Hot Module Replacement`模块热替换）

”热拔插“ 计算机正在运行，插上去的设备可以立即工作，“热"指在运行过程中的即时变化

`webpack`模块热替换，实时的替换掉应用中某个模块，整体运行状态不会因此改变 例如上面的问题，使用`HMR` 就可以实现将修改的模块实时替换到应用中，不整体刷新

##### 开启`HMR`

两种方式

*   运行命令`webpack-dev-server --hot` 开启

*   将`devServer`对象的`hot`属性设置未`true`，然后需导入`HotModuleReplacementPlugin`

`css`文件热更新正常 `js`文件热更新页面自动刷新，状态丢失

##### `HMR`疑问

`HMR`并不像`webpack`其他特性一样开箱即用，需要额外操作（手动通过代码处理 当模块更新过后 如何把更新后模块替换到页面中）

1.  为什么样式文件热更新？

    样式文件经过`loader`处理，在`style-loader`中已经自动处理了样式文件的热更新 不需要额外手动处理

2.  为什么脚本需要自己手动处理？

    样式文件更新后，只需把更新后的`CSS`及时替换到页面中，覆盖之前样式，实现更新

    而`JavaScript`模块没有规律，可能导出对象、字符串或函数，`webpack`面对毫无规律的`JS`模块，不知道怎么处理更新后的模块，也就无法直接实现一个可以通用所有情况的模块替换方案

3.  为什么`vue-cli`、`create-react-app`脚手架`javaScript`代码会热更新？

    框架中每个文件都有规律，例如`react`要求每个模块导出必须是一个函数或类，这样就有了通用的替换方法

##### `HMR APIs`

`HotModuleReplacementPlugin`提供一套处理`HMR`的`API`，使用这些`API`将更新后的模块替换到正在运行的页面
[例子](https://github.com/wang1xiang/webpack-tutorial/tree/main/07hmr-example)

#### 玩转`webpack`高级特性应对项目优化需求

##### `Tree Shaking`清除未引用代码（dead-code）

`webpack`生产模式打包的优化过程中，自动开启`tree shaking`，检测未引用代码，然后清除

在`mode`为`development`、`none`时，需要配置`optimization`
```js
module.exports = {
  // ... 其他配置项
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
    // 开启压缩代码功能 压缩输出结果
    minimize: true
  }
}
```
`tree-shaking`实现 过程用到`webpack`的两个优化功能

*   `usedExports`-打包结果只导出外部用到的成员

*   `minimize`-压缩打包结果
[例子](https://github.com/wang1xiang/webpack-tutorial/tree/main/08tree-shaking)
##### `sideEffects`副作用

用于标识代码是否有副作用，从而提供更大的压缩空间

模块副作用指的是模块执行的时候除了导出成员，是否还做了其他事情

##### `Code Splitting`分块打包

`webpack`实现前端模块化优势固然明显，但也存在弊端：最终会将包打包到一起 `All In One`的方式导致包过大

合理方案：`code Splitting`将打包结果按照一定规则分离到每个`bundle`中，按需加载 降低应用的启动成本，提高响应速度

`webpack`实现分包的方式

1.  根据业务配置多个打包入口，输出多个打包结果

2.  结合ES Modules`动态导入，按需加载模块

###### 多入口打包

多入口打包适用于多页应用，一个页面对应一个打包入口，对于不同页面公用的部分 提取到公共的结果中
[例子](https://github.com/wang1xiang/webpack-tutorial/tree/main/10dynamic-import)
##### 动态导入

按需加载：应用运行过程中，需要哪个模块资源，才去加载

`webpack`支持使用动态导入的方式实现模块按需加载，而且所有导入的模块都会被提取到单独的`bundle`从而实现分包
[例子](https://github.com/wang1xiang/webpack-tutorial/tree/main/10dynamic-import)
#### 优化`webpack`构建速度和打包结果

为了开发阶段更好的体验，打包结果会越来越臃肿，因为`webpack`为实现这些特性 自动往打包结果中添加一些内容

##### 不同环境配置

`webpack`创建不同环境配置的方式：

*   配置文件中添加相应的判断条件[例子](https://github.com/wang1xiang/webpack-tutorial/tree/main/11environment-config)

*   为不同环境单独添加一个配置文件[例子](https://github.com/wang1xiang/webpack-tutorial/tree/main/12multiple-env-config)

判断环境名返回不同配置对象，适用中小型项目，项目复杂，配置也会变得复杂
```js
├── webpack.common.js ···························· 公共配置
├── webpack.dev.js ······························· 开发模式配置
└── webpack.prod.js ······························ 生产模式配置
```
##### 生产环境下的优化插件

`webpack`4的`production`模式，内部已开启很多通用的优化功能

几个主要优化功能：

###### `Define Pluginn`

用来为代码中注入全局成员 `production`模式下，默认通过`DefinePlugin`往代码中注入`proces.env.NODE_ENV`变量

很多第三方模块通过这个变量去判断运行环境[例子](https://github.com/wang1xiang/webpack-tutorial/tree/main)

###### `Mini CSS Extract Plugin`

`css`文件打包，一般使用`style-loader`处理，最终打包结果是`CSS`代码嵌入到`SJS`代码中

`mini-css-extract-plugin`可以将`CSS`代码从打包结果中提取出来

需要使用插件提供的`loader`替换掉`style-loader`，以此来获取所有样式

打包之后，样式存入独立的文件中，通过`link`标签引入页面

#### `Optimize CSS Assets Webpack Plugin`

生产模式会自动压缩`js`代码，但是通过`mini-css-extract-plugin`打包的`css`文件不会自动压缩

此插件不是配置在`plugins`中 而是添加到`optimization`对象中的`minimizer`属性

原因：配置在`plugins`中 插件在任何情况下都会工作，配置在`minimizer`中只会在`minimizer`特性开启会工作

这样配置会导致`js`文件不会被压缩

原因：设置了`minimizer`使用自定义压缩器插件，内部的`js`压缩器（`terser-webpack-plugin`）会被覆盖，需手动添加回来

[例子](https://github.com/wang1xiang/webpack-tutorial/tree/main/14mini-css-extract%2Boptimize)