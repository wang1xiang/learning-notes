#### 技巧

平时经常逛掘金，再掘金上看到这种实现方式，所以记录下来

我看了 element 源码都是 border-box 这样做的

#### CSS3 新特性

- 常规 动画 盒子模型 响应式布局

#### 谈一谈你对 BFC/IFC 的理解

> BFC 全称 Block Formatting Context，即块级格式化上下文，是为盒子准备的一套渲染规则

##### 格式化上下文 formatting Context

- 用于决定渲染文档的一个区域
- 不同的盒子使用不同的格式化上下文来布局
- 每个格式化上下文都拥有一套不同的渲染规则，决定其子元素将如何定位，以及和其他元素的关系和相互作用
- 常见的格式化有以下几种：
  1. Block formatting context BFC
  2. Inline formatting context IFC
  3. Grid formatting context GFC
  4. Flex formatting context FFC

##### 触发 BFC

只要元素满足下面任一条件即可触发 BFC 特性：

- 根元素（html）或其他包含它的元素
- 浮动元素：float 除 none 以外的值
- 绝对定位元素：position (absolute、fixed)
- 非块级盒子的块级容器：display 为 inline-block、table-cells、flex
- overflow 不为 visiable 的块级盒子（hidden auto scroll）

##### BFC 的特性

- 盒子从顶部开始垂直排列
- 两个相邻的盒子之间的垂直距离由外边距 margin 决定
- 块级格式化上下文中相邻的盒子之间的垂直边距折叠
- 每个盒子的左外边与容器的左边接触（从右向左格式化则相反），即使存在浮动也是如何，除非盒子建立了新的块级格式化上下文
- 形成了 BFC 的区域不会与 float box 重叠
- 计算 BFC 的高度时，浮动子元素与参与计算

##### 使用 BFC 解决问题

- 页面广告使用 BFC 创建，设置 position:absolute 或 position:fixed

- 同一个 BFC 下外边距会发生折叠

```html
<head>
  <style>
    div {
      width: 100px;
      height: 100px;
      background: #c30;
    }
  </style>
</head>
<body>
  <div></div>
  <div></div>
</body>
```

因为两个容器都处于同一个 BFC 容器（body）下，所以第一个 div 下边距和第二个 div 上边距发生重叠，两个盒子距离只有 100px
如果要避免外边距重叠，需要将其放在不同的 BFC 容器内

#### 标准盒子和怪异盒子

- 标准盒子 W3C 盒子模型 一个块的宽度 = width + margin + padding + border
- 怪异盒子 IE 盒子模型 浏览器 width 属性不是内容的宽度，而是内容、内边距、和边框的宽度总和 一个块的宽度 = width + margin IE9 以下触发

```html
<style>
  * {
    margin: 0;
    padding: 0;
  }
  /* 没有box-sizing属性时child宽度为100px 加上box-sizing属性时宽度为70px */
  .parent {
    height: 100px;
    width: 100px;
    padding-left: 10px;
    padding-right: 20px;
    margin: 10px 15px;
    height: 50px;
    box-sizing: border-box;
    background-color: tomato;
  }
  .child {
    width: 100%;
    height: 100px;
    background-color: aqua;
  }
</style>
</head>
<body>
<div class="parent">
  <div class="child"></div>
</div>
</body>
```

#### CSS3 新增伪类

- 伪类是为了弥补常规 CSS 选择器的不足，以便获取到更多信息
- 伪元素本质是创建一个有内容的虚拟容器
- css3 为了区分伪类和伪元素，伪元素采用双冒号写法。

常见伪类：:first-child :hover :link :active :focus :not() :target

常见伪元素：::first-letter(向文本第一个字母添加特殊样式) ::first-line(向文本首行添加特殊样式) ::before(在元素之前添加内容) ::after(在元素之后添加内容)

##### 清除浮动

- 高度坍塌：浮动元素会脱离文档流，所以对于其处于正常文档流中的父元素，无法获知其高度，导致父元素自身的高度坍塌

- 给父元素设置 height 高度

- 额外的标签设置 clear:both，增加额外的标签

- 最常见的方法，元素尾部自动清除浮动

  ```css
  .cf:after {
    content: " ";
    display: block;
    overflow: hidden;
    height: 0;
    clear: both; // 元素左右两侧均不允许有浮动元素
  }
  ```

