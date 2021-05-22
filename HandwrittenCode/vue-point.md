1. 介绍响应式数据原理
   vue2.x 响应式数据核心是 Object.defineProperty，通过给 data 中的数据添加 getter 和 setter 变为响应式数据，当页面使用时，通过 Dep 类进行依赖收集（收集当前组件的 watcher），如果属性发生变化，通知对应依赖调用 update 方法进行更新

   - Observer：设置对象的 getter 和 setter，用于依赖收集和派发更新
   - Dep：Dependency 依赖收集，收集房前响应式对象的依赖关系，每个响应式对象包括子对象都用于一个 Dep 实例（里面的 subs 是 Watcher 实例数组），当数据变更时，通过 dep.notify()通知每个 watcher
   - Watcher：观察者对象，分为渲染 Warcher、计算属性 Watcher 和侦听器 Warcher

   vue3.x 使用 Proxy 代替 Object.defineProperty，Proxy 可以直接监听对象和数组的变化，并且有多达 13 中拦截方法

2. vue 如何检测数组变化

   考虑性能原因没有用 defineProperty 对数组每一项进行拦截，而是通过重写数组方法（shift、unshift、push、pop、splice、sort、reverse）进行重写，修改索引和长度是无法监控的，需要使用以上 7 中重写方法触发数组对应的 watcher
   核心是把数组中会改变原有数组的方法进行重写，当被调用时，调用 dep.notify 方法和 ObserveArray 方法，遍历数组的每一项，把对象的元素转换为响应式对象

3. nextTick(异步执行队列) 实现原理

   由来：由于 VUE 的数据驱动视图更新，是异步的，即修改数据的当下，视图不会立刻更新，而是等同一事件循环中的所有数据变化完成之后，再统一进行视图更新。
   在下次 DOM 更新循环结束之后执行回调，在修改数据后立即使用此方法获取更新后的 DOM。原理是通过（promise，mutationObserver,setTimmediate,setTimeout)

   - 优先使用 promise 处理回调函数队列，先判断浏览器是否支持 promise，如果支持则利用 promise ，标记为微任务
   - 不支持，则判断浏览器不是 IE，并且是否支持 MutationObserver（是个用来监视 DOM 变动的接口，能监听一个 DOM 对象上发生的子节点删除、属性修改、文本内容修改等等），如果支持则实例化一个观察者对象，观察文本节点发生变化时，触发执行所有回调函数 ，标记为微任务
   - 如果都不支持，在 IE 和 nodejs 环境中调用 setImmediate，setImmediate 的执行效率比 setTimeout 好
   - 最后调用 setTimeout 并设置延时为 0，设置为 0 时也有 4ms 的延迟

   vue 多次更新数据，最终会进行批处理更新。内部就是调用 nextTick 实现延迟更新

   ```js
   let cbs = []
   let pendings = false
   function flushCallbacks() {
     cbs.forEach((fn) => fn())
     pendings = false
   }
   function nextTick(fn) {
     cbs.push(fn)
     if (!peddings) {
       peddings = true
       Promise.resolve().then(flushCallbacks)
     }
   }
   function render() {
     console.log('渲染')
   }

   nextTick(render)
   nextTick(render)
   nextTick(render)
   ```

4. vue 生命周期

   Vue 生命周期钩子就是回调函数，在创建组件实例的过程中调用对应的钩子方法

   - beforeCreate
     实例初始化之后，数据观测（data observer）和 event/watcher 事件配置之前被调用；此时 data 和 DOM 都没有初始化，不能给数据赋值

   - created
     实例创建完成调用，在这步实例完成以下配置：数据观测（data observer)，属性和方法的运算，event/watch 事件回调；此时 data 已经完成初始化工作，但页面 DOM 依旧不能获取

   - beforeMount
     在挂载开始之前被调用，相关 render 函数首次被调用，与 created 相比只有一个是否是浏览器的判断，所以 data、DOM 状态和 created 是一样的

   - mounted
     el 被新创建的 vm.$el 替换，并挂载到实例上之后调用该钩子；此时数据模型和页面 DOM 初始化完成

   - beforeUpdate
     数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前，可以在此钩子中进一步更改状态，不会触发附加的重渲染过程

   - updated
     数据更改导致虚拟 DOM 重新渲染和打补丁，在这之后调用该钩子，当 updated 被调用时，组件 DOM 已经更新，可以执行依赖 DOM 的操作

   - activated
     keep-alive 组件激活调用

   - deactived
     keep-alive 组件停用时调用

   - beforeDestroy
     实例销毁之前调用，在这一步，实例仍然完全可用，可以执行一些组件销毁前对页面的特殊操作。

   - destroy
     实例销毁后调用，调用后，DOM 被完全清除

   - errorCaptured
     当子孙组件发生异常时，触发这个钩子函数

   - serverPrefetch
     2.6 新增且只有服务端渲染触发的钩子函数

