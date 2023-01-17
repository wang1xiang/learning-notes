## 组件基础

### React 是什么

React 是一个网页 UI 框架，通过组件化的思想解决视图层开发复用的问题。
它的核心设计思路有三点：声明式、组件化和通用性

- 声明式：以声明式编写 UI，可以使代码更加可靠，方便调试
- 组件化：在于视图的拆分与模块复用，做到高内聚低耦合
- 通用性：在于一次学习随处编写，比如 React-DOM、React-Native 开发原生应用、node 进行服务端渲染

这使得 React 的适用范围比较广，无论是 web 或者 native 都可以进行开发，这也是 React 的优势所在。

### 为什么使用 JSX

同类问题：为什么使用 xxx，为什么是 xxx

1. 核心概念
   JSX 是 javaScript 的语法拓展，结构类似于 XML，清晰简洁，react 中并不强制使用 JSX，即便使用了也会在构建过程中利用 babel 插件便以为 react.createElement，所以 JSX 是 react.createElement 的一个语法糖
2. 与其他方案对比
   vue 的 template 模板，react 团队认为引入模板是及其不佳的实践，引入更多的概念，如模板语法、模板指令等
   模板字符串：代码结构复杂，不利于后期维护

### babel 插件如何实现 jsx 到 js 的编译

Babel 读取代码生成 AST，再将 AST 传入插入层进行转换，在转换的过程中就可以将 JSX 的结构转为 React.createElement 函数

```js
module.export = function (babel) {
  var t = babel.types;
  return {
    name: "custom-jsx-plugin",
    visitor: {
      JSXElement(path) {
        var openingElement = path.node.openingElement;
        var tagName = openingElement.name.name;
        var args = [];
        args.push;
      },
    },
  };
};
```

### 如何避免生命周期的坑

- 在不恰当的时期调用了不合适的代码
- 在需要调用时，却没有调用

#### 挂载

- constructor 类的构造函数，常用于初始化（初始化 state、绑定事件），不推荐处理初始化以外的事情
- getDerivedStateFromProps 在 props 变化时更新 state
  触发时机：props 传入时、state 发生变化时、forceUpdate 被调用时（也就是重新渲染时都会调用 getDerivedStateFromProps)
  官方：你可能不需要使用 getDerivedStateFromProps
- UNSAFE_componentWillMount 废弃： 用于组件加载前做某些操作
  react-fiber 机制下可能会被多次渲染，执行多次
- render 返回渲染内容
- componentDidMount：挂载之后调用，真实 DOM 绘制完成，添加异步请求

#### 更新

外部 props 或 state 发生改变的时候调用

- UNSAFE_componentWillReceiveProps 弃用，功能可被 getDerivedStateFromProps 替代，getDerivedStateFromProps 存在时此生命周期不会执行
- getDerivedStateFromProps，表现如同挂载
- shouldComponentUpdate，性能优化
- UNSAFE_componentWillUpdate 废弃
- render
- getSnapShotBeforeUpdate：返回值作为 componentDidUpdate 的第三个参数

#### 卸载

- componentWillUnmount

#### 函数组件

- 没有生命周期，任何情况都会重新渲染，通过 memo 优化
- memo 并不会阻断渲染，而是跳过渲染组件操作，直接复用最后一次渲染结果

### 函数组件与类组件区别

求同存异

- 相同点

  作为组件而言，class 和 function 在使用上没有任何不同，性能上也不会有明显差异

- 不同点

  类组件基于面向对象编程，主打生命周期核心概念；函数式组件是函数式编程，immutability 没有副作用等特点；
  官方推荐组合优于继承
  性能优化上：类组件依靠 shouldComponentUpdate 阻断渲染、函数式组件依靠 memo 缓存渲染

### 如何设计 React 组件

- 代理组件： 封装常用属性，减少重复代码。 以 AntdButton 为例，封装 button 组件，使用时不必传入 type

  ```tsx
  import { Button as AntdButton } from 'antd';

  const Button = props => <AntdButton type="primary" {...props}></AntdButton>
  export Button
  ```

