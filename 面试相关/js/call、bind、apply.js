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
