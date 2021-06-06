// 观察者模式是由具体目标调度，比如当事件触发，Dep 就会去调用观察者的方法，所以观察者模式的订阅者与发布者之间是存在依赖的。
class Dep {
  constructor() {
    this.subs = []
  }
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  notify() {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}

class Watcher {
  update() {
    console.log('update')
  }
}

let dep = new Dep()
let watcher = new Watcher()
dep.addSub(watcher)
dep.notify()
