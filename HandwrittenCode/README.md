#### 深浅拷贝

深拷贝和浅拷贝值针对 Object 和 Array 这样的复杂类型

##### 浅拷贝

只复制对象第一层属性，如果基本类型则“传值”，若为引用类型，则“传址”

实现方法

1. Array.concat()、Array.slice()、Array.from()等

2. Object.assign()

   > 如果对象的属性值为简单类型，就是浅拷贝

3. es6 扩展运算符

   > 同 Object.assign()

##### 深拷贝

深拷贝是逐级对目标对象进行复制，会在栈内存重新分配空间存储新对象

实现方法

1. 通过 JSON 对象实现深拷贝（不考虑循环引用、Function、RegExp 的时候）

   > 1.无法实现对函数、RegExp 等特殊对象克隆 2.会将对象的 constructor 构造函数指向 Object 3.对象有循环引用时，会报错

2. Object.assign()

   > 如果属性值为对象或其它引用类型，就是浅拷贝

3. lodash cloneDeep()方法

4. 递归方式实现深拷贝，[案例](https://github.com/wang1xiang/learning-notes/blob/master/HandwrittenCode/js/deepClone.js)

#### 实现 new 方法

##### new 的过程中做了什么？

1. 创建一个空的对象
2. 给这个新对象构造原型链，链接到构造函数的原型对象上，从而新对象可以访问构造函数中的属性和方法
3. 执行构造函数中的代码，为新对象添加属性
4. 如果构造函数有返回值，则返回；否则默认返回新对象

##### 自己写代码实现 new

[案例地址](https://github.com/wang1xiang/learning-notes/blob/master/HandwrittenCode/js/myNew.js)

##### Object.create()

1. 语法 Object.create(proto, [propertiesObject])
2. 参数
   - proto：新建对象的原型对象，必须
   - propertiesObject：可选，添加到新建对象的可枚举属性，没指定则为 undefined
   - 返回值：指定原型对象上添加新属性后的对象
3. Objcet.create() vs new Object()
   - new Object()通过构造函数创建对象，添加属性是在自身实例，Object.create()是继承对象，添加的属性是在原型上
     ![创建差异](./images/Object.create创建对象.jpg)
   - new Object()与 Object.create(null)区别
     ![空对象区别](./images/空对象区别.jpg)

#### 防抖与节流

##### 防抖 debounce

> 函数防抖是函数短时间内连续触发时，在规定时间内，函数只会执行一次

- 案例
  - 搜索框输入搜索，停顿时搜索
  - 拖拽
- 代码实现

##### 节流 throttle

> 函数节流是短时间内大量触发同一时间，在函数执行一次之后，在指定的时间内不再被执行，直到过了这段时间才重新生效

- 区别
  debounce 限制多长时间才能执行一次，throttle 限制多长时间必须执行一次，一个限制上限、一个限制下限
  与防抖相比，节流函数最主要的不同在于它保证在指定时间内至少执行一次函数。
- 案例
  - 页面滚动
  - 窗口调整
- 代码实现

[可视化工具](http://demo.nimius.net/debounce_throttle/)帮助理解

#### Vue 响应式原理

##### 数据响应式原理

- vue2.x 通过 Object.defineProperty()，将 data 中的数据转为 setter/geter，实现响应式，[代码地址]()

  ```js
  let data = {
    msg: 'hello',
    title: 'nihao',
  }
  // 模拟 vue 实例
  let vm = {}
  Object.keys(data).forEach((key) => {
    Object.defineProperty(vm, key, {
      enumrable: true,
      configurable: true,
      get() {
        console.log('getter', data[key])
        return data[key]
      },
      set(newVal) {
        console.log('setter', key, newVal)
        if (newVal === data[key]) return
        data[key] = newVal
      },
    })
  })
  vm.msg = 'hello world'
  console.log(vm.msg)
  ```

  ![2.x响应式实现原理](./images/2.x响应式实现原理.jpg)

- vue3.x 通过 Proxy 实现，直接监听对象

  ```js
  let data = {
    msg: 'hello',
    title: 'nihao',
  }
  let vm = new Proxy(data, {
    get(target, key) {
      console.log('getter', key, target[key])
      return target[key]
    },
    set(target, key, newVal) {
      console.log('setter', key, newVal)
      if (newVal === target[key]) return
      target[key] = newVal
    },
  })
  vm.title = 'hello world'
  console.log(vm.title)
  ```

  ![3.x响应式实现原理](./images/3.x响应式实现原理.jpg)

##### 发布订阅者模式

> vue 兄弟组件通信

```js
/*
  vue自定义事件
  this.$emit('change')
  this.$on('change', () => {
    console.log('change')
  })
 */

class EventEmitter {
  constructor() {
    this.subs = Object.create(null)
  }
  $on(eventType, handler) {
    this.subs[eventType] = this.subs[eventType] || []
    this.subs[eventType].push(handler)
  }
  $emit(eventType) {
    if (this.subs[eventType]) {
      this.subs[eventType].forEach((handler) => {
        handler()
      })
    }
  }
}

let em = new EventEmitter()
em.$on('change', () => {
  console.log('change event1')
})
em.$on('change', () => {
  console.log('change event2')
})
em.$emit('change')
```

![发布订阅者](./images/发布订阅者.jpg)

##### 观察者模式

> 观察者 watcher 和发布者 Dep 组成，事件发生时通过 notify 通知所有观察者

```js
// 观察者模式是由具体目标调度，比如当事件触发，Dep 就会去调用观察者的方法，所以观察者模式的订阅者与发布者之间是存在依赖的。
class Dep {
  constructor() {
    this.subs = []
  }
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  notify() {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}

class Watcher {
  update() {
    console.log('update')
  }
}

let dep = new Dep()
let watcher = new Watcher()
dep.addSub(watcher)
dep.notify()
```

![观察者模式](./images/观察者模式.jpg)

#### call、apply、bind 模拟实现

- 共同点：改变 this 指向，第一个参数都是 this 指向的对象
- 不同点
  - call 传参是单个传递，apply 传参是数组形式，bind 传值和传数组都可以
  - call 和 apply 函数执行是直接执行，而 bind 函数会返回一个函数，调用的时候才会执行

**注意**
箭头函数没有自己的 this，通过 call 或 apply 方法调用时，只能传递参数不能绑定 this，第一个参数会被忽略

##### 实现

```js
// 模拟实现call
Function.prototype._call = function (context, ...list) {
  context = context || window
  // 获取调用_call的函数，就是this
  context.fn = this

  let result = context.fn(...list)
  delete context.fn
  return result
}
const value = 'hello'
const foo = {
  value: 'nihao',
}

function bar(...list) {
  console.log(this.value)
  console.log(list)
}

bar._call(foo, 1, 2, 3)
bar._call(null, 4, 5, 6)

// 模拟实现apply
Function.prototype._apply = function (context, arr) {
  context = context || window
  context.fn = this

  let result = context.fn(...arr)
  delete context.fn
  return result
}

bar._apply(foo, [1, 2, 3])
bar._apply(null, [4, 5, 6])

// 模拟实现bind
Function.prototype._bind = function (context, ...arr1) {
  context = context || window
  context.fn = this

  return function (...arr2) {
    return context.fn(...arr1, arr2)
  }
}

bar._bind(foo, 1, 2)(3, 4)
bar._bind(null, 5, 6)(7, 8)
bar._bind(null)(5, 6, 7, 8)
```
