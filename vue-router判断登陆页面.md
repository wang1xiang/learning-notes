## vuex设置
* state中添加userBean
* getters中设置getUserBean
* mutations中设置add和remove方法
* actions中提交add和remove
## vue-router设置
* path: '/login' 登陆界面
* path: '/' 根目录
  ``` javascript
  path: '/',
    meta: {
      requireAuth: true // 是否需要登陆验证
    },
    redirect: '/subAttribute', // 默认登陆进入页面
    component: () => import(/* webpackChunkName: "about" */ './views/Home.vue'),
    children: [
      {
        path: 'subAttribute',
        name: 'subAttribute',
        meta: {
          name: 'config',  // 一级菜单名字
          title: '设备属性',
          icon: 'table',
          requireAuth: true
        }
      }
    ]
## main.js设置
* 添加全局前置路由
  ``` javascript
  router.beforeEach((to, from, next) => {
    let userBean = store.getters.getUserBean
    if (to.matched.some(record => record.meta.requireAuth)){  // 判断该路由是否需要登录权限
      if (userBean) {  // 判断当前的User是否存在
        if (to.meta.name !== undefined) {
          sessionStorage.setItem('subMenu', to.meta.name)
        } else {
          sessionStorage.setItem('subMenu', '')
        }
        let name = to.name
        if (!name) {
          name = 'attributes'
        }
        sessionStorage.setItem('routeName', name)
        next()
      }
      else {
        next({
          path: '/login',
          query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
      }
    }
    else {
      next();
    }
  })
## Login组件中设置
*
  ``` javascript
  this.$store.dispatch('addUserBean', values.userName)
  if(this.$route.query.redirect){
    let redirect = this.$route.query.redirect;
    this.$router.push(redirect);
  }else{
    this.$router.push('/subAttribute');
  }
## APP中设置
* 设置router-view即可 
## Home组件中设置
* 退出时调用
  ``` javascript
  this.$store.dispatch('removeUserBean')
  this.$router.push('/login')
