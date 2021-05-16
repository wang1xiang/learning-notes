// 1.原型链继承

// function Parent() {
//   this.name = 'zhangsan'
//   this.children = ['A', 'B', 'C']
// }
// Parent.prototype.getName = function () {
//   return this.name
// }

// function Child() {}

// Child.prototype = new Parent()
// let child1 = new Child()
// console.log(child1.getName())
// child1.name = 'lisi'
// child1.children.push('name')
// console.log('child1', child1)
// let child2 = new Child()
// console.log('child2', child2)

// 2.构造函数继承

// function Parent(name) {
//   this.name = name
//   this.children = ['A', 'B', 'C']
//   this.getName = function () {
//     return this.name
//   }
// }

// function Child(name) {
//   Parent.call(this, name)
// }

// let child1 = new Child('zhangsan')
// child1.name = 'lisi'
// child1.children.push('name')
// console.log('child1', child1)
// let child2 = new Child('lisi')
// console.log('child2', child2)

// 3.组合继承

// function Parent(name) {
//   this.name = name
//   this.children = ['A', 'B', 'C']
//   this.getName = function () {
//     return this.name
//   }
// }
// Parent.prototype.getChildren = function () {
//   return this.children
// }

// function Child(name, age) {
//   Parent.call(this, name) // 第二次调用父类构造函数
//   this.age = age
// }

// Child.prototype = new Parent() // 第一次调用父类构造函数
// // 矫正child的构造函数
// Child.prototype.constructor = Child

// let child1 = new Child('zhangsan', 12)
// child1.children.push('D')
// console.log(child1)
// let child2 = new Child('lisi', 13)
// console.log(child2)

// 4.原型式继承
// function createObj(o) {
//   function F() {}
//   F.prototype = o // 传入的对象作为创建对象的原型
//   return new F()
// }
// let Parent = {
//   name: 'name',
//   children: ['A', 'B', 'C'],
//   getName: function () {
//     return this.name
//   },
// }

// let child1 = createObj(Parent)
// child1.children.push('D')
// console.log(child1)
// let child2 = createObj(Parent)
// console.log(child2)

// 5.寄生式继承
// 创建一个用于封装继承过程的函数，这个函数在内部以某种形式来增强对象
// function createObj(o) {
//   let clone = Object.create(o) // 使用原型式继承获得一个目标对象的浅复制，然后增强这个浅复制的能力
//   clone.sayName = function () {
//     console.log('say hello')
//   }
//   return clone
// }
// let Parent = {
//   name: 'name',
//   children: ['A', 'B', 'C'],
//   getName: function () {
//     return this.name
//   },
// }

// let child1 = createObj(Parent)
// child1.children.push('D')
// console.log(child1)
// let child2 = createObj(Parent)
// console.log(child2)

// 6.寄生组合式继承

function Parent(name) {
  this.name = name
  this.children = ['A', 'B', 'C']
  this.getName = function () {
    return this.name
  }
}
Parent.prototype.getChildren = function () {
  return this.children
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

// 设置Child的prototype指向Parent
// let F = function () {}
// F.prototype = Parent.prototype
// Child.prototype = new F()
// 上面的三句话实际上就是类似于：Child.prototype = Object.create(Parent.prototype)
Child.prototype = Object.create(Parent.prototype)

let child1 = new Child('zhangsan', 12)
child1.children.push('D')
console.log(child1)
let child2 = new Child('lisi', 13)
console.log(child2)
