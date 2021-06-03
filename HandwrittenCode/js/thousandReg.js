// 千分位算法
function format(num) {
  var reg = /\d{1,3}(?=(\d{3})+$)/g
  return (num + '').replace(reg, '$&,')
}

console.log(format(13123903243))

function format1(num) {
  const changeStr = num + ''
  const [integerPart, decimalPart] = changeStr.split('.')
  // 未设置初始值是index从1开始 设置了index从0开始 对应数组下标
  return (
    integerPart
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ',') + prev
      }) +
    '.' +
    decimalPart
  )
}
console.log(format1(13123903243.121233))
