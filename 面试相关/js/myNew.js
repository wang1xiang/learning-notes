/**
 * new的过程
 * 1.创建一个新的空对象
 * 2.将构造函数的作用域赋给新对象 （因此this就指向了新对象）
 * 3.执行构造函数中的代码（为这个新对象添加属性）
 * 4.返回新对象
 */

// 测试案例

function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function () {
    console.log(this.name)
  }
}

var person = new Person('zhangsan', 45, 'coder')

// 1.创建一个空对象 使用Object.create()
/**
 * new Object()和Object.create()比较
 * let obj = new Object()执行时obj.__proto__指向Object.prototype
 * 如果使用Object.create(object, objectProps)这种方法，第一个参数是要创建的对象的原型，如果赋值为null，则得到的obj没有任何原型，这里想要给新对象使用构造函数的原型
 */
function myNew() {
  let obj = new Object()
  // let obj = Object.create()
}
// 2.将构造函数的作用域赋给新对象，就是给这个新对象构造原型链，链接到构造函数的原型对象上，从而新对象就可以访问构造函数中的属性和方法
function myNew() {
  // 构造函数是传入的第一个参数，由于arguments是类数组，不能直接使用shift方法，需要使用call来调用Array的shift方法，调用完成arguments中的第一个参数就没有了
  const constr = Array.prototype.shift.call(arguments)

  let obj = new Object(constr.prototype)
  // let obj = Object.create()
}

// 3.执行构造函数中的代码，为新对象创建属性，使用apply
function myNew() {
  const constr = Array.prototype.shift.call(arguments)
  let obj = Object.create(constr.constructor)
  constr.apply(obj, arguments)
}

// 4.如果构造函数有返回值，则返回；否则，就会默认返回新对象
function myNew1(context, ...args) {
  // const constr = Array.prototype.shift.call(arguments)
  let obj = Object.create(context.constructor)
  const result = context.call(obj, ...args)

  // new 如果返回undefined、null和基本类型时，都会返回新对象；而只有返回对象时，才会返回构造函数的返回值
  return result instanceof Object ? result : obj
}

const person1 = myNew1(Person, 'zhangsan', 23, 'sfd')
console.log(person1)
