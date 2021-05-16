let data = {
  msg: 'hello',
  title: 'nihao',
}

// 模拟vue实例
let vm = new Proxy(data, {
  get(target, key) {
    console.log('getter', key, target[key])
    return target[key]
  },
  set(target, key, newVal) {
    console.log('setter', key, newVal)
    if (newVal === target[key]) return
    target[key] = newVal
  },
})

vm.title = 'hello world'
console.log(vm.title)
