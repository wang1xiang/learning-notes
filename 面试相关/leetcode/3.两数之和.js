/** 
 * 两数之和
 * 暴力穷举
 */

const twoNum = (arr, target) => {
  const result = [];
  const length = arr.length;

  for (let i = 0; i < length; i++) {
    for (let j = i + 1; j < length; j++) {
      if (arr[i] + arr[j] === target) {
        result[0] = i;
        result[1] = j;
        return result;
      }
    }
  }
  return result;
}

console.log(twoNum([12, 3, 4, 2, 3, 5, 13, 23, 4, 32, 32], 18))

/** 
 * 12, 3, 4, 2, 3, 5, 13, 23, 4, 32, 32
 * 以12开始，18 - 12 = 6，在剩余数组找6
 */
const twoNum = (arr, target) => {
  const result = [];
  for (let i in arr) {
    const findTarget = target - arr[i];
    const findIndex = arr.findIndex(item => item === findTarget);
    if (findIndex > 0) {
      result[0] = i;
      result[1] = findIndex;
      break;
    }
  }
  return result;
}
console.log(twoNum([12, 3, 4, 2, 3, 5, 13, 23, 4, 32, 32], 18))