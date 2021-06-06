#### 作用域是什么

编程语言基本功能：能够储存变量中的值，并在之后对其进行访问或修改

设计一套规则来存储变量，并在之后方便找到，这个规则就是作用域

##### 1.1 编译原理

传统编译语言，源代码执行后经历三个步骤，成为编译

- 分词/词法解析

  将字符串分解成有意义的代码块（词法单元）

- 解析/语法解析

  将词法单元流转换成由元素逐级嵌套所组成的代表程序语法结构的树（抽象语法树）

- 代码生成

  将`AST`转换成可执行代码，与语言、目标平台相关

简单说就是某种方法可以将var a = 2；的`AST`转换为一组机器指令，用来创建一个a的变量（包括分配内存等），并一个值储存在a中

JavaScript引擎更加复杂，在语法解析和代码生成阶段有特定步骤对运行性能进行优化

任何`js`代码片段在执行前都要进行编译（执行前的几微秒），并且通常会立即执行

##### 1.2 理解作用域

- 引擎：负责整个JavaScript程序的编译和执行结果
- 编译器：负责语法解析及代码生成等
- 作用域：负责收集并维护由所有声明的标识符（常量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限

###### 将`var a = 2;`分解

编译器首先将程序分解为词法单元，再将词法单元解析为一个树结构

赋值操作两个动作：编译器声明变量，运行时引擎查找变量

1. 遇到var a，编译器在作用域中查找该变量是否存在，存在编译，不存在声明
2. 为引擎生成运行时所需代码，处理a=2这个赋值操作；在当前作用域中查找此变量，找不到继续往上找

引擎最终找到a变量，并将2赋值给a

###### `LHS`引用和`RHS`引用

`LHS`和`RHS`含义是：赋值操作的左侧和右侧，更好的理解是：赋值操作的目标是谁，谁是赋值操作的源头

`RHS(retrieve his source value)`查找某个变量的值，获取，`LHS`试图找到变量的容器本身，对变量进行赋值

```js
function foo(a) {
	var b = a
	return a + b
}
var c = foo(2)
// LHS 1.c = .. 2.隐式变量赋值a=2 3.b=...
// RHS 1.foo(2) 2. = a 3.a+.. 4. ...+b
```

##### 1.3 作用域嵌套

在当前域中无法找到变量时，引擎会继续项外层嵌套的作用域中去查找

##### 1.4 异常

区分`LHS`和`RHS`作用，在变量未声明前，查询行为不一样

`RHS`引用找不到变量时，引擎会抛出`ReferenceError`,`LHS`引用找不到变量时，会在全局作用域创建，在严格模式下，也会抛出`ReferenceError`异常

#### 词法作用域

作用域工作模式：1 词法作用域；2 动态作用域（Bash脚本、Perl中的一些模式）

##### 2.1 词法阶段

词法作用域就是定义在词法化阶段的作用域，也就是写代码时将变量和块作用域写在哪里决定的

```js
function foo(a) {
	var b = a
    function bar (c) {
		return c
    }
    bar (b * 2)
}
foo(2)
```

包含三个逐级嵌套作用域

###### 查找

作用域查找找到第一个匹配的标识符停止，多层嵌套作用域可定义同名标识符，称为“遮蔽效应”，全局变量会自动成为全局对象的属性，可以间接通过对全局对象属性的引用访问

##### 2.2 欺骗词法

欺骗词法作用域会导致性能下降

###### 2.2.1 `eval`

`eval(...)`接收一个字符串为参数，在执行`eval`之后的代码时，引擎并不知道前面的代码是以动态形式插入，并对词法作用域的环境进行修改的

```js
function foo (str, a){
    eval(str)
    console.log(a, b)
}
var b = 2
foo("var b = 3", 1) // 1 3
```

`eval`对`foo`的词法作用域做了修改，在`foo`内部创建`b`，遮蔽外部作用域同名变量

严格模式中，`eval`在运行时有其自己的词法作用域，无法修改所在作用域

###### 2.2.2 with(不推荐使用)

`with`声明实际上根据传递给它的对象凭空创建一个全新的词法作用域

###### 2.2.3 性能

JavaScript引擎在编译阶段进行数项的性能优化，有些优化依赖于能够根据代码的词法进行静态分析，并预先确定所有变量和函数的定义位置，才能在执行过程中快速找到标识符

引擎无法在编译时对作用域查找并优化，引擎只能谨慎认为优化是无效的

```js
function func() {
	console.time("func");
	var obj = {
		a: [1, 2, 3]
	};
	for(var i = 0; i < 100000; i++)
	{
		var v = obj.a[0];
	}
	console.timeEnd("func");
}
func();

function funcWith() {
	console.time("funcWith");
	var obj = {
		a: [1, 2, 3]
	};
	with(obj) {
		for(var i = 0; i < 100000; i++) {
			var v = a[0];
		}
	}
	console.timeEnd("funcWith");
}
funcWith(); 
// 使用with代码运行速度变慢
// func: 1.23424224ms
// funcWith: 48.23424224ms
```

#### 函数作用域和块作用域

##### 3.1 函数中的作用域

每声明一个函数都会为其自身创建作用域

函数作用域是指：属于这个函数的全部变量可以在整个函数的范围内使用

##### 3.2 函数内部实现

将变量和函数包裹到一个函数的作用域中，用这个作用域来“隐藏”它们

###### 规避冲突

1. 全局命名空间

   程序加载多个第三方库，如果没有妥善隐藏私有变量或函数，就会引发冲突

   这些库会在全局作用域声明足够独特的变量，被用作库的命名空间

2. 模块管理

   通过依赖管理器机制将库的标识符显示导入到另一个特定的作用域

##### 3.3 函数作用域

如果函数不需要函数名（或者至少函数名可以不污染所在作用域），并且会自动执行，这将会更理想

```js
var a = 2
(function foo() {
	var a = 3
    console.log(a) // 3
})()
console.log(a) // 2
```

包装函数以`(function...`开头，会被当做函数表达式而不是一个标准的函数声明来处理

`(function foo(){...})`作为函数表达式意味着`foo`只能在...所代表的位置中被访问，外部作用域不行；不会污染外部作用域

###### 3.3.1 匿名和具名

