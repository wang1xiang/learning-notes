### vue create xxx 创建项目 
* 接下来选择的话一般都默认
* 创建完成进入项目 yarn serve就可以运行
### 按需引入组件库
* 另一篇文章有提到
### 引入axios
* cnpm install axios --save--dev
* src下新建api文件夹，包括index导出，fetch和urls js文件
* api里面是接口文件
### 配置
* 添加vue.config.js文件
```javaScript
const resolve = require('path').resolve

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@api': resolve(__dirname, './src/api'),
        '@views': resolve(__dirname, './src/views'),
        '@config': resolve(__dirname, './src/config')
      }
    }
  }
}

```
* 使用时就不用../这样引入文件了
* 