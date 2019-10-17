> 当需要使用 switch 时，可以使用 es6 的 map 对象来替换，减少代码量
> 针对一个值时

```js
const dynamicLevel = new Map([
  ["critical", "严重"],
  ["major", "主要"],
  ["minor", "次要"],
  ["warn", "警告"],
  ["info", "信息"],
  ["normal", "正常"]
]);
dynamicLevel.get("critical"); // 严重
```

> 针对多个值

```js
const cmdbTab = [
  {
    name: "home",
    title: "主页",
    icon: "home"
  },
  {
    name: "categoryManage",
    title: "类别管理",
    icon: "gold"
  }
];
const dynamicMenu = new Map([
  ["smim", monitorTab],
  ["cmdb", cmdbTab],
  ["resource", resourceTab],
  ["system", systemTab]
]);
dynamicMenu.get("cmdb"); // 获取cmdbTab对象
```
