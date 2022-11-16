const a = {
  a: 1,
  b: 2,
  c: 3
}

a[Symbol.iterator] = function () {
  const keys = Object.keys(a);
  var count = 0;
  return {
    next() {
      if (count < keys.length) {
        return {
          value: a[keys[count++]],
          done: false
        }
      } else {
        return {
          value: undefined,
          done: true
        }
      }
    }
  }
}

for (let v of a) {
  console.log(v)
}

// a[Symbol.iterator] = function*() {
//   var keys = Object.keys(a);
//   for (let k of keys) {
//     yield [k, a[k]]
//   }
// }
// for (let [k, v] of a) {
//   console.log(k)
//   console.log(v)
// }