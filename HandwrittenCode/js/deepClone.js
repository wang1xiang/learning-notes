// 浅拷贝
// 1.只会
// Array.concat()，Array.slice()，Array.from() 等
// Object.assign()、es6扩展运算符

// 深拷贝
// JSON.parse(JSON.stringify())局限性
// 1.无法实现对函数、RegExp等特殊对象克隆
// 2.会将对象的constructor构造函数指向Object
// 3.对象有循环引用时，会报错

/**
 * 实现深拷贝
 * 1.得到所传入源数据的类型Object.prototype.toString.call(src).slice(8, -1)
 * 2.如果是基本类型时直接返回
 * 3.数组和对象for遍历源数据，遍历执行deepClone方法
 * 4.Date和RegExp、Fcuntion单独处理，new Date(src)、new RegExp(src.source, src.flags)、src.bind(this)
 */
// string
// let person = '123'
// undeifned
// let person = undefined
// null
// let person = null
// Array
// let person = [
//   {
//     a: 123,
//     b: '123',
//   },
// ]
// Object
// let person = {
//   a: 123,
//   b: 123,
//   setA: () => a,
// }
// let person1 = deepClone(person)
// person.a = 123142
// Date
// let person = new Date()
// RegExp
// let person = /[a-zA-Z]+Script/g
// function
let person = () => {
  console.log('123')
}
let person1 = deepClone(person)
console.log(person, person1, person1 === person)
function deepClone(src) {
  const basicType = ['Number', 'String', 'Boolean', 'Undefined', 'Null']
  const type = Object.prototype.toString.call(src).slice(8, -1)
  if (basicType.includes(type)) return src

  const distType = {
    Object: type === 'Object' && {},
    Array: type === 'Array' && [],
    Date: type === 'Date' && new Date(src),
    RegExp: type === 'RegExp' && new RegExp(src.source, src.flags),
    Function: type === 'Function' && src.bind(this),
  }

  let dist = distType[type]
  for (let key in src) {
    if (src.hasOwnProperty(key)) {
      dist[key] = deepClone(src[key])
    }
  }
  return dist
}
