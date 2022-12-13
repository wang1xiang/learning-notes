### 数据类型

#### js 基本类型？null 和 undefined 区别

- 基本类型：number、string、boolean、null、undefined、Symbol、bigInt、object

  - bigInt 表示任意大小的数字，即使这个数已经超出了 Number 能够表示的安全整数范围`Number.MAX_SAFE_INTEGER = 2**53-1`

  - Symbol 代表独一无二的值，用于定义对下对象的唯一属性名

  - Symbol 接收字符串作为参数，如果是对象则调用 toString 转为字符串

    ```js
    const symbol1 = Symbol(); // Symbol()
    const symbol2 = Symbol(23); // Symbol(23)
    console.log(Symbol("foo") === Symbol("foo")); // false
    ```

  - Symbol 不是构造函数，使用 new Symbol 会报错，是原始类型的值不是对象`Symbol is not a constructor`

  - 获取对象属性两种方式

    ```js
    Object.getOwnPropertySymbols(); // 返回只包含Symbol的属性名的数组
    Object.getOwnPropertyNames(); // 返回只包含字符串类型的属性名的数组
    ```

  - 对象 key 两种类型：字符串和 Symbol，Symbol 属性不会出现在 for...in、for...of、也不会被 Object.keys()和 Object.getOwnPropertyNames()、JSON.stringify()返回

- 分为原始数据类型和引用数据类型

  存储位置不同，Undefined、Nill、Boolean、Number、String、Symbol、BigInt 存储在栈中，占据空间小、大小固定
  Object 存储在堆中，占据空间大，而且大小不固定，存储在栈中影响程序运行，不过会在栈中存储引用类型的指针

- null 和 undefined 区别

  - 都分别只有一个值，null 和 undefined
  - undefined 代表未定义，null 代表空对象
  - `typeof null`返回 object
  - `null == undefined`但`null !== undefined`

#### 数据类型判断

- typeof

  判断基本类型、函数，但不能对 null、object、array 做精确判断

- instanceof

  判断引用类型数据，不能判断基本类型数据，原理是在其原型链上能否找到该类型的原型（xxx.prototype)

- Object.prototype.toString.call(obj)

  所有都可以判断，返回`[Object obj]`，如果直接使用 obj.toString()的话，像 array、function 等都重写了 Object 原型上的 toString 方法，toString 返回字符串，所以想要得到具体的类型需要调用 Object 上的 toString()方法

- 如何判断数组

  ```js
  Array.isArray(arr); // true
  Object.prototype.toString.call(arr); // [Object Array]
  arr instanceof Array; // true
  arr.__proto__ = Array.prototype; // true
  ```

#### 为什么 0.1 + 0.2 != 0.3

- js 做数字计算时转成二进制计算，0.1(0.00011001100...)和 0.2(0.00110011001100...)转二进制都是无限循环 1100，而根据 js 中双精度浮点数最大只能储存 53 位有效数字（小数最多 52 位），53 位之后的会被截掉，导致精度丢失
- 于是 0.1 和 0.2 二进制相加，转为十进制是 0.30000000000000004
- 使用 toFixed 四舍五入解决

  ```js
  (0.1 + 0.2).toFixed(1) = '0.3'
  ```

- 使用 ES6 的 Number.EPSILON 实际是 JS 能够表示的最小精度，误差小于这个值时可以认为不存在误差，只要判断`0.1+0.2-0.3`是否小于`Number.EPSILON`即可

#### 介绍 js 有哪些内置对象？

- `Object` 是 `JavaScript` 中所有对象的父对象
- 数据封装类对象：`Object`、`Array`、`Boolean`、`Number` 和 `String`
- 其他对象：`Function`、`Arguments`、`Math`、`Date`、`RegExp`、`Error`

#### 类数组对象的定义

类数组和数组类似，但不能调用数组的方法，常见的有 arguments 和 DOM 方法的返回结果

1. 通过 Array.from 方法进行转换
2. 通过 ES6 扩展运算符进行转换
3. 通过 call、apply 调用数组的 slice、splice 或 concat 方法进行转换

   ```js
   Array.prototype.slice.call(arrayLike);
   Array.prototype.splice.call(arrayLike, 0);
   Array.prototype.concat.apply([], arrayLike);
   ```

### ES6

#### let、const、var 区别

