/*
  发布/订阅模式由统一调度中心调用，因此发布者和订阅者不需要知道对方的存在。
  vue自定义事件
  this.$emit('change')
  this.$on('change', () => {
    console.log('change')
  })
 */

class EventEmitter {
  constructor() {
    this.subs = Object.create(null)
  }
  $on(eventType, handler) {
    this.subs[eventType] = this.subs[eventType] || []
    this.subs[eventType].push(handler)
  }
  $emit(eventType) {
    if (this.subs[eventType]) {
      this.subs[eventType].forEach((handler) => {
        handler()
      })
    }
  }
}

let em = new EventEmitter()
em.$on('change', () => {
  console.log('change event1')
})
em.$on('change', () => {
  console.log('change event2')
})
em.$emit('change')
