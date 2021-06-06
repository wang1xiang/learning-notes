1. webpack 构建流程？

- 初始化参数，合并从 shell 脚本和配置文件中读取的参数，得到最终参数
- 开始编译，根据得到的参数生成 complier 对象，加载所有配置的插件，执行 run 方法开始编译
- 确定入口，根据 entry 找到入口文件
- 编译阶段，从入口文件出发，依次递归找到该模块所依赖的模块，通过配置的 loader 对模块进行解析翻译
- 完成编译，编译完成后，用模块之间的依赖关系，组装成一个个包含多个模块的 chunk，再把每个 chunk 转换成一个单独的文件输出到文件系统中

2. bundle，chunk，module

- bundle 是 webopack 打包后得到的文件
- chunk 是 webpack 在打包进行模块依赖分析时，代码分割出来的代码块
- module 是开发中的模块

3. webpack、grunt、gulp 区别

- 三者都是前端构建工具，早期 grunt 和 gulp 比较流行，目前使用 webpack 比较主流，不过轻量化的任务还是会使用 gulp 来处理，比如单独处理 css 文件
- grunt 和 gulp 是基于任务和流的，找到一个文件，对其做一系列的链式操作，整条链就是一个任务，多个任务就构成了整个 web 的构建流程
- webpack 是基于入口的，自动解析入口及递归所有依赖的文件，然后用不同的 loader 来处理，用 plugins 来扩展 webpack 功能

4. webpack、rollup、parcel

- webpack 适用于大型负责项目构建
- rollup 适用于基础库的打包，比如 vue、react
- parcel 适用于简单实验性项目，傻瓜式配置，满足低门槛快速看到效果

5. loader 和 plugins 区别

- loader 使得 webpack 有加载和解析其他非 js 文件的能力（著有在打包文件之前起作用）
  css-loader、style-loader
  babel-loader
  url-loader、file-loader
- plugins 可以扩展 webpack 的功能，使得 webpack 更加灵活（整个编译周期起作用）
  copyWebpackPlugin
  htmlWebpackPlusing
  dllPluin
  cleanWebpackPlugins
  DefinePlugins
  miniCssExtracrPlugin
  UglifyJsPlugin
  IgnorePlugins 从 bundle 中排除某些模块
  HotModuleReplacementPlugin

6. webpack 热更新原理

不用刷新浏览器就可以将变更的模块替换旧的模块

- 修改文件，文件系统接收更新并通知 webpack
- webpack 重新编译构建一个或多个模块，并通知 HMR 服务器进行更新
- HMR Server 使用 WebSocket 通过 HMR runtime 需要更新，HMR 运行时通过 HTTP 请求更新 jsonp
- HMR 运行时替换更新中的模块，如果确定这些模块无法更新时，则触发整个页面刷新
- hot-module-replacement-plugin 的作用是提供 HMR 的 runtime，并且将 runtime 注入到 bundle.js 代码里面去。一旦磁盘里面的文件修改，那么 HMR server 会将有修改的 js module 信息发送给 HMR runtime，然后 HMR runtime 去局部更新页面的代码。因此这种方式可以不用刷新浏览器。

7. 是否写过 Loader 和 Plugin？描述一下编写 loader 或 plugin 的思路？

   **loader**

- loader 本质是一个函数，将传递进的数据，处理后返回，函数传递一个参数，时 loader 匹配到的文件内容
- 返回处理后的结果
- loader 的执行顺序是和配置的顺序是相反

```js
const marked = require('marked')

module.exports = (source) => {
  const html = marked(source)

  return html
}
module: {
  rules: [
    {
      test: /.md$/,
      use: ['html-loader', './markdown-loader'],
    },
  ]
}
```

**plugin**

- webpack 生命周期有很多钩子，可以在合适的钩子中通过 webpack 提供的 API 改变输出结果
- 定义 Plugin 其实是定义一个类

```js
class MyPlugin {
  apply (compiler) {
    compiler.hooks.emit.tap('MyPlugin'. compilation => {
      // 此次打包的上下文
      for (const name in compilation.assets) {
        if (name.endsWith('.js')) {
          const contents = compilation.assets[name].source()
          const withoutComments = contents.replace.replace(/\/\*\*+\*\//g, '')
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length
          }
        }
      }
    })
  }
}
```

webpack 启动后，在读取配置的过程中会先执行 new MyPlugin(options) 初始化一个 MyPlugin 获得其实例。
在初始化 compiler 对象后，再调用 myPlugin.apply(compiler) 给插件实例传入 compiler 对象。
插件实例在获取到 compiler 对象后，就可以通过 compiler.plugin(事件名称, 回调函数) 监听到 Webpack 广播出来的事件。
并且可以通过 compiler 对象去操作 webpack。
