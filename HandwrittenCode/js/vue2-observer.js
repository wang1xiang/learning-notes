let data = {
  msg: 'hello',
  title: 'nihao',
}

// 模拟vue实例
let vm = {}

Object.keys(data).forEach((key) => {
  Object.defineProperty(vm, key, {
    enumrable: true,
    configurable: true,
    get() {
      console.log('getter', data[key])
      return data[key]
    },
    set(newVal) {
      console.log('setter', key, newVal)
      if (newVal === data[key]) return
      data[key] = newVal
    },
  })
})

vm.msg = 'hello world'
console.log(vm.msg)
