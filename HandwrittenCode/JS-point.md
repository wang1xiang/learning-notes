#### js 基本类型？null 和 undefined 区别

- 基本类型：number、string、boolean、null、undefined、Symbol

  - Symbol 代表独一无二的值，用于定义对下对象的唯一属性名

  - Symbol 接收字符串作为参数，如果是对象则调用 toString 转为字符串

    ```js
    const symbol1 = Symbol() // Symbol()
    const symbol2 = Symbol(23) // Symbol(23)
    console.log(Symbol('foo') === Symbol('foo')) // false
    ```

  - Symbol 不是构造函数，使用 new Symbol 会报错，是原始类型的值不是对象`Symbol is not a constructor`

  - 获取对象属性两种方式

    ```js
    Object.getOwnPropertySymbols() // 返回只包含Symbol的属性名的数组
    Object.getOwnPropertyNames() // 返回只包含字符串类型的属性名的数组
    ```

  - 对象 key 两种类型：字符串和 Symbol，Symbol 属性不会出现在 for...in、for...of、也不会被 Object.keys()和 Object.getOwnPropertyNames()、JSON.stringify()返回

- 引用类型：object、Array

#### 介绍 js 有哪些内置对象？

- `Object` 是 `JavaScript` 中所有对象的父对象
- 数据封装类对象：`Object`、`Array`、`Boolean`、`Number` 和 `String`
- 其他对象：`Function`、`Arguments`、`Math`、`Date`、`RegExp`、`Error`

#### 渐进增强和优雅降级

- 渐进增强：针对低版本浏览器进行构建页面，保证最基本的功能，然后在针对高级浏览器进行效果、交互等改进达到更好的用户体验
- 优雅降级：一开始构建完成的功能，然后针对低版本浏览器进行兼容

#### JS 严格模式

use strict 使得 js 代码在更严格的条件下运行，使 js 编码更加规化，消除 js 语法的一些不合理、不严谨之处，减少一些怪异行为

- 变量必须声明在使用
- 函数的参数不能有同名属性，否则报错‘
- 不能使用 with 语句
- 禁止 this 指向全局对象

#### 事件冒泡和事件捕获

一个事件触发时会进行事件流，而事件流有两个阶段：1、从外到里为捕获阶段；2、从里到外为冒泡阶段

- 阻止冒泡

  ```js
  e.stopPropagation()
  e.cancelBubble() // IE
  ```

#### 事件委托

将原本绑定在子元素的事件委托给父元素，原理就是 DOM 元素的事件冒泡，使用事件代理的好处是提高性能

可以节省内存占用，减少事件注册

实现新增子元素是无需再次对其绑定

#### eval 是做什么的

- 它的功能是把对应的字符串解析成`JS`代码并运行
- 应该避免使用`eval`，不安全，非常耗性能（`2`次，一次解析成`js`语句，一次执行）
- 由`JSON`字符串转换为 JSON 对象的时候可以用`eval，var obj =eval('('+ str +')')`

#### 闭包的理解

有权访问其他函数作用域内变量的函数，定义在函数内的函数，可以访问当前函数定义的变量，而定义在函数外的函数，就无法访问函数内部的变量

由于在 js 内变量的作用域属于函数作用域，当函数执行完后作用域就被清理、内存也随之被回收，但由于闭包是建立在一个函数内部的子函数，由于其可访问上级作用域原因，即使上级函数执行完，作用域也不会随之销毁

使用场景：setTimeout、回调、函数防抖、实现封装（私有变量提供闭包访问）和缓存（设置变量，存储闭包函数执行结果）

#### 原型链

由于`__proto__`是任何对象都有的属性，所以形成一条`__proto__`连接起来的链条，当查找对象属性时，先查找对象本身是否有此属性，如果不存在会在原型链上查找

prototype 时函数才有的属性

`__proto__`是每个对象都有的属性

`instance.constructor.prototype === instance.__proto__`

#### this 理解

- `this`总是指向函数的直接调用者（而非间接调用者）
- 如果有`new`关键字，`this`指向`new`出来的那个对象
- 在事件中，`this`指向触发这个事件的对象，特殊的是，`IE`中的`attachEvent`中的`this`总是指向全局对象`Window`

#### 说一下什么是栈、什么是堆、什么是队列

- 基本类型保存在占内存中的简单数据段，都有固定的大小，占用的内存控件大小是确定的，并由系统自动分配和自动释放
- 引用类型是保存在堆中的对象，值大小不固定，栈内存中存放的是该对象的访问地址指向堆内存中的对象
- 队列，在队列头部进行删除操作，在队列末端进行插入操作
- 栈是先进后出，队列是先进先出

#### 深浅拷贝

#### JavaScript 继承

#### new 操作符具体干了什么呢?

#### 防抖节流代码实现

#### 类型检测

#### 数组去重

#### 数组扁平化处理