函数表达式可以是匿名的，但函数声明不行

```js
setTimeout(function () {
	console.log('sss')
}, 1000)
```

很多库和工具都倾向于这种风格，但是缺点很明显

1. 在栈追踪中不会显示有意义的函数名，调试困难

2. 自身引用，只能通过`arguments.callee`引用（`arguments.callee` 在哪一个函数中运行，它就代表哪一个函数）

   ```js
   (function(n){
   	if(n > 1) return n* arguments.callee(n-1);
   	return n;
   })(10);
   ```

   

3. 省略了代码可读性/可理解性

###### 3.3.2 立即执行函数表达式(`IIFE Immediately Invoked Function Expression`)

`(function foo(){...})()`，第一个()将函数变为表达式，第二个()执行这个函数

- `IIFE`进阶用法将它们当做函数调用并传递参数进去

```js
var a = 2
(function foo(global) {
    var a = 3
    console.log(a) // 3
    console.log(global.a) // 2
})(window)
console.log(a) // 2
```

- 另一种用法倒置代码的运行顺序，将需要运行的函数放在第二位，在`IIFE`执行之后当做参数传递出去

```js
var a = 2
(function foo(def) {
	def(window)
})(function def(global) {
	var a = 3
    console.log(a) // 3
    console.log(global.a) // 2
})
```

##### 3.4 块作用域

```js
for (var a = 2; a < 10; a++) {
	console.log(a)
}
```

此时的a已被绑定到外部作用域中

块作用域：变量的声明距离使用的地方越近越好

```js
var foo = true
if (foo) {
	var bar = foo * 2
    console.log(bar)
}
```

当使用var时，最终都会属于外部作用域；这段代码只是伪装出形式上的块作用域

###### 3.4.1 with

块作用域，用with从对象中创建出的作用域仅在with声明中而非外部作用域有效

###### 3.4.2 try/catch

catch会创建一个块作用域

多个catch用同样的标识符声明错误变量时，静态检查工具还是会发出警告

###### 3.4.3 let

let为其声明的变量隐式地劫持了所在的块作用域

let进行声明的变量不会在块作用域中进行提升，声明的代码被运行之前，声明并不存在

1. 垃圾收集

   ```js
   //(function(){
   	function process(data) {}
       var someData = {...}
       // 执行后 someData变量可以被垃圾回收了 click函数的点击回调不需要此变量                
       process(someData)
       // 由于click函数形成一个覆盖整个作用域闭包 JavaScript引擎可能依然保存这个变量
       var btn = document.getElementById('my_buttn')
       btn.addEventListener('click', function click(evt) {
           console.log('clicked')
       })
   // })()
   ```

   此处的代码应该在某个函数中，点击click函数可能会调用外层函数作用域中的变量，所以形成了闭包，导致可能不会回收

   ```js
   // 使用块作用域解决
   {
   	let someData = {...}
   	process(someData)
   }
   ```

2. let循环

   ```js
   for (let i = 0; i < 10; i++) {
   	console.log(i)
   }
   console.log(i) // ReferenceError
   ```

   i绑定在let循环的块中,事实上将其重新绑定在循环的每一个迭代中

`ES6`同样引入了`const`创建块作用域变量

#### 提升

##### 4.1 先有鸡还是先有蛋

代码执行自上而下?

```js
a = 2
var a;
console.log(a) // 2
```

```js
console.log(a) // undefined
var a = 2 
```

所以,到底是声明(蛋)在前,还是赋值(鸡)在前?

##### 4.2 编译器解释

第一章有说明:引擎会在解释JavaScript代码前首先对其编译,编译阶段一部分工作就是找到所有的声明,并用合适的作用域将它们关联起来(词法作用域)

理解:包括变量和函数的所有声明都会在任何代码执行前首先被处理

```js
// 第一个片段
var a; // 定义声明(编译阶段执行)
a = 2; // 赋值声明(等待执行阶段)
console.log(a)
// 第二个片段
var a;
console.log(a);
a = 2;
```

这个过程就是提升,变量和函数声明从代码中出现的位置被移动到"最上面"(先有蛋后有鸡)

注意:函数声明可以被提升,但是函数表达式不会被提升

```js
bar() // TypeError
foo() // ReferenceError

var foo = function bar() {}
```

##### 4.3 函数优先

函数首先被提升,然后是变量

```js
foo() // 1
var foo
function foo () {
	console.log(1)
}
foo = function() {
	console.log(2)
}
```

##### 4.4 小结

我们习惯将`var a = 2`看作一个声明,JavaScript引擎并不这么认为,它将var a和a = 2当做两个单独的声明,第一个是编译阶段的任务,第二个是执行阶段的任务

#### 作用域闭包

JavaScript中闭包无处不在，你只需要能够识别并拥抱它

##### 5.1 实质问题

当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行

```js
function foo () {
	var  a = 2
	function bar() {
		console.log(a)
    }
    return bar
}
var baz = foo()
baz() // 2 bar在自己定义的词法作用域以外的地方执行
```

`foo()`执行完，垃圾回收机制就准备回收，而闭包会阻止回收。事实上内部作用域依然存在，因此没有被回收

`bar()`拥有涵盖`foo()`内部作用域的闭包，使得该作用域一直存在，以供`bar()`在之后任何时间进行引用，`bar()`依然持有对该作用域的引用，这个引用就是闭包

只要将内部函数传递到所在的词法作用域以外，它都会持有对原始定义作用域的引用，无论在何处执行这个函数都会使用闭包

##### 5.2 理解

```js
function wait (msg) {
	setTimeout(function timer() {
		console.log(msg)
    }, 1000) // 1s后，timer函数依然保有wait()作用域的闭包
}
wait('hello')
```

如果将(访问它们各自词法作用域的)函数当做第一级的值类型并导出传递，就会看到闭包在这些函数中的应用。定时器、事件监听器、Ajax请求、跨窗口通信或者任何其他的异步任务中，只要使用了回调函数，实际上都是使用闭包

##### 5.3 循环和闭包

```js
for (var i = 1; i <= 5; i++) {
	setTimeout(function timer() {
		console.log(i)
    }, i * 1000)
} // 每秒一次的频率输出6
```

延迟函数的回调是在循环结束后才执行

