/** 
 * 数组[1, 3, 4， 6], [1, 3, 5]合并
 * 数组sort sort底层是快排
 * 
 * 双指针比较大小 额外的数组保存
 */

const mergeArray = (aArr, bArr, aLen, bLen) => {
  const result = [...aArr, ...bArr];
  return result.sort((a, b) => a - b);
}

console.log(mergeArray([1, 3, 4, 6], [1, 3, 5], 4, 3))

const mergeArray = (aArr, bArr, aLen, bLen) => {
  let result = [];
  const maxLength = aLen + bLen;

  for (let index = 0, aArrIndex = 0, bArrIndex = 0; index < maxLength; index++) {
    if (aArrIndex >= aLen) {
      result[index] = bArr[bArrIndex++];
    } else if (bArrIndex >= bLen) {
      result[index] = aArr[aArrIndex++];
    } else if (aArr[aArrIndex] < bArr[bArrIndex]) {
      result[index] = aArr[aArrIndex++];
    } else {
      result[index] = bArr[bArrIndex++];
    }
  }

  return result;
}
console.log(mergeArray([1, 3, 4, 6], [1, 3, 5], 4, 3))