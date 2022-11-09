#### 标准盒模型和 IE（替代）盒模型

- 两种盒模型都是由 content + padding + border + margin 组成，大小都是由 content + padding + margin 组成，盒的宽 width/高 height 计算会有不同
- 标准盒模型 只包含 content 即`width: 100px`时，只包含内容不包含 padding 和 border
- IE 盒模型 包含 content + padding + border，即`width: 100px`时，`content + padding + border = 100`
- box-sizing 设置 默认是 content-box 一般会设置为 border-box（IE 盒模型）

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

##### 重排 reflow 和重绘 repaint 理解

- 重排：无论通过什么方式影响了元素的几何信息（元素在视口内的位置和尺寸大小），浏览器需要重新计算元素在视口内的几何属性，这个过程叫做重排
- 重绘：通过渲染构造树和重排阶段，我们知道哪些节点是可见的、以及他们的样式和具体的几何信息，接下来就可以将渲染树的每个节点都转换为屏幕上的实际像素，这个阶段叫做重绘

##### 何时发生重排重绘

当页面布局和几何信息发生变化时就会触发重排

- 页面开始渲染的时候
- 添加或删除可见（display:none 除外）的 DOM 元素
- 元素位置、尺寸发生变化
- 内容发生变化
- 浏览器窗口尺寸发生变化的时候（因为重排是根据视口的大小来计算元素的位置和大小的）
- 重排一定会触发重绘，重绘不一定会重排

##### 如何减少重排和重绘

- 最小化重排和重绘：比如样式集中改变
- 使用 absolute 或 fixed 使元素脱离文档流
- 开启 GPU 加速，如改变位置时不使用 left、top 等，使用 transform，不会触发重排或重绘。transform 使浏览器为元素创建一个 GPU 图层，这使得动画元素在一个独立的层中进行渲染，当元素的内容没有发生改变时，就没有必要进行重绘

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
- visible:hidden 隐藏元素，不会从渲染树消失，占据空间，不会响应绑定的监听事件
- display 会造成页面重排，而 visibility 只会造成重绘
- display 不继承 子元素会随着父元素一起消失，修改子元素的 display 属性无效，而 visibility 是继承属性，修改子元素 visibility 可以让子元素显示
- opacity：0 将元素设置为透明，但占据页面位置，并且会相应绑定的监听事件，子元素会继承父元素透明度，使用 rgba 解决继承问题
- z-index 设置负值 使其他元素遮挡此元素 实现隐藏
- transform: scale(0) 将元素缩放为 0，占据位置但不会响应事件

#### link 和@import 区别

- link 是 HTML 标签，而@import 是 css 提供的，只能加载 css
- 页面被加载时，link 同时加载，而@import 引用的 css 会等页面加载完后在加载
- @import，低版本浏览器不支持
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

#### flex 布局

flex 布局是 CSS3 新增的一种布局方式，可以通过将一个元素的 display 属性值设置为 flex 从而使它成为一个 flex 容器，它的所有子元素都会成为它的项目。一个容器默认有两条轴：一个是水平的主轴，一个是与主轴垂直的交叉轴。可以使用 flex-direction 来指定主轴的方向。可以使用 justify-content 来指定元素在主轴上的排列方式，使用 align-items 来指定元素在交叉轴上的排列方式。还可以使用 flex-wrap 来规定当一行排列不下时的换行方式。对于容器中的项目，可以使用 order 属性来指定项目的排列顺序，还可以使用 flex-grow 来指定当排列空间有剩余的时候，项目的放大比例，还可以使用 flex-shrink 来指定当排列空间不足时，项目的缩小比例。

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

#### 什么是物理像素、逻辑像素和像素密度，为什么在移动端开发需要用到 2x、3x 这种图片

- 逻辑像素：以 iPhone XS 为例，当写 CSS 代码时，对于宽度 px 其对应的宽度为 414px\*896px，如果给一个 div 宽度为 414px 时会填满屏幕
- 物理像素：用尺子实际测量 1242\*2668，经计算可得：1242/414=3，也就是一个逻辑像素=3 个物理像素，就说这个屏幕的像素密度为 3，也就是常说的 3 倍屏
- 要是图片不失真，一个图片像素至少对应一个物理像素，假如图片原始是 5000 像素，则在 3 倍屏上需要 15000 个像素才能保证一个物理像素至少对应一个图片像素，才能不失真
- 可以使用 css 媒体查询判断不同的像素密度，从而选择不同的图片

  ```css
  @media only screen and (min-device-pixel-ratio: 1.5) {
    #my-image {
      background: (high.png);
    }
  }
  ```