循环过程中每个迭代都需要一个闭包作用域，`IIFE`会通过声明并立即执行一个函数来创建作用域

```js
for (var i = 0; i <= 5; i++) {
	(function(j) {
        setTimeout(function timer(){
			console.log(j)
		}, j * 1000)
	})(i)
}
```

在迭代内使用`IFEE`为每个迭代生成一个新的作用域，使得延迟函数的回调可以将新的作用域封闭在每个迭代内部。

###### 重返作用域块

每个迭代都需要一个块作用域

```js
for (let i = 0; i <= 5; i++) {
	setTimeout(function timer() {
		console.log(i)
    }, i * 1000)
}
```

for循环头部的let声明有一个特殊的行为：变量在循环过程中不止被声明一次，每次迭代都会声明

##### 5.4 模块

和回调无关的闭包

```js
function fooModule () {
	var something = 'cool'
    var another = [1, 2, 3]
    
    function doSomething() {
		console.log(something)
    }
    function doAnother () {
		console.log(another.join(' | '))
    }
    
    return {
        doSomething,
        doAntnother
    }
}
var foo = fooModule()
foo.doSomething() // 如果不执行外部函数 内部作用域和闭包都无法被创建
foo.doAntnother()
```

通过调用`foolModule`，是的`doSomething()`和`doAntnother()`都具有涵盖模块内部作用域的闭包

模块模式两个必要条件：

1. 必须有外部的封闭函数，该函数至少被调用一次
2. 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有的状态

当只需要一个实例时，通过`IIFE`改进为单例模式

```js
var foo = (function fooModule () {
    var something = 'cool'
    var another = [1, 2, 3]
    
    function doSomething() {
		console.log(something)
    }
    function doAnother () {
		console.log(another.join(' | '))
    }
    
    return {
        doSomething,
        doAntnother
    }
})()
```

###### 5.4.1 现代的模块机制

大多数模块依赖加载器/管理器本质上都是将这种模块定义封装进一个友好的`API`

```js
var Modules = (function Manager() {
	var modules = {}
    
    function define (name, deps, impl) {
		for (var i = 0; i < deps.length; i++) {
			deps[i] = modules[deps[i]]
        }
        modules[name] = impl.apply(impl, deps) // 包装函数 可以传入任何依赖 并且将返回值也就是模块API储存在模块列表中
	}
    
    function get (name) {
		return modules[name]
    }
    
    return {
		define, name
    }
})()
```

```js
Modules.define('foo', [], function (){
	var hungry = 'hippo'
    function awesome() {
		console.log( hungry.toUpperCase())
    }
    
    return {
		awesome
    }
})

var bar = Modules.get('foo')
bar.awesome() // HIPPO
```

调用包装了函数定义的包装函数，并且将返回值作为该模块的`API`

##### 5.5.2 未来的模块机制

`ES6`模块定义在独立的文件中，使用`module foo from 'foo'`导入模块，将整个模块的`API`导入并绑定到变量上

或者使用`import hello from 'foo'`将模块中的一个或多个`API`导入到当前作作用域

#### 附录

##### 动态作用域

动态作用域并不关心函数和作用域是如何声明以及在何处声明的，只关心它们从何处调用。即：作用域链是基于调用栈的，而不是代码中的作用域嵌套

```js
function foo () {
	console.log(a) // 3
}

function bar () {
	var a = 3
	foo()
}
var a = 2
bar()
```

区别：词法作用域是写代码或定义时确定，动态作用域是在运行时确定；词法作用域关注函数在何处声明，而动态作用域关注函数从何处调用

##### this词法

```js
var obj = {
	id: 'awesome',
    cool: function collFn () {
		console.log(this.id)
    }
}
var id = 'not awesome'
obj.cool() // awesome
setTimeout(obj.cool, 100) // not awesome cool()函数丢失了同this之间的绑定
```

```js
var obj = {
	id: 'awesome',
    cool: function collFn () {
        var self = this // self通过词法作用域和闭包进行引用的标识符
	    setTimeout(function timer(){
			console.log(self.id) // awesome
		}, 100)         
    }
}
obj.cool() // awesome
```

```js
var obj = {
	id: 'awesome',
    cool: function collFn () {
	    setTimeout(() => { // 箭头函数放弃所有普通this绑定的规则 用当前的词法作用域覆盖了this本来的值
			console.log(self.id) // awesome
		}, 100)         
    }
}
obj.cool() // awesome
```

#### 关于this

##### 6.1 为什么要用this

```js
function identify() {
	return this.name.toUpperCase()
}
var me = { name: 'me' }
var you = { name: 'you' }

identify.call(me) // me
identify.call(you) // you
// 如果不适用this 需要给identify函数显示传入上下文对象
// 显示传递上下文对象会让代码变得越来越混乱
function identify(context) {
	return context.name.toUpperCase()
}
var me = { name: 'me' }
var you = { name: 'you' }

identify(me) // me
identify(you) // you
```

`this`提供一种更优雅的方式来隐式“传递”一个对象引用，因此可以将`API`设计的更加简洁并且易于复用

##### 6.2 误解

###### 6.2.1 指向自身

指向函数本身

```js
function foo(num) {
	console.log('foo:' + num)
    this.count++
}
foo.count = 0
var i;
for (i = 0; i < 10; i++) {
    if (i > 5) foo(i)
}
// foo:6
// foo:7
// foo:8
// foo:9
console.log(foo.count) //0
```

`foo.count = 0`确实为对象`foo`添加了属性count，但是函数内部代码`this.count`并不是指向函数对象，所以虽然属性名相同，根对象却并不相同

实际上创建了全局变量`count`，值是`NaN`

要从函数内部使用它自身，只使用this是不够的

```js
function foo () {
	foo.count = 4 // foo指向它自身
}
setTimeout(function () {
    // 匿名函数无法指向自身
}, 10)
```

所以上面的例子可以使用`foo.count++`

另一种方法是强制this指向`foo`函数对象

```js
for (i = 0; i < 10; i++) {
    if (i > 5) foo.call(foo, i) // 使用call可以确保this指向函数对象foo本身
}
```

###### 6.2.2 指向它的作用域

