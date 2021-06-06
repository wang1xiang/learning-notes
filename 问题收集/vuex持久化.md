#### vuex 持久化

> vuex 会在页面刷新后失去数据，因为 vuex 也是 js，存在于内存中，当页面刷新时导致 js 重新加载，所以一般会用 sessionStorage 对 vuex 做一个存储，防止 vuex 丢失，代码如下：

> 在 App.vue 中

```js
  created () {
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
    }
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', this.setVuexToSession)
  },
  methods: {
    setVuexToSession () {
      if (this.$route.name !== 'login') {
        sessionStorage.setItem('store', JSON.stringify(this.$store.state))
      } else {
        sessionStorage.removeItem('store')
      }
    },
  }
```
