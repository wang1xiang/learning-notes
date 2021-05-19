const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject)
  }

  status = PENDING
  value = undefined
  reason = undefined

  successCallBack = []
  failCallbak = []
  resolve = (value) => {
    if (this.status !== PENDING) return
    this.value = value
    this.status = FULFILLED
    while (this.successCallBack.length) {
      this.successCallBack.shift()(this.value)
    }
  }
  reject = (reason) => {
    if (this.status !== PENDING) return
    this.reason = reason
    this.status = REJECTED
    while (this.failCallbak.length) {
      this.failCallbak.shift()(this.reason)
    }
  }
  then(successCallBack, failCallbak) {
    successCallBack =
      typeof successCallBack === 'function' ? successCallBack : (value) => value
    failCallbak =
      typeof failCallbak === 'function'
        ? failCallbak
        : (reason) => {
            throw reason
          }
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          let x = successCallBack(this.value)
          resolvePromise(promise2, x, resolve, reject)
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          let x = failCallbak(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        }, 0)
      } else {
        this.successCallBack.push(successCallBack)
        this.failCallbak.push(failCallbak)
      }
    })
    return promise2
  }
}
function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(
      new TypeError('Chaining cycle detected for promise #<Promise>')
    )
  }

  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}
// module.export = MyPromise

const myPromise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 2000)
})

myPromise.then(
  (val) => {
    console.log(val)
  },
  (reason) => {
    console.log(reason)
  }
)
let p1 = myPromise.then((value) => {
  console.log(value)
  return p1
})

p1.then(
  (value) => {
    console.log('p1')
    console.log(value)
  },
  (reason) => {
    console.log(reason)
  }
)
