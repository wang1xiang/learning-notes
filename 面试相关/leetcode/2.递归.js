/** 
 * 爬楼梯
 * f(n) = f(n - 1) + f(n - 2)
 * 求f5需要计算f4和f3
 * 求f4需要计算f3和f2
 * f3会求两次，所以需要缓存f3的值
 */

const stairsObj = {};
const climbStairs = (n) => {
  if (n === 1) return 1;
  if (n === 2) return 2;

  if (stairsObj[n]) {
    return stairsObj[n]
  } else {
    const result = climbStairs(n - 1) + climbStairs(n - 2);
    stairsObj[n] = result;
    return result;
  }
}

console.log(climbStairs(4))  

const climbingStairs = (n) => {
  if (n === 1) return 1;
  if (n === 2) return 2;
  let result, pre = 2, prePre = 1;

  for (let i = 3; i <= n; i++) {
    result = pre + prePre;
    prePre = pre;
    pre = result;
  }
  return result;
}
console.log(climbingStairs(4))  

/** 
 * 斐波那契数列
 * 递归
 */

const fibonacciObj = {}
const fibonacci = (n) => {
  if (n === 0) return 0;
  if (n === 1) return 1;

  if (fibonacciObj[n]) return fibonacciObj[n];
  const result = fibonacci(n - 1) + fibonacci(n - 2);
  fibonacciObj[n] = result;
  return result;
}

console.log(fibonacci(8))