this在任何情况下都不指向函数的词法作用域，一般看来作用域确实和对象类似，可见的标识符都是它的属性。但是作用域“对象”无法通过JavaScript代码访问，它存在于引擎内部

```js
function foo() {
	var a = 2
    this.bar() // 能成功纯属以外 调用bar最自然的方法 去掉前的this
}
function bar() {
	console.log(this.a) // 想通过this访问foo()作用域中的变量a 不可能实现
}
foo() // ReferenceError: a is not defined
```

##### 6.3 this到底是什么

this是在运行时进行绑定的，它的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式

函数的调用会创建执行上下文，包括函数在哪里被调用（调用栈）、函数的调用方式、传入的参数等信息，this就是这个记录的一个属性，会在函数执行的过程中用到

#### this全面解析

##### 7.1 调用位置

函数在代码中被调用的位置

寻找调用位置就是寻找“函数被调用的位置”，但有些编程模式可能会隐藏真正的调用位置

分析调用栈，调用栈和调用位置的区别

```js
function baz() {
	// 当前调用栈是baz 因此当前调用位置是全局作用域
    console.log("baz")
    bar() // bar的调用位置
}
function bar() {
	// 当前调用栈是baz -> bar 因此当前调用位置是在baz中
    console.log('bar')
    foo() // foo的调用位置
}
function foo() {
	// 当前调用栈是baz -> bar -> foo 因此当前调用位置是在bar中
    console.log('foo')
}
baz() // baz的调用位置
```

调用位置确定了this的绑定

可以使用JavaScript调试器，展示函数调用列表，就是调用栈。如果想分析this的绑定吧，使用开发者工具得到调用栈，栈中找到第二个元素，就是真正的调用位置

`console.trace()` 方法用于显示当前执行的代码在堆栈（先进后出）中的调用路径

```js
function a() {
  b()
}
function b() {
  c()
}
function c() {
  console.trace() // 查看当前函数的调用帧
}
a()
// VM38:9 console.trace
// c @ VM38:9
// b @ VM38:6
// a @ VM38:3
// (anonymous) @ VM38:11
```

调用栈不能无线放置调用帧，会导致栈溢出

##### 7.2 绑定规则

函数的执行过程中调用位置如何决定this的绑定对象

###### 7.2.1 默认绑定

最常见的函数调用类型：独立函数调用。默认绑定时其他规则无法使用时使用的

```js
function foo() {
	console.log(this.a)
}
var a = 2
foo() // 2 应用默认绑定 this指向全局对象
```

###### 7.2.2 隐式绑定

隐式绑定会把函数调用中的this绑定到上下文对象

```js
function foo() {
	console.log(this.a)
}
var obj = {
	a: 2,
    foo
}
obj.foo() // 2 this绑定到obj
```

- 隐式丢失

  被隐式绑定的函数会丢失绑定对象，从而引用默认绑定，将this绑定到全局对象或undefined上

  ```js
  function foo() {
  	console.log(this.a)
  }
  function doFoo(fn) {
  	// fn其实引用的是foo
      fn() // 调用位置
  }
  var obj = {
  	a: 2,
      foo
  }
  var a = 'oops, global'
  doFoo(obj.foo) // oops, global
  ```

  参数传递是一种隐式传递，传入函数时会被隐式赋值

  回调函数丢失this非常常见，同时调用函数还可能修改this。在一些流行的JavaScript库中事件处理器会把回调函数的this强制绑定到触发事件的DOM元素

###### 7.2.3 显示绑定

可以使用call(..)和apply(..)在某个对象上强制调用函数。它们第一个参数是对象，是给this准备的，接着在调用函数时将其绑定到this。可以直接指定this的绑定对象，因此成为显示绑定

```js
function foo() {
	console.log(this.a)
}
var obj = {
	a: 2
}
var a = 1
foo.call(obj) // 2 强制绑定
```

可惜，显示绑定依然无法解决之前提出的丢失绑定问题

1. 硬绑定

   显示绑定的一个变种

   ```js
   function foo() {
   	console.log(this.a)
   }
   var obj = {
   	a: 2
   }
   var bar = function() {
   	foo.call(obj)
   }
   bar() // 2
   setTimeout(bar, 100) // 2
   // 硬绑定的bar不可能再修改它的this
   bar.call(window) // 2
   ```

   无论之后如何调用函数bar，总会手动在obj上调用`foo`，显示的强制绑定，称为硬绑定

   典型场景：创建一个包裹函数、负责接收参数并返回值

   ```js
   function foo(something) {
   	console.log(this.a, something)
       return this.a + something
   }
   
   var obj = { a: 2 }
   
   var bar = function () {
   	return foo.apply(obj, arguments)
   }
   var b = bar(3) // 2 3
   console.log(b) // 5
   ```

   二：创建一个可以重复使用的辅助函数

   ```js
   function foo(something) {
   	console.log(this.a, something)
       return this.a + something
   }
   function bind(fn, obj) {
   	return function() {
   		return fn.apply(obj, arguments)
   	}
   }
   
   var obj = { a: 2 }
   
   var bar = bind(foo, obj)
   var b = bar(3) // 2 3
   console.log(b) // 5
   ```

   `ES5`提供`bind(..)`，会将指定的参数设置为this的上下文并调用原始函数

2. `API`调用的“上下文”

   第三方很多库以及JavaScript语言和宿主环境有许多内置函数，都提供了可选的参数（`context`上下文），作用和`bind(..)`一样，确保回调函数使用指定`this`

   ```js
   function foo(el) {
   	console.log(el, this.id)
   }
   var obj = { id: 'awesome' }
   
   // 调用foo(..)时把thius绑定到obj
   [1,2,3].forEach(foo, obj)
   // 1 awesome 2 awesome 3 awesome
   ```

##### 7.2.4 new绑定

传统面向类的语言中，“构造函数“是类中的一些特殊方法，使用new初始化类时会调用类中的构造函数

```java
something = new MyClass(...)
```

而JavaScript中的new机制和它不同

在JavaScript中，构造函数只是一些使用new操作符时被调用的函数，只是被new操作符调用的普通函数而已

使用new调用函数，或者发生构造函数调用时，会自动执行下面的操作

