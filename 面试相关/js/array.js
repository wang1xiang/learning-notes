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

// 3.使用数组的filter方法进行去重
const filterArr = (arr) =>
  arr.filter((item, index, arr) => arr.indexOf(item) === index)
console.log(filterArr([3, 4, 5, 6, 2, 3, 4, '123', '324', '123']))

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

/* flat(depth)方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回
  depth 指定要提取嵌套数组的结构深度，默认值为 1
*/

const arr = [1, [2], [3, [4]]]
console.log(arr.flat(3))
// flat会移除数组中的空项
const arr1 = [1, 2, , [3, 4, [5, 6, [7, 8, [9, 10]]]]]
//使用 Infinity，可展开任意深度的嵌套数组
console.log(arr1.flat(Infinity))
/**
 * Infinity是全局对象Global的一个属性，即是一个全局变量
 * 初始值是Number.POSITIVE_INFINITY，表示正无穷大
 * 任何正值，包括POSITIVE_INFINITY，乘以POSITIVE_INFINITY都等于POSITIVE_INFINITY
 * 任何负值，包括NEGATIVE_INFINITY，乘以POSITIVE_INFINITY都等于NEGATIVE_INFINITY
 * 0乘以POSITIVE_INFINITY为NaN
 * NaN乘以POSITIVE_INFINITY等于NaN
 * POSITIVE_INFINITY除以NEGATIVE_INFINITY以外的任何负值都为NEGATIVE_INFINITY
 * POSITIVE_INFINITY除以POSITIVE_INFINITY以外的任何正值都为POSITIVE_INFINITY
 * POSITIVE_INFINITY出意NEFATIVE_INGINITY或POSITIVE_INFINITY为NaN
 * 任何数除以POSITIVE_INFINITY都为0
 */
console.log(Infinity === Number.POSITIVE_INFINITY)

// ES2017引入Object.kes配套的Object.values和Object.entries
let { keys, values, entries } = Object
let obj = {
  a: 1,
  b: 2,
  c: 3,
}

for (let i of keys(obj)) {
  console.log(i)
}
for (let i of values(obj)) {
  console.log(i)
}
for (let i of entries(obj)) {
  console.log(i)
}
for (let [key, value] of entries(obj)) {
  console.log(key, value)
}

/** 数组乱序 */
const arr = [12, 3, 4, 5, 5]
const length = arr.length;
for (let i = 0; i < length; i++) {
  const randomIndex = Math.round(Math.random() * (length - 1 - i)) + i;
  [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
}
console.log(arr);

/** 数组扁平化 */
const arr = [1, [2, 3, [4, 5]]]
const flatten = (arr) => {
  const result = [];
  for (let item of arr) {
    console.log(item);
    if (Array.isArray(item)) {
      result = [...result, ...flatten(item)];
    } else {
      result.push(item);
    }
  }
  return result;
}
console.log(flatten(arr));