// 数组去重
// 1.值为基本类型数组去重
const uniqBy = (arr) => [...new Set(arr)]
let a = [
  1,
  2,
  1,
  2,
  3,
  '1',
  '3',
  '1',
  true,
  false,
  true,
  undefined,
  undefined,
  null,
  null,
]
console.log(uniqBy(a))
let b = [{ a: 123 }, { a: 123 }]
console.log(uniqBy(b))

// 2.值为引用类型时去重
const uniqueBy = (arr, key) => [
  ...new Map(arr.map((item) => [item[key], item])).values(),
]
const singers = [
  { id: 1, name: 'Leslie Cheung' },
  { id: 1, name: 'Leslie Cheung' },
  { id: 2, name: 'Eason Chan' },
]
console.log(uniqueBy(singers, 'id'))

// 数组扁平化
const flatten = (arr, deep = 1) => {
  return arr.reduce((cur, next) => {
    return Array.isArray(next) && deep > 1
      ? [...cur, ...flatten(next, deep - 1)]
      : [...cur, next]
  }, [])
}

const arr = [1, [2], [3, [4]]]
console.log(flatten(arr, 1)) // [1, [2], [3, [4]]]
console.log(flatten(arr, 2)) // [1，2, [3, 4]]
console.log(flatten(arr, 3)) // [1，2, 3, 4]
