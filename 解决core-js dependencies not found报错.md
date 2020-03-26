- yarn install 时报错

```js
core-js/modules/es6.regexp.replace in ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/views/Home.vue?vue&type=script&lang=js&

To install it, you can run: npm install --save core-js/modules/es6.regexp.replace

```

- 解决方法
  > 最新的 vue-cli 3.x 的版本，core-js 是 3.x 的版本，而这个版本中，对那些 polly 补丁包进行了整理，所以，在项目的根目录，yarn add core-js@2.6.9 --save 安装这个版本就没问题
