#### keep-alive 存在问题

```js
<keep-alive :include="keepAlive" :exclude="exclude">
  <router-view />
</keep-alive>
data () {
  return {
    exclude: ['home']
  }
},
computed: {
  ...mapGetters({
    keepAlive: 'getKeepAlive'
  })
}
```

> 这里的 keepAlive 为状态管理中存的一份数据(路由名称)，如果某个路由被删除，单单从状态管理中删除是无用的，在 vue-devtool 中还可以看到路由的缓存，如果一直点下去，最终回导致崩溃

#### 解决

> 那么，在判断数据中不存在这个路由时，就可以销毁它，销毁组件使用 this.\$destory('componentName')，代码为：

```js
const mixin = {
 data() {
  return {
   routePath: ''
  }
 },
 mounted() {
  this.routePath = this.$route.name
 },
 computed: {
  visitedViews() {
   return this.$store.state.keepAlive
  }
 },
 watch: {
  visitedViews(value) {
   if(!value.includes(routePath))
    this.$destroy(this.$options.name)
   }
  }
 }
}
export default mixin
```

> 最后使用 mixins 混入到每个 keepAlive 缓存的页面上，查看 vue-devtool 可以看到删除路由时销毁组件，并没有被缓存了

#### 替代 keepAlive

> keepAlive 本质上会将组件中的数据和 dom 树都缓存下来，但是这样在页面打开很多时，仍然会占用较大的内存，所以可以考虑使用 vuex 将单个组件中用到的数据都缓存下来，打开某个页面时，再重新渲染页面。
