function throttle(fn, delay) {
  let lastTime = 0
  return function (...args) {
    const currentTime = new Date().getTime()
    // 若时间差大于间隔时间，则立刻执行一次函数 并更新上一次执行时间
    if (currentTime - lastTime > delay) {
      fn.apply(this, ...args)
      lastTime = currentTime
    }
  }
}

// 定时器版本
const throttle = (fn, delay) => {
  let timer = null
  return function (...args) {
    if (!timer) {
      timer = setTimout(() => {
        timer = null
        fn.apply(this, ...args)
      })
    }
  }
}
