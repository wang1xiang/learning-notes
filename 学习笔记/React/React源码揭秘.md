#### React 理念

快速响应

制约快速响应的因素：1.大量计算操作或设备性能（CPU 瓶颈）、2.网络延迟（IO 瓶颈）

##### CPU 瓶颈

浏览器刷新频率 60Hz，即（1000ms/60Hz）16.6ms 刷新一次，JS 线程与 GUI 渲染线程互斥，导致 JS 脚本执行和浏览器布局、绘制不能同时进行

当 JS 执行时间过长，这次刷新就没有时间执行样式布局和样式绘制

问题解决：每一帧预留给 JS 执行时间（5ms），React 利用这部分时间执行 js，更新组件；当预留时间不够时，React 将线程控制权交给浏览器使其有时间渲染 UI，React 等待下一帧继续执行被中断的工作

这种将长任务分割到每一帧中，叫做时间切片。

解决 CPU 瓶颈关键是实现时间切片，而时间切片的关键是：将同步的更新变为可中断的异步更新。

##### IO 瓶颈

如何在网络延迟客观存在的情况下，减少用户对网络延迟的感知

当请求时间足够小时，用户是无感知的（即使请求时间很短，loading 效果一闪而过，用户是有感知的），如果请求时间超过一个范围，再显示 loading 的效果。

#### React15 架构

##### Reconciler(协调器)——找出变化的组件

当React组件发生更新时（this.setState、this.forceUpdate、ReactDOM.render），Reconciler步骤如下

1. 调用render方法，将返回的JSX转为虚拟DOM
2. 与上次更新时的虚拟DOM对比
3. 找出变化后的虚拟DOM
4. 通过Renderer将变化的虚拟DOM渲染到页面上

##### Renderer(渲染器)——将变化的组件重新渲染

更新发生后，Renderer接收Reconciler通知，渲染变化的组件；React跨平台，支持不同渲染器

- 浏览器环境——ReactDOM
- App原生组件——ReactNative
- 纯Js对象用于测试——ReactTest
- 渲染到Canvas、SVG——ReactArt

##### React15架构缺点

Reconciler中，mount的组件会调用mountComponent，update的组件会调用updateComponent，这两个方法都需要递归调用子组件

递归执行，层级越深耗时越长，当超过16ms时，就能感觉明显的卡顿

Reconciler和Renderer之间交替工作，假如支持异步更新，如渲染一个列表，协调器发出更新通知，渲染器就会将不完整的内容渲染到页面，因此React重写整个架构

原则上使用可中断的异步更新替代同步更新，但React15并不支持异步更新

#### React16架构

在React15架构基础上新增Scheduler，因此React16架构分为三层

- Scheduler(调度器)——调度任务优先级，高优先级先进入Reconciler
- Reconciler(协调器)——找出变化组件，render阶段，此阶段调用组件的render方法
- Renderer(渲染器)——将变化组件重新渲染，commit阶段，将render阶段提交的信息渲染到页面上

render阶段和commit阶段统称为work，即React在工作中，如果任务正在Schefuler中调度，则不属于work

##### Scheduler

[requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)API可以实现在浏览器空闲时发出通知，但浏览器兼容性、触发频率等都有问题，React实现了Scheduler，除了在空闲时触发回调功能外，还提供了多种调度优先级供任务设置

##### Reconciler

内部采用Fiber架构

React15的组件发生变化时，Reconciler通过递归处理虚拟DOM；React16将递归变为可中断的循环过程，每次循环都会调用shouldYield判断当前是否有剩余时间

```js
function workLoopConcurrent () {
	while (workInProgress !== null && !showldYield()) {
		workInProgress = performUnitOfWord(workInProgress)
	}
}
```

React16中，Reconciler和Renderer不再是交替工作，Scheduler将任务交给Reconciler后，Reconciler会为变化的虚拟DOM打上代表增/删/更新的[标记](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js)，当所有组件都完成Reconciler工作后，统一交给Renderer进行渲染，因此不会出现DOM渲染不完全的现象