5. Vue 父子组件生命周期调用顺序

   - 组件渲染先父后子，渲染完成先子后父
   - 组件销毁先父后子，销毁完成先子后父
     父组件挂载完成必须等到子组件都挂载完成后，才算父组件挂载完，所以父组件 mounted 肯定时在子组件 mounted 之后执行

6. computed 特点

   - computed 内部实现惰性的 computed watcher，不会立刻求值，持有一个 dep 实例
   - 内部通过 this.dirty 属性滚标记计算属性是否需要重新求值
     当 computed 的依赖状态发生改变，会通知 computed watcher，判断 this.dep.subs 中是否有订阅者，有的话会重新计算，并对比新旧值判断是否需要渲染
     当计算属性依赖其他属性时，属性并不会立即计算，只有其他地方需要读取属性时才会真正计算，具备 lazy 特性
   - 与监听器区别
     computed watcher 作为缓存功能的观察者，可以将一个或多个 data 属性进行复杂计算生成一个新值，提供给渲染函数使用，当依赖发生变化时，并不会立即求值，而是先标记为脏数据，等下次调用时，再进行计算。而监听器 watcher 不具备缓存性，当监听属性发生变化，立即执行回调

7. watch 中的 deep:true 实现原理

   当指定 deep 为 true 时，如果监听的值为数组，会对对象中每一项进行求值，此时会将当前 watcher 存入到对应属性的依赖中，这样数组中的对象发生变化也会通知数据更新；如果监听值为对象，对 obj.a.b.c 这样深层次的修改也一样会触发 watch ，内部原理是对 deep 的属性使用递归，而且在此过程会不断触发依赖收集，耗费性能

   ```js
   function _traverse(val: any, seen: SimpleSet) {
     let i, keys
     const isA = Array.isArray(val)
     // 如果不是Array和Object 或被冻结时直接返回
     if (
       (!isA && !isObject(val)) ||
       Object.isFrozen(val) ||
       val instanceof VNode
     ) {
       return
     }
     // 拿到dep.id保证不会重复收集依赖
     if (val.__ob__) {
       const depId = val.__ob__.dep.id
       if (seen.has(depId)) {
         return
       }
       seen.add(depId)
     }
     // 数组循环递归调用_traverse
     if (isA) {
       i = val.length
       while (i--) _traverse(val[i], seen)
     } else {
       // 对象遍历所有key 执行一次读取操作，在递归子值
       keys = Object.keys(val)
       i = keys.length
       // val[keys[i]]触发依赖收集操作
       while (i--) _traverse(val[keys[i]], seen)
     }
   }
   ```

8. Vue 事件绑定原理

   vue 使用 v-on 或@指令绑定事件并提供事件修饰符，基本流程是进行模板编译生成 AST，生成 render 函数后并执行得到 VNode，VNode 生成真实 DOM 或组件时使用 addEventListener 进行事件绑定

9. v-if 和 v-show 区别

  - v-if 在编译过程中被转换为三元表达式，条件不满足时不渲染此节点；v-show 会被编译为指令，条件不满足时控制样式将对应节点隐藏
  - v-if 不是真正的指令，在编译时就被转换，v-if 控制该 DOM 是否渲染；v-show 控制样式
  - v-if 不满足不渲染，v-show 不满足也渲染，只是设置样式

10. v-for 和 v-if 不能连用

  解析时先解析 v-for，在解析 v-if，如果连用会把 v-if 添加到 v-for 遍历出的每个元素上，造成性能浪费

11. v-model 实现原理及自定义 v-model

  v-model 相当于`:value="value" @input="”`

12. 组件 data 为什么是函数

  调用组件时需要进行实例化操作，调用 data 函数返回一个对象作为组件数据源，保证多个组件数据互不影响；如果是对象，对象属于引用类型，会影响到其他组件实例