- 样式组件：也是代理组件，封装样式领域

### 合成事件

React 利用事件委托特性

1. 在 document 上挂上事件监听
2. dom 事件触发后冒泡到 document 上
3. react 找到对应组件，造一个合成事件出来，并按照组件树模拟一遍事件冒泡，造成了在一个页面中只能有一个版本的 react，如果有多个事件会乱套，react17 解决，挂载 reactDom.render 挂载的节点上

### setState 同步异步

- 同步场景

  setTimeout 中

- 异步场景

  react 会将 setState 放入队列中逐一执行，合并 state 数据，完成后执行回调，根据结果更新虚拟 DOM 触发渲染

## 状态管理

### redux

- 单一数据源：整个应用的 state 被存储在一颗 object tree 中
- 纯函数 reducer：为了描述 Action 如何改变状态树，需要编写一个纯函数 Reducer
- state 只读：唯一可改变 state 的方法就是 Action

副作用：如 Ajax 请求异步操作，使函数在执行过程中，产生不同变化，这样与外界的交互统称为副作用，常见的副作用就是发一个网络请求， 需要页面先展示 loading，再根据请求成功与否展示不同的页面

### mobx

mobx5 之前使用 Object.defineProperty，mobx5 之后使用 Proxy

## 渲染流程

### react、react-dom

- react：主要工作是组件实现、更新调度等基层工作
- react-dom：提供在网页上渲染的基础
  正是因为有这样流程，当 react 在开发 IOS、Android 等开发时，只需要通过 React-Native 提供的 Native 层元素渲染即可完成

### 虚拟 DOM 优势

- 大量的直接操作 DOM 容易引起网页性能下降
- React 通过虚拟 DOM 的 diff 算法批量更新 DOM，提升页面性能
- 首次渲染或微量操作的时候会比真实 DOM 慢

### 对比其他框架，react 的 diff 算法有何不同

#### diff 算法

diff 算法是指生成补丁的方式，主要用于虚拟 DOM 树变化更新真实 DOM，所以 diff 算法存在这样一个过程：触发更新 -> 生成补丁 -> 应用补丁

react diff 算法采用深度优先遍历，但传统的方式效率较低，为了优化效率，才用了“分治”的方式，将单一节点比对转换为三种类型节点的比对，分别是：树、组件及元素，以此来提升效率

- 树比对：由于网页视图中很少有跨层级的节点移动，所以两颗虚拟 DOM 树只对同层级节点进行比较
- 组件比对：如果两个组件同一类型则进行树比对，如果不是就放入补丁中
- 元素比对：主要发生在同层级中，通过标记节点操作生成补丁

react16 后引入 fiber 架构，为了使整个过程可暂停恢复，节点与树分别采用了 fiberNode 和 fiberTree 进行重构，fiberNode 可以直接找到兄弟和子节点，更新过程有 current 和 workInProgress 两棵树双缓存完成，workInProgress Tree 更新完成后再根据修改 current 相关指针去指向新的节点

#### 与 vue 比较

- 与 React 相似，未采用 fiber 架构
- react 拥有完整的 diff 算法策略，并且拥有随时中断更新的时间切片能力，在大批量更新节点的极端情况下拥有更友好的交互体验
- vue 整体策略与 react 对齐，但缺乏时间切片能力，但并不意味 vue 性能更差，因为在 vue3 初期引用过，后来收益不高移除了

### 解释 React 的渲染流程

