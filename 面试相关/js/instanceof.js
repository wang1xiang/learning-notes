function getType(target) {
  // 处理null
  if (target === null) {
    return 'null'
  }
  // 判断不是基础类型
  const typeofTarget = typeof target
  if (typeofTarget !== 'object') {
    return typeofTarget
  }
  // 此时已经是引用类型 使用Object.prototype.toString.call(target)
  const template = {
    '[object Object]': 'object',
    '[object Array]': 'array',
    '[object Function]': 'function',
    // 包装类型
    '[object String]': 'object - string',
    '[object Number]': 'object - number',
    '[object Boolean]': 'object - boolean',
  }

  const typeStr = Object.prototype.toString.call(target)
  return template[typeStr]
}
// 模拟实现instanceOf
// 遍历左边变量的原型链，直到找到右边变量的 prototype，如果没有找到，返回 false
function instanceOf(left, right) {
  let proto = left.__proto__
  let prototype = right.prototype
  while (true) {
    if (proto === null) return false
    if (proto === prototype) return true
    proto = proto.__proto__
  }
}

let a = []
console.log(getType(a))
console.log(instanceOf(a, Array))
console.log(instanceOf(a, Object))

let b = {}
console.log(getType(b))
console.log(instanceOf(b, Array))
console.log(instanceOf(b, Object))

let c = () => {}
console.log(getType(c))
console.log(instanceOf(c, Array))
console.log(instanceOf(c, Object))

let d = ''
console.log(getType(d))
console.log(instanceOf(d, String))
console.log(instanceOf(d, Object))
const arr = [12, 3, 4, 5, 5]
const length = arr.length;
for (let i = 0; i < length; i++) {
  const randomIndex = Math.round((Math.random() * (length - 1))) + i;
  [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
}
console.log(arr);