以上 7 个知识点[js 手写代码题](https://www.jianshu.com/p/13362cb6591f)

#### 通用事件监听函数

```js
// event(事件)工具集
markyun.Event = {
  // 页面加载完成后
  readyEvent: function (fn) {
    if (fn == null) {
      fn = document
    }
    var oldonload = window.onload
    if (typeof window.onload != 'function') {
      window.onload = fn
    } else {
      window.onload = function () {
        oldonload()
        fn()
      }
    }
  },
  // 视能力分别使用dom0||dom2||IE方式 来绑定事件
  // 参数： 操作的元素,事件名称 ,事件处理程序
  addEvent: function (element, type, handler) {
    if (element.addEventListener) {
      //事件类型、需要执行的函数、是否捕捉
      element.addEventListener(type, handler, false)
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, function () {
        handler.call(element)
      })
    } else {
      element['on' + type] = handler
    }
  },
  // 移除事件
  removeEvent: function (element, type, handler) {
    if (element.removeEnentListener) {
      element.removeEnentListener(type, handler, false)
    } else if (element.datachEvent) {
      element.detachEvent('on' + type, handler)
    } else {
      element['on' + type] = null
    }
  },
  // 阻止事件 (主要是事件冒泡，因为IE不支持事件捕获)
  stopPropagation: function (ev) {
    if (ev.stopPropagation) {
      ev.stopPropagation()
    } else {
      ev.cancelBubble = true
    }
  },
  // 取消事件的默认行为
  preventDefault: function (event) {
    if (event.preventDefault) {
      event.preventDefault()
    } else {
      event.returnValue = false
    }
  },
  // 获取事件目标
  getTarget: function (event) {
    return event.target || event.srcElement
  },
  // 获取event对象的引用，取到事件的所有信息，确保随时能使用event；
  getEvent: function (e) {
    var ev = e || window.event
    if (!ev) {
      var c = this.getEvent.caller
      while (c) {
        ev = c.arguments[0]
        if (ev && Event == ev.constructor) {
          break
        }
        c = c.caller
      }
    }
    return ev
  },
}
```

#### 跨域问题处理

- Jsonp
  最早的解决方案，利用 script、img 和 link 标签可以跨域的原理实现（src 是链接时浏览器会请求链接获取资源，即使是跨域的也会请求） -- 只能发起 get 请求

- nginx 反向代理
  利用 nginx 反向代理，将前端访问域名和后端服务器域名映射到同源的地址下
  缺点是需要在 nginx 进行额外配置

- window.postMessage

- CORS
  规范话的跨域请求解决方案，安全可靠
  在服务端进行控制是否允许跨域，可自定义规则
  支持各种请求方式

- cors（Cross-origin resource sharing）跨域资源共享
  允许浏览器向跨域服务器发送 XMLHttpRequest 请求，克服只能同源使用的限制
  需要浏览器和服务器同时支持，浏览器都支持该功能（IE10 以上）

  分为简单请求和复杂请求

  服务端配置
  SpringMVC 已经写好 CORS 的跨域过滤器：CORSFilter

  ```java
  @Configuration
  public class GlobalCorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        //1.添加CORS配置信息
        CorsConfiguration config = new CorsConfiguration();
        //1) 允许的域,不要写*，否则cookie就无法使用了
        config.addAllowedOrigin("http://manage.leyou.com");
        //2) 是否发送Cookie信息
        config.setAllowCredentials(true);
        //3) 允许的请求方式
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("HEAD");
        config.addAllowedMethod("GET");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("PATCH");
        // 4）允许的头信息
        config.addAllowedHeader("*");

        //2.添加映射路径，我们拦截一切请求
        UrlBasedCorsConfigurationSource configSource = new UrlBasedCorsConfigurationSource();
        configSource.registerCorsConfiguration("/**", config);

        //3.返回新的CorsFilter.
        return new CorsFilter(configSource);
    }
  }
  ```

#### 异步加载 JS 的方式有哪些？

- script 标签的 async 属性

  HTML5 新增异步支持，执行完之前会阻止 onload 事件的触发，

- script 的 defer 属性

  规定是否对脚本执行进行延迟，直到页面加载为止：只支持 IE

- onload 时的异步加载

  创建 script 标签，插入到 DOM 中，加载完毕后 callback

#### AMD 和 DommonJS 的理解

- CommonJS 是服务端模块规范，Node 采用这种规范，它加载模块是同步的，就是说只有加载完成才会执行后面的操作。AMD 规范则是异步加载模块，允许指定回调函数
- AMD 推荐风格通过返回一个对象作为模块对象，而 CommonJs 风格通过对 module.exports 或 export 是的属性赋值来达到暴露模块对象的目的

#### 箭头函数和普通函数的区别

- 函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象
- 不可以当作构造函数，也就是说，不可以使用 new 命令，否则会抛出一个错误
- 不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 Rest 参数代替
- 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数

#### Promise 防止某一个 promise 失败而导致整个 promise 失败

- 使用 Promise.allSettled
  Promise.allSettled 是对 Promise.all 的一种补充，缓解了 Promise.all 碰到 reject 的痛点问题

  ```js
  const delay = (n) => new Promise((resolve) => setTimeout(resolve, n))

  const promises = [delay(100).then(() => 1), delay(200).then(() => 2)]

  Promise.all(promises).then((values) => console.log(values))
  ```

- 每个 promise 捕获异常

#### async/await 捕获异常

```js
// 抽离成公共方法
const awaitWrap = (promise) => {
  return promise.then((data) => [null, data]).catch((err) => [err, null])
}
const [err, data] = await awaitWrap(fetchData())
console.log('err', err)
console.log('data', data)
```

#### const 可以不给值吗

不可以，const 一旦声明变量，就必须立即初始化，不能留到以后赋值。
必须在声明的同一语句中指定它的值（这是有道理的，因为以后不能更改）