- overflow: hidden

  使用 overflow：hidden 时，实际就是创建一个块级格式化上下文，计算块级格式化上下文高度时，浮动元素也会计算，因此，父元素在计算其高度时，加入了浮动元素的高度，就达到了清除浮动的效果

#### CSS 实现隐藏页面效果

- display：none 元素隐藏，从渲染树中消失，不占据页面位置
- visible:hidden 隐藏元素，不会从渲染树消失，占据空间
- display 会造成页面回流，而 visibility 只会造成重绘
- opacity：0 将元素设置为透明，但占据页面位置，子元素会继承父元素透明度，使用 rgba 解决继承问题

#### link 和@import 区别

- link 是 HTML 元素，而@import 是 css 提供的
- 页面被加载时，link 同时加载，而@import 引用的 css 会等页面加载完后在加载
- @import，IE6 以上支持
- link 方式权重大于@import 的

#### 选择器优先级

- !important 优先级最高，权值无穷大
- style 写在元素行的内联样式其次，权值 1000
- id 选择器，权值 100
- class/伪类/属性，权值 10
- 标签选择器，权值 1
- 通配符，权值 0
- 1.越具体，优先级越高 2.写在后面的，会覆盖写在前面的
  3.important 优先级最高，但是要少用

#### px 和 em、rem 的区别

- px 和 em 都是长度单位

- px 值是固定的相对于屏幕分辨率，指定多少就是多少
- em 值是不固定的，浏览器的默认字体 16px，，并且 em 会继承父级元素的字体大小
- 设置 em 值：body 中设置 font-size 为 62.5%，将原来的 px 除以 10，换位 em 单位，重新计算被放大的字体的 em 数值，避免字体大小的重复声明
- rem 是 css3 的一个相对单位（root em），与 em 区别是设置字体大小时，相对根元素设置

#### 浏览器设置小字体

- 设置 body 的 font-size 属性，默认字体是 16px，1em=16px，1px=0.625em，设置 font-size 的换算，在 body 中设置 font-size:62.5%，这样 16px\*0.625=10px，1em=10px
- 使用 transform，scale 属性设置，会影响元素位置

#### css sprite 是什么，优缺点

- 将多个图片拼接到一个图片中，通过改变 background-position 和元素尺寸调节需要显示的背景图案
- 优点：减少 http 请求次数，提高页面加载速度
- 缺点：生成图片和维护麻烦

#### CSS3 新特性

- 圆角 border-radius
- 阴影和反射
- 文字特效 text-shadow
- 线性渐变
- 旋转 transform

#### position 的值， relative 和 absolute 定位原点是

- `absolute`：生成绝对定位的元素，相对于 `static` 定位以外的第一个父元素进行定位
- `fixed`：生成绝对定位的元素，相对于浏览器窗口进行定位
- `relative`：生成相对定位的元素，相对于其正常位置进行定位
- `static` 默认值。没有定位，元素出现在正常的流中
- `inherit` 规定从父元素继承 `position` 属性的值

#### 如果需要手动写动画，你认为最小时间间隔是多久，为什么？

多数显示器默认频率是`60Hz`，即`1`秒刷新`60`次，所以理论上最小间隔为`1/60*1000ms ＝ 16.7ms`

#### 简述 transform，transition, animation 的作用

- transform 是变化，包括拉伸，压缩，旋转，偏移等等。
- transition 是过渡，在 hover 或者 click 的时候，改变各种 css 属性时，实现平滑过渡，而不是瞬间改变
- animation 是动画，属性能够改变元素的位置和各种 css 属性

#### inline 和 inline-block 的区别

- block 元素可以包含 block 元素和 inline 联元素；但 inline 元素只能包含 inline 元素。
- block 元素通常被现实为独立的一块，前后之间会换行；inline 元素则不会产生换行。
- 在 css 盒式模型中，inline 盒式模型将不支持对 margin, width, height, max/min-width/height 等属性的垂直响应，而 block 盒式模型则支持。

- inline-block 将会使元素成为一个 inline 元素（如后跟内联元素，将不会换行），但本身却扔支持 block 元素的属性。

#### inline 和 block 区别

- inline：1.行内不换行 2.行内元素不可以设置大小 3.大小由内容决定
- block：1.独立成行 2.可设置大小 3.宽度继承父类的宽度

#### 行内元素 float:left 后是否变为块级元素？

