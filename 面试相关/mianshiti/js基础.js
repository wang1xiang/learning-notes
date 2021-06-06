var count = 10
function a() {
  return count + 10
}
function b() {
  var count = 20
  return a()
}
console.log(b()) // 20

// 因为构造函数也是一个函数, 自然也可以有return语句, 不过和一般函数不太一样的是, 在构造函数中如果return的是一个对象, 则会直接返回这个对象, 如果return 的不是一个对象, 那在new时会忽略这个retrun, 转而返回this对象.
function Foo() {
  this.a = 1
  return {
    a: 4,
    b: 5,
  }
}
Foo.prototype.a = 6
Foo.prototype.b = 7
Foo.prototype.c = 8
var o = new Foo()
console.log(o.a) // 4
console.log(o.b) // 5
console.log(o.c) // Undefined

var name = '123'
var obj = {
  name: '456',
  getName: function () {
    function printName() {
      console.log(this.name)
    }
    printName()
  },
}
obj.getName() // undefined

setTimeout(() => {
  console.log('1')
}, 0)

new Promise((resolve, reject) => {
  console.log('2')
  process.nextTick(resolve)
}).then(() => {
  console.log('3')
})

process.nextTick(() => {
  console.log('4')
})
setImmediate(() => {
  console.log('5')
})
// 2 4 3 1 5

// 括号匹配算法
function isValid(s) {
  const strArr = s.split('')
  const leftType = ['(', '[', '{']
  let result = []

  for (let i of strArr) {
    if (leftType.includes(i)) {
      result.push(i) // 左括号入栈
    } else {
      const start = result.pop()
      if (i === ')' && start !== '(') {
        return false
      }
      if (i === ']' && start !== '[') {
        return false
      }
      if (i === '}' && start !== '{') {
        return false
      }
    }
  }
  return !result.length
}

let test = '()[()]{}'
console.log(isValid(test))

function f() {
  console.log(this.a)
}
var obj = {
  a: 2,
  f: f,
}
var f2 = obj.f
var a = 'hello'
f2() // 无调用者 相当于window
obj.f() // 有调用者

// node环境执行 返回 undefined 2 因为没有window对象
// 浏览器环境 hello 2

var length = 100
function f1() {
  console.log(this.length) // this会变 数组长度属性length
}

var obj = {
  x: 10,
  y: 10,
  f2: function (f1) {
    f1() // 五调用者 相当于window 100
    console.log(arguments[0])
    arguments[0]() // arguments[0]=f1 无调用者 作用域arguments对象
  },
}
obj.f2(f1, 1, 2, 3)

var n = 123
function f1() {
  console.log(n) // 123
}
function f2() {
  var n = 456
  f1() // f1在f2执行  无调用者 相当于window
}
f2()
console.log(n) // 123

function f(s) {
  console.log(this.a, s) // 2 3
  return this.a + s // 5
}

var obj = {
  a: 2,
}
var f2 = function () {
  // f.apply(obj, arguments)
  return f.call(obj, ...arguments)
}
var b = f2(3)
console.log(b)

/**
 * a = b = 3
 */
(function () {
  var a = b = 3  
})()
console.log(a)
console.log(b)

/**
 * 
 */
function fun(n) {
  // var n = undefined; n = n
  console.log(n) // 123
  var n = 456
  console.log(n) // 456
}
var n = 123
fun(n)

/**
 * 主线程for--异步setTimeout--放到一边--继续执行for--for执行完毕i=4--执行异步队列
 */
for (var i = 1; i <= 3; i++) {
  setTimeout(() => {
    console.log(i); // 4 4 4
  },0)
}


/**
 * 函数是一等公民 会提前
 */
// var fun = 123
function fun() {
  console.log(fun)
  fun = 456
  console.log(fun)
}
fun()
var fun = 123

/**
 * 作用域
 */
var a = 10
function test() {
  a = 100
  console.log(a) // 100
  console.log(this.a) // 10
  var a
  console.log(a); // 100
}
test()

/**
 * 
 */
const pro = new Promise((resolve, reject) => {
  console.log('start')

  const innerPro = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, 0)
    console.log(2)
    resolve(3)
  })
  innerPro.then(res => console.log(res))
  resolve(4)
  console.log('promise end');
})
pro.then(res => console.log(res))
console.log('end')

/**
 * undefined
   2 undefined
   2 0
 */

console.log(num)
function show() {
  console.log('1', num)
}
show()
var num = '0'
function show() {
  console.log('2', num)
}
show()

/**
 * 
 */
const delay = (n) => new Promise((resolve) => setTimeout(resolve, n))

const promises = [delay(100).then(() => 1), delay(200).then(() => 2)]

Promise.all(promises).then((values) => console.log(values))

const promises = [
  delay(100).then(() => 1),
  delay(200).then(() => 2),
  Promise.reject(3),
]

Promise.all(promises).then((values) => console.log(values))
// 最终输出： Uncaught (in promise) 3

Promise.all(promises)
  .then((values) => console.log(values))
  .catch((err) => console.log(err))