- React 渲染过程大致 15 版本与 16 版本大致一致，但协调阶段不相同，React15 为 Stack Reconciler，16 后为 fiber Reconciler，这个协调过程也就是 React 的 diff 算法。
- Stack Reconciler 核心调度方式是递归，
- Fiber Reconciler 调度方式有两个特点：一是协作式多任务模式，调度线程会被优先级高的主线程打断，通过 requestIdleCallback 实现；二是策略优先级，调度任务通过标记 tag 的方式分优先级，标记为 head 这种可以优先执行，Fiber Reconciler 的基本单位是 fiber，fiber 包含指向父、子和兄弟节点的引用，为 diff 工作的双向链表提供了实现基础，fiber 架构下 生命周期被划分为了 Render 和 commit 阶段，Render 阶段可中断可停止，只要是为了构建 workInProgress Tree 计算出差异，以 current Tree 为基础，将每个 fiber 作为一个基本单位，自下而上的逐个节点检查被构建 workInProgress 树，这个过程不再是递归而是基于循环完成，执行上通过 requestIdleCallBack 来执行任务（work），每个 work 执行完后检查是否有更高优先级任务，有则让位，无则继续；commit 阶段需要处理 Effect 列表，根据 diff 更新 DOM 树，回调生命周期，此阶段同步执行不可中断、暂停，所以一般不要在 componentDidMount、componentDidUpdate、componentWillUnmount 中执行计算量大的任务
- 如果只是一般场景 stack Reconciler 和 fiber Reconciler 差距并不大，但在动画、画布等场景下 Stack Reconciler 会长时间占用主线程，造成卡顿；fiber Reconciler 的设计就能带来高性能的表现

### stack Reconciler 为什么不支持 return 数组

stack Reconciler 是递归遍历的方式，递归的情况下就只能返回一个节点

### React 渲染异常

1. 后端数据是否可靠：可选链操作符
2. 兜底方案：错误边界 ErrorBoundary

性能优化

### 如何避免重复渲染

- 过早的优化是万恶之源
- 保证业务快速上线远比代码质量更为重要
- 重新渲染时发生什么

  当 props 或 state 发生变化时，react 会将返回的元素与之前的元素进行对比，看是否有需要更新真实 DOM

- 工具

  Chrome 自带的 performance 查询 javaScript 执行栈的耗时
  react devTool 的 Profiler 分析组件渲染次数

- 解决方法

  memo 缓存组件、PureComponent、shouldComponentUpdate

### 代码质量

- 可分析性

  - 定期 code Review
  - 代码检查工具：eslint prettier commitlint 等
  - 能快速定位线上代码：Sentry

- 可改变性

  易于拓展、迭代 组件设计

## React Hooks

### React Hook 使用限制

- eslint-plugin-react-hooks 检查
- 不要在循环、迭代中使用

  底层是用链表，应保持顺序

- 只能在函数式组件中使用

  设计初衷就是为了在函数式组件中使用 state

### useEffect 和 useLayoutEffect 的区别

- 相同点

  - 函数签名一致，在源码中调用了同一个函数 useEffect 源码中先调用 mountEffect 接着调用 mountEffectImpl、useLayoutEffect 先调用 mountLayoutEffect 最后还是调用 mountEffectImpl，入参一致，返回值一致，函数签名完全相同
  - 都是用于处理副作用：改变 DOM、设置订阅、操作定时器等

- 不同点

  - useEffect 是异步调用，适合绝大多数场景、useLayoutEffect 是在所有 DOM 变化之后同步调用，用于调整 DOM 操作、调整样式避免页面闪烁等，同步处理所以要避免计算量大的任务
  - 未来趋势上两者并存，没有删减或合并计划，开发者根据情况使用

## React 生态

### React-router

#### 实现原理

- Hash

  切换 hash 的方式，监听浏览器 hash 变化

- History

  依靠 html5 的 history API ，切换网址 path，需要在服务端配置 historyAPIFallback

#### 工作方式

- 设计模式：采用 monorepo 库管理，整体的组件通信上采用 ContextAPI

- Context 容器： Router 与 MemoryRouter，主要提供上下文消费组件
- 直接消费者：提供路由匹配功能，分别是 Route、Switch 和 Redirect
- 与平台关联的功能组件：react-router-dom 中的 link、NavLink 和 react-router-native 中 DeepLinking（app 跳转使用）