1. 创建（构造）一个全新的对象
2. 新对象会执行`[[Prototype]]`连接
3. 新对象会绑定到函数调用的this
4. 如果函数没有返回其他对象，那么new表达式的函数调用会自动返回这个新对象

```js
function foo(a) {
	this.a = a
}
var bar = new foo(2)
console.log(bar.a) // 2
```

##### 7.3 优先级

默认绑定是四条规则中最低的

```js
function foo() {
	console.log(this.a)
}

var obj1 = { a: 2, foo }
var obj2 = { a: 3, foo }

obj1.foo() // 2
obj2.foo() // 3

obj1.foo().call(obj2) // 3
obj2.foo().call(obj1) // 3
```

显示绑定优先级高于隐式绑定

```js
function foo(something) {
	this.a = something
}

var obj1 = { foo }
var obj2 = {  }

obj1.foo(2)
console.log(obj1.a) // 2

obj1.foo.call(obj2, 3)
console.log(obj2.a) // 3

var bar = new obj1.foo(4)
console.log(obj1.a) // 2
console.log(bar.a) // 4
```

new绑定比隐式绑定优先级高

```js
function foo (something) {
	this.a = something
}
var obj1 = {}

var bar = foo.bind(obj1)
bar(2)
console.log(obj1.a) // 2

var baz = new bar(3)
console.log(obj1.a) // 2 并没有修改obj1.a
console.log(baz.a) // 3 new修改了硬绑定中的this
```

##### 7.4 判断this

1. 函数是否通过new调用（new 绑定），是的话this绑定的是新创建的对象
2. 函数是否通过call、apply（显示绑定）或者硬绑定调用，是的话this绑定的是指定的对象
3. 函数是否在某个上下文对象中调用（隐式绑定），是的话this绑定的是上下文对象
4. 都不是的话，使用默认绑定

##### 7.5 绑定例外

###### 7.5.1 被忽略的this

如果将null或者undefined作为this的绑定对象传入call、apply或bind，会被忽略，实际应用默认绑定

```js
function foo () {
	console.log(this.a)
}

var a = 2
foo.call(null) // 2
```

bind(..)可以对参数进行柯里化

```js
function foo(a, b) {
	console.log('a:' + a + ',b:' + b )
}

// 把数组“展开”成参数
foo.apply(null, [2, 3]) // a: 2, b: 3

// 使用bind(..)进行柯里化
var bar = foo.bind(null, 2)
bar(3) // a: 2, b: 3
```

`apply`和`bind`需要传入一个参数作为`this`的绑定对象，如果函数不关心`this`的话，仍需要传入一个占位符`null`

使用null会产生副作用，某个函数确实使用this，默认绑定会将this绑定到全局对象，导致不可预计的后果

**更安全的this**

传入一个特殊对象（空的非委托的对象），把this绑定到这个对象不会对程序产生副作用，因为对于this的使用都会被限制在这个对象中

`Object.create(null)`不会创建`Object.prototype`这个委托

###### 7.5.2 间接引用

```js
function foo () {
	console.log(this.a)
}
var a = 2
var o = { a: 3, foo }
var p = { a: 4 }

o.foo() // 3
(p.foo = o.foo)() // 2
```

`p.foo = o.foo`返回目标函数的引用，相当于直接调用`foo()`，应用默认绑定

###### 7.5.3 软绑定

使用硬绑定之后无法使用隐式绑定或者显示绑定来修改`this`，给默认绑定指定一个全局对象和`undefined`之外的值，可以实现和硬绑定相同的效果，同时保留隐式绑定或显示绑定修改`this`的能力

```js
if (!Function.prototype.softBind) {
	Function.prototype.softBind = function (obj) {
		var fn = this
		// 捕获所有的curried参数
        var curried = [].slice.call(arguments, 1)
        var bound = function() {
			return fn.apply(
            	(!this || this === (window || global)) ? 
                	obj : this,
                curried.concat.apply(curried, arguments)
            )
        }
        bound.prototype = Object.create(fn.prototype)
        return bound
    }
}
```

除了软绑定以外，`softBind`原理和`bind`类似

```js
function foo() {
	console.log('name' + this.name)
}

var obj = { name: 'obj' },
	obj2 = { name: 'obj2' },
    obj3 = { name : 'obj3' }
var fooOBJ = foo.softBind(obj)

fooOBJ() // name obj

obj2.foo = foo.softBind(obj)
obj2.foo() // name obj2

fooOBJ.call(obj3) // name obj3
```

##### 7.6 this词法

`ES6`引入箭头函数，确保函数的this被绑定到指定对象，并且用更常见的词法作用域取代了传统的this机制，箭头函数的绑定无法被修改

#### 对象

##### 8.1 语法

对象定义：声明形式和构造形式

```js
var obj = { key: value }
// 或者
var myObj = new Object()
myObj.key = value
```

##### 8.2 类型

六种主要类型：（`string`，`number`，`boolean`，`null`，`undefined`），`object`

`typeof null`会返回字符串`'object'`，是语言本身的bug，null是基本类型

“JavaScript中万物皆对象”，显然是错误的

`JavaScript`中有许多特殊的对象子类型，称为复杂基本类型

函数是对象的子类型，可调用的对象、数组也是对象的子类型

**内置对象**

对象子类型，名字看起来和简单基础类型一样

`String`、`Number`、`Boolean`、`Object`、`Function`、`Array`、`Date`、`RegExp`、`Error`

这些内置函数可以当做构造函数来使用，从而构造一个对应子类型的新对象

##### 8.3 内容

```js
var myObj = {
	a: 2
}

myObj.a // 2
myObj['a'] // 2
```

`.a`语法称为“属性访问”，`['a']`语法称为“键访问”

###### 8.3.1 可计算属性名

```js
prefix = 'foo'
myObj[prefix + 'b']
```

###### 8.3.2 属性和方法

访问对象的属性就是属性访问，如果返回“函数”，它也并不是一个“方法”，属性访问返回的函数和其他函数没有任何区别（除了隐式绑定this）

###### 8.3.3 属性描述符

```js
var obj = {
	a: 2
}
Object.getOwnPropertyDescriptor(obj, 'a')
/*
{
	value: 2,
    writable: true, // 可写
    enumrable: true, // 可枚举
    configurable: true // 可配置
}
*/
```

