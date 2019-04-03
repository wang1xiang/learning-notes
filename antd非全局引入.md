## 引入
* cnpm install ant-design-vue --save--dev //引入antd
## 配置
* 安装依赖<br>
  cnpm i babel-plugin-import --save--dev
  cnpm i babel-loader --save--dev
* 修改babel.config.js，在plugins中添加<br>  
  ```javascript
  plugins: [
    [
      'import',
      {
        'libraryName': 'ant-design-vue',
        'libraryDirectory': 'lib',
        'style': 'css'
      }
    ]
  ]
  ```
## 使用
* src下创建config目录，index.js和antDesignVueConfig.js
  ```
  import { Tree } from 'ant-design-vue'
  import Vue from 'vue'

  Vue.use(Tree)
  ```
  引入即可
  