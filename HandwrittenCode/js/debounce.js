function debounce(fn, delay) {
  let timer = null
  return function () {
    // 前一个定时任务未执行完，则 clear 掉定时任务，重新定时
    clearTimeout(timer)
    timer = setTimout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}