可以使用`Object.defineProperty`来添加新属性或者修改一个已有属性，并对特性进行设置

```js
var obj = {}
Object.defineProperty(obj, 'a', {
	value: 2,
    writable: true,
    enumrable: true,
    configurable: true
})
obj.a // 2
```

`writable`可写，决定是否可以修改属性的值

`configurable`可配置，如果属性可配置，就可以使用`defineProperty`方法来修改属性描述符；`configurable`修改为`false`是单向操作，不可撤销

`enumerable`可枚举，控制属性是否会出现在对象的属性枚举中，比如`foo..in..`循环

###### 8.3.4 不变性

有时候希望属性或对象是不可改变的

所有方法创建的都是浅不变性，它们只会影响目标对象和它的直接属性，如果目标对象引用了其他对象，其他对象的内容不受影响，仍然是可变的

```js
myImmutableObject = {
	foo: [1, 2, 3]
}
myImmutableObject.foo.push(4)
myImmutableObject.foo // [1, 2, 3, 4]
```

假设`myImmutableObject`是不可变的，但是为了保护它的内容`myImmutableObject.foo`，还需要使用一下方法让`foo`不可变

1. 对象常量

   结合`writable:false`和`configurable:false`可以创建一个真正的常量属性（不可修改、删除或重定义）

2. 禁止扩展

   想禁止一个对象添加新属性并保留已有属性，可以使用`Object.preventExtensions(..)`

   ```js
   var obj = {
   	a: 2
   }
   Object.preventExtensions(obj)
   obj.b = 3
   obj.b // undefined
   ```

3. 密封

   `Object.seal(..)`创建一个“密封”的对象，实际会在一个现有对象上调用`Object.prevenExtensions(..)`并把所有现有属性标记为`configurable：false`

4. 冻结

   `Object.freeze(..)`会创建一个冻结对象，实际是在一个现有对象上调用`Object.seal(..)`，并把所有现有属性标记为`writable：false`

###### 8.3.5 `[[Get]]`

```js
var obj = {
	a: 2
}
obj.a // 2
```

`obj.a`实际上是实现了`[[Get]]`操作，对象默认的内置`[[Get]]`操作首先在对象中查找是否有名称相同的属性，如果找到就返回这个属性的值；如果没有找到，遍历可能存在的`[[Prototype]]`链

###### 8.3.6 [[Put]]

如果对象已存在某个属性，`[[Put]]`算法过程如下：

1. 属性是否是访问描述符，如果是并且存在setter就调用setter
2. 属性的数据描述符`writable`是否是false
3. 如果都不是，将该值设置为属性的值

###### 8.3.7 `Getter`和`Setter`

属性设置`getter`、`setter`后被定义为“访问描述符”，对于访问描述符而言，`JavaScrpt`会忽略它们的`value`和`writable`属性，只关心`set`和`get`

```js
var obj = {
	get a() {
		return 2
    }
    // 可以设置setter
    // get a () {
    //	return this._a_
    // },
    // set a (val) {
	//	this._a_ = val * 2
    // }
}
Object.defineProperty(obj, 'b', {
	get () {
        return this.a * 2
    },
    // 却被b会出现在对象的属性列表中
    enumerable: true
})
obj.a // 2

obj.a = 3 // 只设置getter set忽略操作
obj.b // 4
```

###### 8.3.8 存在性

不访问值的情况下判断对象中是否有此属性

```js
var obj = {
	a: 2
}
('a' in obj) // true
('b' in obj) // false

obj.hasOwnProperty('a') // true
obj.hasOwnProperty('b') // false
```

`in`检查属性是否在对象及其`[[Prototype]]`原型链上，`hasOwnProperty`只会检查属性是否在`obj`对象上

普通对象都是通过对于`Object.prototype`的委托来访问`hasOwnProperty`，通过`Object.create(null)`创建的对象没有连接到`Object.prototype`，需要通过显示绑定`Object.prototype.hasOwnProperty.call(obj, 'a')`进行判断

##### 8.4 遍历

`every()`和`some()`中特殊的返回值和普通`for`循环中的`break`类似

`for...in`遍历对象无法直接获取属性值，实际上遍历的是对象的可枚举属性，需要手动获取属性值

`for...of`循环会向被访问对象请求一个迭代器对象，然后通过迭代器对象的`next()`方法来遍历所有返回值

`for...of`循环遍历数组，因为数组有内置的`@@iterator`，如果想遍历对象，需要定义迭代器

```js
var myArray = [1, 2, 3]
var it = myArray[Symbol.iterator]()

it.next() // { value: 1, done: false }
it.next() // { value: 2, done: false }
it.next() // { value: 3, done: false }
it.next() // { value: undefined, done: true }
```

使用`ES6`中的符号`Symbol.iterator`来获取对象的`@@iterator`内部属性；引用类似`@@iterator`的特殊属性时要使用符号名，而不是符号包含的值；`@@iterator`本身并不是一个迭代器对象，而是一个返回迭代器对象的函数

普通对象没有`@@iterator`，如果想遍历，需要定义

```js
var obj = {
	a: 2,
    b: 3
}
Object.defineProperty(obj, Symbol.iterator, {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function () {
        var o = this
        var idx = 0
        var ks = Object.keys(o)
        return {
			next: function () {
                return {
                    value: o[ks[idx++]],
                    done: (idx > ks.length)
                }
            }
        }
    }
})

// 手动遍历
var it = obj[Symbol.iterator]()
it.next() // { value: 2, done: false }
it.next() // { value: 3, done: false }
it.next() // { value: undefined, done: true }

// for..of遍历
for (var a of obj) {
	console.log(a)
}
// 2
// 3
```

#### 混合对象“类”

面向类的设计模式：实例化（instantiation）、继承（inheritance）和多态（polymorphism）

##### 9.1 类理论

面向对象编程强调的是数据和操作数据的行为本质上是互相关联的，因此好的设计就是把数据以及和它相关的行为打包（封装）起来

###### 9.1.1 JavaScript中的“类”

`JavaScript`实际是没有类的，只是一些近似类的语法；而且`JavaScript`会阻止使用类设计模式，在近似类的表象之下，`JavaScript`的机制其实和类完全不同

