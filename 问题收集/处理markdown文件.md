vue中如何将markdown文件转换为html并展示？

- 本地markdown文件

  1. 使用[typora](https://www.typora.io/)导出HTML格式

  2. 将导出的html文件和对应的图片文件添加到项目public下，修改图片路径

  3. 将html文件修改为js文件，并导出html片段

     ```js
     // htmlTemplate.js
     const htmlTemplte = `
     	html文件内容
     `
     export default htmlTemplate
     ```

  4. 在需要使用的文件中引入，通过`v-html`渲染，此时还需要再添加样式

  5. 在渲染的标签上添加 `class="markdown-body"`，下载样式[markdown.min.css](https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css)到本地

     ```html
     <div v-html="htmlTemplate" class="markdown-body"></div>
     ```

  6. 在当前vue页面中引入

     ```vue
     <style>
     @import '../assets/css/markdown.css';
     </style>
     ```

- 后台返回markdown文件

  1. 使用[markdown-it](https://github.com/markdown-it/markdown-it)处理markdown格式数据

  2. 安装`npm install markdown-it --save`

  3. 在对应的页面中使用

     ```vue
     <script>
     import MarkdownIt from 'markdown-it'
     const md = new MarkdownIt()
     
     export default {
       name: 'Post',
       metaInfo: {
         title: 'Post',
       },
       methods: {
         mdToHtml (markdown) {
           return md.render(markdown)
         }
       }
     }
     </script>
     ```

  4. 在使用v-html渲染的时候使用mdToHtml方法

     ```html
     <div class="col-lg-8 col-md-10 mx-auto" v-html="mdToHtml($page.post.content)"></div>
     ```

