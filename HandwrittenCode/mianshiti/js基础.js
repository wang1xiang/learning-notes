var count = 10
function a() {
  return count + 10
}
function b() {
  var count = 20
  return a()
}
console.log(b()) // 20

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