##### 9.2 类的机制

在面向类的语言中，“标准库”会提供`Stack`类，它是一种“栈”数据结构，用来存储变量，同时提供一些公有的可访问行为

**构造函数**

类实例是由一哥特殊的类方法构造的，这个方法名通常和类名相同，被称为构造函数，这个方法的任务是初始化实例需要的所有信息

```js
class CoolGuy {
	specialTrick = nothing
}
CoolGuy (trick) {
	specialTrick = trick
}
showOff() {
	output('Here’s my trick:',specialTrick)
}
```

可以调用类构造函数生成一个`CoolGuy`实例

```js
Joe = new CoolGuy('jumping rope') // 执行new CoolGuy实际调用的就是CoolGuy()构造函数
Joe.showOff() // Here’s my trick:jumping rope
```

##### 9.3 类的继承

继承，子类会包含弗雷行为的原始副本，而可以重写所有继承的行为甚至定义新行为

```js
class Vehicle {
	engines = 1
	ignition() {
		output('Turning on my engine')
    }
	drive() {
		ignition()
        output('Steering and moving forward')
    }
}
class Car inherits Vehicle {
	wheels = 4
    driver() {
		inherited:driver() // 相对多态
        output('Rolling on all', wheels, 'wheels')
    }
}
class SpeedBoat inherits Vehicle {
	engines = 2
    ignition() {
		output('Turning on my', engines, 'engines')
    }
    pilot() {
		inherited:driver() // 相对多态
        output('Speeding through the water with ease')
	}
}
```

`Car`和`SpeedBoat`都继承`Vehicle`通过特性并根据自身修改某些特性

###### 9.3.1 多态

在许多语言可以使用`super`代替本例中的`inherited`，表示当前类的父类/祖先类

###### 9.3.2 多重继承

面向对象语言允许继承多个“父类”，`Javascript`本身不提供“多重继承”功能，但是可以使用其他方式实现多重继承

##### 9.4 混入

在继承或者实例化时，`Javascript`对象机制并不会自动执行复制行为，`JavaScript`中只有对象，并不存在可以被实例化的“类”，一个对象并不会被复制到其他对象，它们会被关联起来

混入：模拟类的复制行为

###### 9.4.1 显示混入

```js
function mixin(sourceObj, targetObj) {
	for (var key in SourceObj) {
		// 只会在不存在的情况下复制
        if (!(key in targetObj)) {
			targetObj[key] = sourceObj[key]
        }
    }
    return targetObj
}
var Vehicle = {
	engines: 1,
    ignition: function () {
		console.log('Turning on my engine')
    },
    drive: function () {
		this.ignition()
        console.log('Steering and moving forward')
    }
}
var Car = mixin(Vehicle, {
    wheels: 4,
    driver: function () {
		Vehicle.driver.call(this)
        console.log('Rolling on all' + this.wheels + 'wheels')
    }
})
```

`Car`中有了`Vehicle`的属性和函数的副本，属性复制，方法引用

1. 再说多态

   `Vehicle.driver.call(this)`就是显示多态，由于`Car`和`Vehicle`都有`driver()`函数，为指明调用对象，必须使用绝对引用，通过名称显示指定`Vehicle`对象并调用它的`driver()`函数；如果直接执行`Vehicle.driver()`，函数调用的`this`会被绑定到`Vehicle`对象，因此使用`call(this)`来确保`driver()`在`Car`对象上下文执行

2. 寄生继承

   显示混入模式的一种变体被称为“寄生继承”，既是显示的又是隐式的

###### 9.4.2 隐式混入

隐式混入和显示伪多态很像

```js
var Something = {
	cool: function () {
        this.greeting = 'hello world'
        this.count = this.count ? this.count + 1 : 1
    }
}
Something.cool()
Something.greeting // hello world
Something.count // 1

var Another = {
	cool: function () {
		// 隐式的把something混入到Another
        Something.cool.call(this)
    }
}
Another.cool()
Something.cool()
Something.greeting // hello world
Something.count // 1
```

#### 原型

##### 10.1 [[Prototype]]

`JavaScript`对象有一个特殊的属性`[[Prototype]]`，其实是对于其他对象的引用

```js
var obj = {
	a: 2
}
obj.a //2 
```

对于默认的`[Get]`操作，如果a不在`obj`中，就会访问对象的`[[Prototype]]`链

```json
var anotherObj = {
	a: 2
}
var obj = Object.create(anotherObj) // 创建一个对象并把对象的[[Prototype]]关联到指定的对象
obj.a //2 
```

使用`for..in..`循环时任何可以通过原型链访问到的属性（`enumerable`为`true`）都会被枚举，使用`in`操作符来检查属性在对象中是否存在时，也会查找整条原型链

###### 10.1.1 Object.prototype

所有普通的`[[Prototype]]`最终都会指向内置的`Object.prototype`

###### 10.1.2 属性设置和屏蔽

给对象添加新属性或者修改一个现有属性值

```js
myObject.foo = 'bar'
```

如果`foo`不直接存在于`myObject`中，而是存在于原型链上层时，有三种情况

1. 如果上层属性没有被标记为只读（`writable:false`），那么直接在`myObject`上添加一个`foo`属性，发生属性屏蔽
2. 如果被标记为只读，那么无法修改已有属性或者在`myObject`创建新属性；严格模式下会抛出错误
3. 如果上层存在`foo`，并且是一个`setter`，那就一定会调用这个`setter`，`foo`不会被添加到`myObject`中

如果希望第二种和第三种也屏蔽`foo`，那就需要使用`Object.defineProperty(..)`添加属性

##### 10.2 “类”

`JavaScript`没有类来作为对象的抽象模式，只有对象；是少有的不通过类直接创建对象的语言

###### 10.2.1 ”类“函数

`JavaScript`模仿类，这种奇怪的”类似类“的行为利用函数的一个特殊特性：所有的函数默认都会拥有一个名为`prototype`的公有并且不可枚举的属性，执行另一个对象

```js
function Foo() {
	// ...
}
Foo.prototype // {}
```

这个对象被称为`Foo`的原型，通过`new Foo()`创建的每个对象将最终被`[[Prototype]]`链接到这个`Foo.prototype`对象