13. Vue 组件通信

  - propsDown 和 eventUp，父组件设置 props，子组件通过$emit 触发事件
  - $parent,$children 获取当前组件父组件和子组件列表
  - $attrs和$listeners
  - 通过 provide 提供变量，子孙组件中通过 inject 注入变量
  - $refs 获取实例
  - eventBus 平级组件使用事件总线
  - vuex 状态管理

14. 为什么使用虚拟 DOM，并通过 vnode 来描述一个 DOM 解构

  - virtual DOM 是用 js 对象来描述真实 DOM，是对 DOM 的抽象
  - js 操作效率高，可以将 DOM 操作转换为对象操作，最终通过 diff 算法对比差异进行更新 DOM（减少对真实 DOM 的操作）
  - 虚拟 DOM 不依赖真实平台环境从而实现跨平台

**Vnode 描述 DOM**
  虚拟 DOM 实现是普通对象包含 tag、data、children 等属性对真实节点的描述

  ```js
  {
  chidlren: [VNode, Vnode],
  context: {...},
  data: {...},
  tag: 'p',
  ...
  }
  ```

14. Vue 的 diff 算法

  1. diff 算法是虚拟 dom 生成的必然产物，通过新旧 dom 比较，将变化的地方更新到真是的 dom 上，另外也需要 diff 的高效执行来降低意见复杂度
  2. vue2.x 中为了降低 watcher 的粒度， 每一个组件都只有一个 watcher 与之对应，只有引入 diff 算法才能准确的找到发生变化的地方。
  3. vue 中的 diff 的执行时刻是组件实例执行其更新函数时，他会对比上一次的俨然结果 oldVnodeh 和新的渲染结果 newVnode,此过程成为 patch.
  4. diff 过程整体遵循 深度优先，同层比较。两个节点之间比较即根据它们是否拥有子节点或者文本节点做不同的操作，比较两组节点是 diff 的重点，首先假设头尾节点可能相同做 4 次节点比对尝试，如果找到相同的节点，按照通用方式遍历查找，查找结束才按情况处理剩下的节点，借助 key 通常可以非常精确的找到相同的节点，因此整个 patch 会很高效

15. key 的作用

  diff算法过程，会先进行新旧节点的首位交叉对比，当无法匹配时会用新节点的key与旧节点进行对比，从而找到响应旧节点

  为了高效的更新虚拟 DOM，其原理是 vue 在 patch 过程中执行 patchVnode，patchVnode 过程中会执行 updateChildren 方法，更新新旧子元素，这个过程中通过 key 可以精准判断两个节点是否是同一个，如果没有 key 的话，永远都认为是一个相同节点，所以只能强制更新，不断触发更新操作，额外多做很多 DOM 操作，如果加 key 的话，从而避免频繁更新不同元素，使得整个 patch 过程更加高效，减少 DOM 操作量，提高性能

  vue 在使用相同标签名元素的过渡切换时，也会使用 key 属性，目的是为了让 vue 可以区分他们，否则 vue 只会替换其内部属性而不会触发过渡效果

16. 模板编译原理

  Vue 中的模板编译是将 template 转换为 render 函数的过程，经历以下阶段

  - 在 parseHtml 中将 template 模板语法转换为 AST 语法树
    使用大量正则表达式对模板进行解析，遇到标签、文本时都会执行对应的钩子进行处理，是在 webpack 构建过程中使用 vue-loader 转换为 render 函数
  - 标记静态节点 markUp
    有一些数据首次渲染后不会再变化，对于的 DOM 也不会变化，此时需要深度遍历 AST 树，对静态节点和静态根节点进行标记，在重新 patch 时会跳过静态节点的比较
  - 重新生成代码 codeGen
    将优化后的 AST 语法树转换为可执行代码，通过 new Function()和 with 转为函数执行

  Vue 渲染过程
  - 调用compile函数，生成render函数字符串，编译过程如下
  - parse函数解析template生成ASt抽象语法树
  - optimize函数优化静态节点
  - generate函数生成render函数字符串
  - 调用new Watcher函数，监听数据的变化，当数据发生变化时，Render函数执行生成vnode对象
  - 调用patch方法，对比新旧vnode对象，通过diff算法，更新DOM