#### css 优化或提高性能的方法有哪些

1. CSS 压缩：减少文件体积
2. CSS 单一样式：`margin: 0 0 12px 12px`修改为`margin-bottom:12px`
3. 减少@import，建议使用 link，@import 是等待页面加载完成后再加载

#### CSS 预处理器/后处理器是什么？

- 预处理器

  像 less、sass、stylus 等预编译，增加 CSS 代码的复用性、变量、循环、函数等，对编写组件极为方便

- 后处理器

  postCss，通常是完成在样式表中根据 css 规范处理 css，让其更加有效。如：postcss 的 autoprefixer 插件为 css 属性添加浏览器私有前缀，实现跨浏览器兼容性问题；类似于 babel，编译尚未被浏览器广泛支持的先进 css 语法

#### 单行、多行文本溢出隐藏

- 单行文本溢出

  ```css
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ```

- 多行文本溢出

  ```css
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box; // 使用弹性绳索盒子模型显示
  -webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式：从上到下垂直排列
  -webkit-line-clamp: 3; // 显示的行数
  ```

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
/* 浮动 左侧元素固定，left浮动 右侧width: auto */
.container {
  height: 100px;
}
.left {
  width: 100px;
  height: 100%;
  float: left;
}
.right {
  height: 100%;
  margin-left: 100px;
}
/* 同样利用浮动 设置右侧元素overflow 右侧触发BFC BFC不会与浮动元素发生重叠 */
.right {
  overflow: hidden;
  height: 100%;
}

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

#### 实现一个三角形

css 绘制三角形只要用到边框 border，平常设置很窄，误以为边框是由矩形组成的，实际上 border 是由三角形组成的

```css
.container {
  width: 0;
  height: 0;
  border: 100px solid;
  border-color: yellowgreen skyblue pink blue;
}
```

总体的原则就是通过上下左右边框来控制三角形的方向，用边框的宽度比来控制三角形的角度

```css
.top {
  border-top: 100px solid yellowgreen;
  border-right: 100px solid transparent;
  border-left: 100px solid transparent;
}
.left {
  border-left: 100px solid blue;
  border-top: 100px solid transparent;
  border-bottom: 100px solid transparent;
}
.top-left {
  border-top: 100px solid red;
  border-right: 100px solid transparent;
}
```

#### 实现扇形

类似于实现三角形的过程，只不过需要加上 border-radius

```css
.sector {
  border: 100px solid;
  border-color: yellowgreen skyblue pink blue;
  /* border-radius设置100%时是相对于自身 其余一般都是相对于父元素百分比 */
  border-radius: 100px;
}
```

#### 实现宽高自适应正方形

- 使用 vw 实现

  ```css
  .square {
    width: 10%;
    height: 10vw;
    background-color: #c30;
  }
  ```

- 使用 margin/padding 是相对于父元素的宽度实现

  ```css
  .square {
    width: 10%;
    height: 0;
    /* padding-bottom: 10%; */
    padding-top: 10%;
    background-color: #c30;
  }
  ```

#### 画一条 0.5px 的线

- 利用 transform 实现

  ```css
  .line {
    width: 100px;
    height: 1px;
    background-color: #c30;
    transform: scale(1, 0.5);
  }
  ```

- 使用 viewport 属性，只适用于移动端

  ```css
  <meta name="viewport" content="width=device-width, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5"/>
  ```

#### 设置小于 12px 的字体

谷歌浏览器最小字体为 12px，小于 12px 时显示的都是 12px，利用 transform 实现

#### 如何解决 1px 问题

1px 问题：在一些机型上，移动端的 1px 很展示很粗，原因是 css 的 1px 并不能和移动设备的 1px 划等号，有一个专门的属性来描述

```js
window.devicePixelRatio = 设备的物理像素 / css像素;
```

如在 iphone6/7/8 上，`window.devicePixelRatio=2`，也就是说 1px 的 css 像素是使用 2px 的物理像素来渲染，所以很比 1px 粗一些

解决 1px 问题

1. 通过 js 拿到`window.devicePixelRatio`值

   ```jsx
   <div id="container" data-device={{window.devicePixelRatio}}></div>
   ```

2. css 属性设置

   ```css
   .container[data-device="2"] {
     border: 0.5px solid #333;
   }
   ```