##### Renderer

根据Rconciler为虚拟DOM打的标记，同步执行对应的DOM操作

#### Fiber架构

##### 代数效应（Algebraic Effects）——云里雾里

函数式编程概念，用于将副作用从函数调用中分离，使函数关注点保持纯粹

##### Fiber——纤程

React内部实现的一套状态更新机制。支持任务不同优先级，可中断与恢复，并且恢复后可以复用之前的中间状态

##### 含义

1. 作为架构来说，React15的Reconciler采用递归方式执行，数据保存在递归调用栈中，被称为Stack Reconciler，React16的Reconciler基于Fiber节点实现，被称为Fiber Reconciler
2. 作为静态的数据结构来说，每个Fiber节点对应一个React Element，保存组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息
3. 作为动态的工作单元来说，每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入/被更新...）

##### 结构

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性 保存组件相关信息
  // Fiber对应的组件类型 Function/Class/Host
  this.tag = tag;
  // key
  this.key = key;
  // 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
  this.elementType = null;
  // 对应FunctionComponent，指函数本身，对于Class Component，指class，对于HostComponent，指DOM节点tagName
  this.type = null;
  // Fiber对应的真实DOM节点
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  // 指向父级Fiber节点
  this.return = null;
  // 指向子Fiber节点
  this.child = null;
  // 指向右边第一个兄弟Fiber节点
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性 本次更新相关的信息
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  // 保存本次更新会造成的DOM操作
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

每个Fiber节点都对应一个React element，多个Fiber节点生成一颗Fiber树(由return、child、sibling三个属性共同维护)，Fiber树就对应了DOM树

##### Fiber的工作原理

双缓存——在内存中构建并直接替换的技术

React使用双缓存来完成Fiber树的构建与替换——对应着DOM树的创建与更新

##### 双缓存Fiber树

current Fiber**上次渲染构建的 Fiber 树**

workInProgress Fiber **正在执行更新的 Fiber 树**

React中最多同时存在两颗Fiber树，当前页面渲染的Fiber树被称为current Fiber树，对应节点称为current fiber，正在内存中构建的Fiber树称为workInProgress Fiber树，对应节点称为workInProgress fiber，他们之间通过alternate属性连接

```js
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

React应用根节点通过使current指针在不同Fiber树的rootFiber间切换来完成current Fiber树指向的切换；即当workInProgress Fiber树构建完成交给Renderer渲染在页面上后，应用根节点的current指针指向workInProgress Fiber树，此时workInProgress树就变为current Fiber树

每次状态更新都会产生新的workInProgress Fiber树，通过current与workInProgress的替换，完成DOM的更新

##### mount时的构建/替换过程

1. 首次执行ReactDom.render()会创建fiberRootNode（源码中叫fiberRoot）和rootFiber，fiberRootNode是整个应用根节点，rootFiber是<App />组件的根节点；

   fiberRootNode是整个应用的根节点，只有一个；而通过ReactDom.render()可以创建不同的组件树，他们拥有不同的rootFiber

   fiberRootNode的current会指向当前页面正在渲染的Fiber树，即current Fiber树

   ```js
   fiberRootNode.current = rootFiber;
   ```

   由于是首屏渲染，页面中没有任何DOM，所以当前current Fiber树为空

2. render阶段，根据组件返回的JSX在内存中依次创建Fiber节点并连接在一起形成Fiber树（构建时会复用current FIber中已有的Fiber节点内的属性），就是workInProgress Fiber树

3. commit阶段，workInProgress FIber构建完成渲染到页面，fiberRootNode的current指针指向workInProgress Fiber树使其称为current Fiber树

##### update时的构建/替换过程

1. 当状态改变时，进入render阶段，构建新的workInProgress Fiber树（可以复用current FIber树对应的节点数据）
2. commit阶段，渲染页面，current指针重新分配