- 块级作用域：var 不存在块级作用域{ }，块级作用域解决 ES5 中的两个问题

  1. 内部变量覆盖外部变量
  2. 用来计数的循环变量泄漏为全局变量

- 变量提升：var 存在变量提升，可在声明之前使用，而 let 和 const 不行
- 重复声明：在块作用域中 var 定义的变量可以重复声明，会声明的同名变量会覆盖前面的，而 let 和 const 不允许
- 暂时性死区：在声明 let 和 const 变量之前，该变量是不可用的，称为暂时性死区，而 var 不会存在暂时性死区
- 初始值设置：var 和 let 可以不设置初始值，但 const 必须设置初始值
- 特殊：const 声明的引用变量可以修改，因为指向的是内存地址

#### 箭头函数和普通函数的区别

- 箭头函数更加简洁，如果只有一个参数，可以省去括号，如果函数体返回值只有一句，可以省略大括号
- 箭头函数没有 this，函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象
- 不可以当作构造函数，也就是说，不可以使用 new 命令，否则会抛出一个错误`xxx is not a constructor`
- 不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 Rest 参数代替
- 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数
- call、apply、bind 不能改变箭头函数的 this 指向

#### 模板字符串

- 空格、缩进、换行都会被保留，可以直接写 html 代码

#### 如何使用 for...of 遍历对象

- Iterator：迭代器，为不同的数据结构提供一个统一的访问机制，使得数据结构的成员能够按某种次序排列，并逐个被访问
- Iterator 规范：包含一个 next 方法，调用时返回布尔值 done（代表是否遍历结束）和 value（值）

for...of 允许遍历一个含有 Iterator 接口的数据结构(Map Set Array)，并返回各项的值，对象使用 for...of 是会报错的（a is not iterable）

此时需要给对象添加一个[Symbol.iterator]属性，并指向一个迭代器即可

[代码在这](https://github.com/wang1xiang/learning-notes/blob/master/%E9%9D%A2%E8%AF%95%E7%9B%B8%E5%85%B3/js/obj-forof.js)

#### JS 严格模式

use strict 使得 js 代码在更严格的条件下运行，使 js 编码更加规化，消除 js 语法的一些不合理、不严谨之处，减少一些怪异行为

- 变量必须声明在使用
- 函数的参数不能有同名属性，否则报错
- 不能使用 with 语句
- 禁止 this 指向全局对象

#### 事件冒泡和事件捕获

一个事件触发时会进行事件流，而事件流有两个阶段：1、从外到里为捕获阶段；2、从里到外为冒泡阶段

- 阻止冒泡

  ```js
  e.stopPropagation();
  e.cancelBubble(); // IE
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

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(() => {
    console.log(i);
  }, i * 1000);
}
// 这样会输出5个6，因为setTimeout是宏任务，等循环执行结束时，i已经是6了，所以会输出5个6

// 解决方法一 使用闭包
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(() => {
      console.log(j);
    }, j * 1000);
  })(i);
}
// 解决方法二 使用let定义i，创建块作用域
// 在循环中比较适合绑定块级作用域，这样就可以把声明的计数器变量限制在循环内部
for (let i = 1; i <= 5; i++) {
  setTimeout(() => {
    console.log(i);
  }, i * 1000);
}
```

### 原型和原型链

#### 原型

JavaScript 中是使用构造函数来新建对象的，每个构建函数的内部都有一个 prototype 属性，包含了该构造函数的属性和方法，当使用构造函数创建一个对象后，对象的内部将包含一个指针指向构造函数的 prototype 对象”继承“属性，这个指针称为对象的原型

可以使用**proto**属性或 Object.getPrototypeOf()方法获取当前对象的原型

```js
let a = { a: 2 };
a.__proto__; // { construcrot: Object. hasO... }
a.__proto__ === Object.prototype; // true
a.constructor.prototype === Object.prototype; // true
a.__proto__ === Object.getPrototypeOf(a); // true
```

#### 原型链

当查找对象属性时，先查找对象本身是否有此属性，如果不存在会在原型对象上查找，这个原型又有自己的原型对象，于是就形成了一条原型链。

#### 原型链的终点

原型链的尽头一般是 Object.prototype，所有的对象都是由 Object 构造的，而 Object.prototype 的下一级是 Object.prototype.**proto**，所以原型链的终点是 null

```js
Object.prototype.__proto__; // null
```

#### 如何获得对象非原型链上的属性

使用`hasOwnProperty()`方法来判断属性是否属于原型链的属性

```js
if (obj.hasOwnProperty(key)) {
  return obj[key];
}
```

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
      fn = document;
    }
    var oldonload = window.onload;
    if (typeof window.onload != "function") {
      window.onload = fn;
    } else {
      window.onload = function () {
        oldonload();
        fn();
      };
    }
  },
  // 视能力分别使用dom0||dom2||IE方式 来绑定事件
  // 参数： 操作的元素,事件名称 ,事件处理程序
  addEvent: function (element, type, handler) {
    if (element.addEventListener) {
      //事件类型、需要执行的函数、是否捕捉
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, function () {
        handler.call(element);
      });
    } else {
      element["on" + type] = handler;
    }
  },
  // 移除事件
  removeEvent: function (element, type, handler) {
    if (element.removeEnentListener) {
      element.removeEnentListener(type, handler, false);
    } else if (element.datachEvent) {
      element.detachEvent("on" + type, handler);
    } else {
      element["on" + type] = null;
    }
  },
  // 阻止事件 (主要是事件冒泡，因为IE不支持事件捕获)
  stopPropagation: function (ev) {
    if (ev.stopPropagation) {
      ev.stopPropagation();
    } else {
      ev.cancelBubble = true;
    }
  },
  // 取消事件的默认行为
  preventDefault: function (event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },
  // 获取事件目标
  getTarget: function (event) {
    return event.target || event.srcElement;
  },
  // 获取event对象的引用，取到事件的所有信息，确保随时能使用event；
  getEvent: function (e) {
    var ev = e || window.event;
    if (!ev) {
      var c = this.getEvent.caller;
      while (c) {
        ev = c.arguments[0];
        if (ev && Event == ev.constructor) {
          break;
        }
        c = c.caller;
      }
    }
    return ev;
  },
};
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