浮动后，行内元素不会成为块状元素，但是可以设置宽高。行内元素要想变成块状元素，占一行，直接设置`display:block`;。但如果元素设置了浮动后再设置`display:block`;那就不会占一行。

#### Grid 布局

网格布局：将应用程序分割成不同的空间，定义他们的大小、位置和层级

与 fiex 区别：

- flex 属于一维布局，而 grid 属于二维布局

- display:grid；网格布局，里面的内容是网格项

- 容器属性

  ```css
  .wrapper {
    display: grid;
    /* 声明三列、宽度分别为200px 可以使用repear(3, 200px)代替 repeat(auto-fill, 200px)表示列宽200，列的数量根据浏览器宽度设置 */
    grid-template-columns: 200px 200px 200px;
    /* grid-row-gap grid-column-gap表示行间距和列间距*/
    grid-gap: 5px;
    /* 声明两行 行高*/
    grid-template-rows: 500px 500px;
  }
  ```

#### 实现正方形

margin、padding 百分比是相对于父级宽度还是自身的宽度

```html
style { .outer { width: 200px; height: 200px; display: flex; justify-content:
center; align-item: center; background: #c30; } .inner { padding: 25%; } }
<div id="outer">
  <div id="inner"></div>
</div>
```

#### CSS 的加载是异步的吗？表现在什么地方？

浏览器加载 css 时将终止页面的样式呈现，也就是加载 css 会阻塞 dom 树的渲染，但并不会阻塞 DOM 树的构建，理解为：在加载 css 同时，也在构建 dom 树，只是没有应用样式

提前加载资源：`rel="preload"` 属性，告诉浏览器这个资源随后会用到，需提前加载好，当浏览器需要时直接从缓存中拿

#### 垂直居中布局

```css
/* 1.文字 */
.container {
  line-height: 20px;
  text-align: center;
}
/* 2.Flex布局 */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 3.Flex + margin布局 */
.container {
  display: flex;
}
.child {
  margin: auto;
}
/* 4.absolute和负transform */
.container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
/* 5.table布局 */
.container {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
.child {
  display: inline-block;
}
```

#### 三栏布局

```css
/* 1.float + overflow */
.left {
  width: 100px;
  height: 100vh;
  float: left;
  background-color: #dedede;
}
.center {
  overflow: hidden;
  height: 100vh;
  background-color: #fff;
}
.right {
  width: 100px;
  height: 100vh;
  float: right;
  background-color: #dedede;
}

/* 2.position */
.left {
  position: absolute;
  width: 100px;
  height: 100vh;
  left: 0;
  background-color: #dedede;
}
.center {
  position: absolute;
  height: 100vh;
  right: 100px;
  left: 100px;
  background-color: #fff;
}
.right {
  position: absolute;
  width: 100px;
  height: 100vh;
  right: 0;
  background-color: #dedede;
}
/* 3.flex */
.container {
  display: flex;
}
.left {
  height: 100vh;
  width: 100px;
  background-color: #dedede;
}
.center {
  height: 100vh;
  flex: 1;
  background-color: #fff;
}
.right {
  height: 100vh;
  width: 100px;
  background-color: #dedede;
}
/** grid */
.container {
  display: grid;
  height: 300px;
  grid-template-columns: 100px auto 100px;
}
```

#### 两栏布局

```css
/* 1.flex布局 */
.container {
  display: flex;
}
.left {
  background: #e8e8e8;
  width: 100px;
  height: 100vh;
}
.right {
  flex: 1;
  background: #dedede;
  height: 100vh;
}

/* 2.float + margin */
.left {
  background: #e8e8e8;
  width: 100px;
  height: 100vh;
  float: left;
}
.right {
  background: #dedede;
  height: 100vh;
  margin-left: 100px;
}

/* 3.float + overflow */
.left {
  background-color: #e8e8e8;
  height: 100vh;
  width: 100px;
}
.right {
  background-color: #dedede;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* 4.float + calc */
.left {
  background-color: #e8e8e8;
  height: 100vh;
  width: 100px;
}
.right {
  background-color: #dedede;
  height: 100vh;
  width: calc(100% - 100px);
}
/* 5.表格布局 */
.wrap {
  display: table;
  width: 100vh;
}
.left {
  display: table-cell;
  width: 200px;
}
.right {
  display: table-cell;
}
```
