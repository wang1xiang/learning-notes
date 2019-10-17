> 对象 a 进行解构赋值
> a: A 重新命名 d: {e,f} 对象中的对象进行结构

```js
let a = {
  a: "a",
  b: "b",
  c: "c",
  d: {
    e: "e",
    f: "f"
  }
};
const {
  a: A,
  b,
  c,
  d: { e, f }
} = a;
(A = "a"), (e = "e");
```
