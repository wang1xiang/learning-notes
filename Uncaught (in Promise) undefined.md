> 登陆页跳转时报错 Uncaught (in promise) undefined

```js
this.$router.push({ path: '/home' })
```

> 解决的办法，在调用 push 时，设置回调函数，就可以解决这个问题

```js
this.$router.push(
  { path: '/home' },
  onComplete => {},
  onAbort => {}
)
```

> 后面的 onComplete => { }, onAbort => { } 就是在路由被打断时，解决因为没有回调函数而出现错误提示
