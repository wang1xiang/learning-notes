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