17. vue 常见性能优化

  - 编码阶段
    - 减少 data 中的数据，需要做响应式处理的数据添加到 data 中，因为 data 中的数据会添加 getter 和 setter，收集对应的 watcher
    - v-if 和 v-for 不能连用
    - 采用 keep-alive 缓存组件
    - 使用路由懒加载、异步组件
    - 防抖、节流
    - 第三方模块按需引入
    - 图片拦加载
    - SEO 优化
  - 打包阶段
    - 压缩代码
    - Tree Shaking/Scope Hoisting
    - 使用cdn加载第三方模块
    - 多线程打包happypack
    - splitChunks抽离公共文件
    - source Map优化
  - 用户体验
    - 骨架屏
    - PWA
    - Gzip压缩

18. 为什么使用异步组件

  如果组件功能多打包出的结果会变大，采用异步方式加载组件。使用import，异步组件会被分开打包，采用异步的方式加载组件，解决组件过大问题，如果不适用异步组件，组件功能较多时打包的结果就比较大

19. keep-alive理解
  
  采用LRU算法（最近最久未使用法），如果数据最近被访问过,那么将来被访问的几率也更高
  keep-alive 的实现正是用到了 LRU 策略,将最近访问的组件 push 到 this.keys 最后面,this.keys[0]也就是最久没被访问的组件,当缓存实例超过 max 设置值,删除 this.keys[0]
  keep-alive实现组件缓存，当组件切换时不会组件进行卸载
  两个属性：exclude任何匹配的组件都不会缓存，优先级高于include、include只有名称匹配的组件才缓存
  生命周期：activated/deactivated

20. 实现hash和history路由

  单页应用使得页面可以在无刷新的条件下重新渲染，通过hash或history可以改变url，但不刷新页面，前端路由原理的核心之一
  - hash
    通过改变url的hash值实现无刷新效果，hash值改变不会导致页面刷新
    如何监听hash变化？
    hash变化时触发hashChange事件，监听hashChange事件，在监听事件回调函数中，执行展示和隐藏不同UI显示，从而实现前端路由
    ```js
    window.onhashchange = function (event) {
      console.log(evebt)
    }
    ```
  - history
    采用History API中的pushState()和replaceState()方法对浏览器历史记录栈进行修改，压入栈或替换指定数据，虽然会改变当前页面URL，但是不会刷新页面，pushState会是History.length加1，而replaceState替换当前会话历史，不会增加History.length
    ```js
    window.history.pushState(stateObject, title, URL)
    window.history.replaceState(stateObject, title, URL)
    ```
    如何监听路由变化？
    通过popstate事件
    ```js
    window.addEventListener('popstate', function(event) {
      console.log(event)
    })
    ```  

21. vue-router中的导航守卫有哪些?
  
  - 全局前置钩子beforeEach
  - 全局解析守卫 beforeResolve
  - 全局后置钩子 afterEach
  - 路由独享守卫
    - beforeEnter直接在路由配置上定义
  - 组件内部守卫
    - beforeRouteEnter 守卫执行前组件实例未被创建，不能使用this
    - beforeRouteUpdate 路由改变，该组件被复用时调用
    - beforeRouteLevel

  - 完整的导航解析流程
  1. 导航被处罚
  2. 在失活的组件内调用beforeRouteLeel守卫
  3. 调用全局beforeEach守卫
  4. 再重用的组件中调用beforeRouteUpdate守卫
  5. 在路由配置调用beforeEnter守卫
  6. 解析异步路由组件
  7. 在被激活的组件中调用beforeEnter守卫
  8. 调用全局的beforeResolve
  9. 导航被确认
  10. 调用全局的afterEach钩子
  11. 触发DOM更新
  12. 调用beforeRouteEnter守卫中传给next的回调函数，创建好的组件实例会作为回调函数的参数传入

22. 简述vuex工作原理

  vuex中所有状态更新的唯一方式是提交mutation，异步操作通过action来提交mutation，这样使得可以方便的跟踪每一个状态的变化；如果mutation支持异步操作，就不知道状态时何时更新

23. 为什么Vue3.0采用Proxy
  
  vue2.x中使用递归和遍历data的方式实现数据的响应式处理，如果属性值也是对象，需要深度遍历，而且出于对性能考虑，vue2.x中对数组的处理是通过改写数组的方法从而实现数组的响应式处理，但对于数组的属性变化是检测不到的

  - Proxy可以劫持整个对象，并返回一个新的对象
  - 不仅可以代理对象，还可以代理数组
  - 还可以代理动态增加的属性