- script

  如果没有 async 和 defer 属性，浏览器会立即加载并执行脚本，阻塞 HTML 解析，下载并执行完脚本会才会继续解析 HTML

- script 标签的 async 属性

  解析 HTML 的同时进行脚本的异步下载，下载完成立马执行，可能会阻断 HTML 的解析

- script 的 defer 属性

  解析 HTML 同时进行脚本的异步下载，等 HTML 解析完成后（DomContentLoaded 事件执行之前）再按照顺序执行脚本

- onload 时的异步加载

  创建 script 标签，插入到 DOM 中，加载完毕后 callback

- 区别

  - async 属性不能保证脚本加载执行的顺序、defer 可以保证按照顺序执行

#### AMD 和 DommonJS 的理解

- CommonJS 是服务端模块规范，Node 采用这种规范，它加载模块是同步的，就是说只有加载完成才会执行后面的操作。AMD 规范则是异步加载模块，允许指定回调函数
- AMD 推荐风格通过返回一个对象作为模块对象，而 CommonJs 风格通过对 module.exports 或 export 是的属性赋值来达到暴露模块对象的目的

#### indexOf 和 includes

- indexOf 不够语义化，含义是找到对应值第一次出现的位置，要去比较是否不等于-1，表达起来不直观；而且内部时使用严格相等运算符（===）进行判断，会导致 NaN 误判

```js
[NaN].indexOf(NaN) - (1)[NaN].includes(NaN);
true;
```

#### Promise 防止某一个 promise 失败而导致整个 promise 失败

- 使用 Promise.allSettled
  Promise.allSettled 是对 Promise.all 的一种补充，缓解了 Promise.all 碰到 reject 的痛点问题

  ```js
  const delay = (n) => new Promise((resolve) => setTimeout(resolve, n));

  const promises = [delay(100).then(() => 1), delay(200).then(() => 2)];

  Promise.all(promises).then((values) => console.log(values));
  ```

- 每个 promise 捕获异常

#### async/await 捕获异常

```js
// 抽离成公共方法
const awaitWrap = (promise) => {
  return promise.then((data) => [null, data]).catch((err) => [err, null]);
};
const [err, data] = await awaitWrap(fetchData());
console.log("err", err);
console.log("data", data);
```

#### const 可以不给值吗

不可以，const 一旦声明变量，就必须立即初始化，不能留到以后赋值。
必须在声明的同一语句中指定它的值（这是有道理的，因为以后不能更改）
