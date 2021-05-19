const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
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
          try {
            let x = successCallBack(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = failCallbak(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else {
        this.successCallBack.push(() => {
          setTimeout(() => {
            try {
              let x = successCallBack(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.failCallbak.push(() => {
          setTimeout(() => {
            try {
              let x = failCallbak(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    return promise2
  }
  // 接收数组 返回数组 顺序要一致 可传入Promise对象或普通值 一个失败所有失败
  static all(arr) {
    let result = []
    let index = 0

    return new MyPromise((resolve, reject) => {
      array.forEach((item, index) => {
        function addData(key, value) {
          result[key] = value
          index++
          if (index === array.length) resolve(result)
        }

        if (item instanceof MyPromise) {
          item.then(
            (value) => {
              addData(index, value)
            },
            (reason) => {
              reject(reason)
            }
          )
        } else {
          addData(key, item)
        }
      })
    })
  }
  // 如果是Promise对象 直接返回 如果不是创建Promise对象 将给定值包裹起来返回
  static resolve(value) {
    value instanceof MyPromise
      ? value
      : new MyPromise((resolve) => resolve(data))
  }
  // 不管那种状态都返回值或原因 可以链式调用then方法
  finally() {
    return this.then(
      (value) => {
        return MyPromise.resolve(callback()).then(() => value)
      },
      (reason) => {
        return MyPromise.resolve(callback()).then(() => {
          throw reason
        })
      }
    )
  }
  // 处理失败情况 不用传递失败回调 用catch捕获
  catch(failCallbak) {
    return this.then(undefined, failCallbak)
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
  }, 1000)
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
  return (value = 'ad')
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