24. vue事件机制，手写EventEmitter
 
  Vue 事件机制 本质上就是 一个 发布-订阅 模式的实现
  ```js
  class EventEmitter {
    constructor () {
      this.subs = Object.create(null)
    }

    $emit(eventType, ...data) {
      if (this.subs[eventType].length)
      this.subs[eventType].forEach(handler => {
        handler(data)
      })
    }
    $on (eventType, fn) {
      this.subs[eventType] = this.subs[eventType] || []
      this.subs[eventType].push(fn)
    }
    $off(eventType, handler) {
      const index = this.subs[eventType].indexOf(handler)
      this.subs[eventType].splice(index, 1)
    }
  }
  ```

25. vue.set

  当向data中定义的对象或数组，添加新的属性是不会更新视图的，此时就需要使用vue.set
  ```js
  export function set(target: Array<any> | Object, key: any, val: any): any {
    // target为数组
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      // 修改数组长度
      target.length = Math.max(target.length, key)
      target.splice(key, 1, val)
      return val
    }
    // target为对象，key在target或target.prototype上，且不能在Object.prototype上
    if (key in target && !(key in Object.prototype)) {
      target[key] = val
      return val
    }
    // 以上不成立 则开始给target创全新的属性
    // 获取Observer实例
    const ob = (target: any).__ob__
    // target本身不是响应式数据直接赋值
    if (!ob) {
      target[key] = val
      return val
    }
    // 进行响应式处理
    defineReactive(ob.value, key, val)
    ob.dep.notify()
    return val
  }
  ```
  - 如果目标是数组，使用vue变异方法splice实现响应式
  - 如果目标是对象，判断属性存在时并且是响应式，直接赋值
  - 如果target本身就不是响应式也直接赋值
  - 如果属性不是响应式，则调用defineREactive方法进行响应式处理

26. vue.use是做什么的，原理是什么

  Vue.use()是用来使用插件的，可以在插件中扩展全局组件、指令和原型方法等
  插件不依赖于vue本身，直接把vue作为参数传进去即可
  每个插件都必须实现一个静态的install方法，当执行vue.use注册插件时，就会执行install方法，在install中的第一个参数就是vue对象，这样就不用通过import导入Vue
  同一个插件调用多次只会被运行一次

27. 组件中的name选项好处及作用

  - 通过名字找对对应的组件
  - 可以通过name属性实现缓存功能
  - 可以通过name来识别组件

28. vue使用了那些设置模式

  - 工厂模式-传入参数即可创建实例（createElement）：根据传入的参数不同返回不同的实例
  - 单例模式：单例模式整个程序有且皆有一个实例
  - 发布订阅模式：事件机制    
  - 观察者模式：watcher 和 dep的关系

29. 怎么理解单向数据流

  在vue中父组件通过prop将数据传递给子组件，子组件修改prop时会抛出错误
  如果子组件想修改数据，需要通过#emit子组件派发事件，父组件接收事件进行更新

  
30. 自定义指令

  - 分为全局注册和局部注册
    ```js
    Vue.directives('name', {})

    directive: {
      name: ''
    }
    ```
  - 自定义指令的钩子
    - bind：指令第一次绑定到元素时使用，只执行一次
    - inserted：被绑定元素，插入到父节点的DOM中时调用
    - update：组件更新时调用
    - componentUpdated：组件与子组件更新时调用
    - unbind：指令与元素解绑时调用，只执行一次
  除了update和componentUpdated，其余钩子都有el、binging、vnode三个参数

  案例：使用v-permission设置用户操作权限，对需要权限判断的DOM进行显示隐藏
  ```js
  function checkArray(key) {
    const permissionList = ['add', 'delete', 'watch', 'update']
    return permissionList.includes(key)
  }
  const permission = {
    inserted (el, binding) {
      let permission = binding.value // 获取到v-permission的值
      if (permission) {
        let hasPermission = checkArray(permission)
        if (!hasPermission) {
          // 没有权限 移除DOM元素
          el.parentNode && el.parentNode.removeChild(el)
        }
      }
    }
  }
  export default permission
  ```
