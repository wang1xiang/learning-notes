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