```js
function Foo() {
	// ...
}
var a = new Foo()

Object.getPrototypeOf(a) === Foo.prototype // true
```

**关于名称**

在`JavaScript`中，并不会将一个对象（”类“）复制到另一个对象（”实例“），只是将它们关联起来

这个机制通常被称为原型继承

继承意味着复制操作，`JavaScript`默认并不会复制对象属性，而是在两个对象之间创建一个关联，这样一个对象就可以通过委托访问另一个对象的属性和函数

###### 10.2.2 ”构造函数“

```js
function Foo() {
	// ...
}

Foo.prototype.contructor === Foo // true
var a = new Foo()
a.constructor === Foo // true a.constructor被委托给Foo.prototype 而Foo.prototype.constructor指向Foo
```

`Foo.prototype`默认有一个公有并不可枚举的属性`.constructor`，这个属性引用的是对象关联的函数

1. 构造函数还是调用

   上面容易让人认为`Foo`是个构造函数，因为使用`new`来调用它并且“构造”了一个对象

   实际上，函数本身并不是构造函数，当使用`new`关键字，就会把函数调用变成一个“构造函数调用”，`new`会劫持所有普通函数并用构造函数的形式调用它

   `JavaScript`中对于“构造函数”解释：所有带`new`的函数调用；函数不是构造函数，但是当且仅当使用`new`时，函数调用会变成“构造函数调用“

2. 原理

   对象的`.constructor`属性默认指向一个函数，而这个函数也有一个叫做`.prototype`的引用指向这个函数；”constructor并表示（对象）被（它）构造“

#####  10.3 （原型）继承

要创建一个合适的关联对象，必须使用`Object.create(..)`而不是使用具有副作用的`Foo(..)`，这样做唯一的缺点是需要创建一个新对象然后把旧对象抛弃掉，不能直接修改已有的默认对象

`ES6`添加了`Object.setPrototypeOf(..)`，可以直接修改现有的`Bar.prototype`

```js
Object.setPrototypeOf(Bar.prototype, Foo.prototype)
```

**检查类关系**

传统的面向类语言，检查一个实例（`JavaScript`的对象）的继承祖先（`JavaScript`中的委托关系）通常被称为内省（或反射）

```js
function Foo() {
	// ...
}
Foo.prototype.blah = ...
var a = new Foo()
a.instanceof Foo // true
```

`instanceof`在`a`的整条`[[Prototype]]`链中是否有`Foo.prototype`指向的对象

这个方法只能处理对象（`a`）和函数（`Foo`）之间的关系，如果想判断两个对象（比如`a`和`b`）之间是否通过`[[Prototype]]`链关联，只用`instanceof`无法实现

##### 10.4 对象关联

`[[Prototype]]`机制的意义是什么，为什么`JavaScript`开发者花费这么大力气在代码中创建这些关联呢？

```js
var foo = {
	something: function () {
		console.log('Tell me something good...')
    }
}
var bar = Object.create(foo)
bar.something() // Tell me something good...
```

`Object.create()`会创建一个新对象并把它关联到我们指定的对象；`Object.create(null)`会创建一个空`[[Prototype]]`链接的对象，这个对象无法委托，由于这个对象没有原型链，所以`instanceof`操作符无法进行判断，因此总是i返回`false`。这些特殊的空`[[Prototype]]`对象通常被称为“字典”，不受任何原型链干扰，适合用来存储数据

**`Object.create()`的`polyfill`写法**

`ES5`之前如果想支持需要一段`polyfill`代码

```js
if (!Object.create) {
	Object.create = function (o) {
        function F() {}
        F.prototype = o
        return new F()
    }
}
```

使用一次性函数`F`，通过改写它的`.protoype`属性使其指向想要管关联的对象，然后再使用`new F()`来构造一个新对象进行关联

#### 行为委托

##### 11.1 面向委托的设计

###### 11.1.1 类理论

假设需要在软件中建模一些类似的任务（“`XYZ`“，”`ABC`“）

定义一个通用父类，并定义所有任务都有的行为，接着定义子类，继承父类并添加一些特殊行为处理对应的任务

```js
class Task {
	id;
    // 构造函数Task()
    Task(ID) { id = ID }
    outputTask() { output(id) }
}
class XYZ inherits Task {
	label;
    // 构造函数XYZ()
    XYZ(ID, Label) {
        super(ID)
        label = Label
    }
    outputTask() {
		super()
        output(label)
    }
}
class ABC inherits Task {
	// 
}
```

###### 11.1.2 委托理论

首先会定义名为`Task`对象，既不是类也不是函数，会包含所有任务都可以使用的具体行为；接着创建每个任务的对应的存储对象，用来存储对应的数据和行为

```js
Task = {
	setID: function(ID) { this.id = ID }
    outputID: function() { console.log(this.id) }
}
XYZ = Object.create(Task)
XYZ.prepareTask = function(ID, Label) {
	this.setID(ID)
    this.label = Label
}
XYZ.outputTaskDetails = function() {
	this.outputID()
    console.log(this.label)
}
// ABC = Object.create(Task)
```

`Task`和`XYZ`并不是类（或函数），他们是对象，`XYZ`通过`Object.create(Task)`，它的`[[prototype]]`委托了`Task`对象

对象关联风格代码特点：

1. 上面代码，`id`和`label`都直接存储在`XYZ`上（而不是`Task`），通常来说，在`[prototype]`委托中最好把状态保存在委托者而不是委托目标上
2. 在类设计模式中，父类`Task`和子类`XYZ`都有`outputTask`方法，这样就可以利用重写的优势。而委托行为中应尽量避免在`[[prototype]]`链的不同级别中使用相同的命名
3. `this.setID(ID)`，`XYZ`中的方法首先会在`XYZ`中寻找是否有`setID()`，没有时再通过`[[prototype]]`委托关联到`Task`寻找；由于调用位置触发了`this`的隐式绑定规则，`setID()`虽然在`Task`中，运行时`this`仍然会绑定到`XYZ`

**互相委托（禁止）**

如果引用一个两边都不存在的属性或方法，那就会在`[[prototype]]`链上产生一个无线递归的循环。但是如果所有的引用都严格控制的话，可以相互委托，在某些情况下是非常有用的



