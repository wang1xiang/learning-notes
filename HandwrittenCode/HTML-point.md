#### HTML5 新特性、语义化

##### 新特性

- 新的 DOCTYPE 声明<!DOCTYPE html>

- 新增 vedio 和 audio 标签

- 绘画 `canvas`

- 语意化更好内容元素

  article、footer、header、nav、section

- 表单控件

  calendar、date、time、email、url

- 新的技术

  webworker、websocket、Geolocation

- 本地离线存储 `localStorage` 长期存储数据，浏览器关闭后数据不丢失

- `sessionStorage` 的数据在浏览器关闭后自动删除

##### 语义化

- 用正确的标签做正确的事

- 计算机能快速读懂内容，高效处理信息，对搜索引擎更友好
- 页面结构清晰
- 有利于 SEO
- 方便其他设备解析
- 便于团队开发和维护，语义化更具有可读性

##### 区分 HTML 和 HTML5

- 声明不同，HTML5<!DOCTYPE html>，HTML 很长一段
- 结构语义不同，HTML5 有很多新的标签，而 HTML 没有体现结构语义的标签，用<div id="header"></div>来表示网站头部

##### DOCTYPE 作用

<!Doctype>声明位于文档中的最前面，处于<html>标签之前。告知浏览器的解析器，用什么文档类型规范来解析这个文档。

##### HTML5 离线缓存原理

- 用户没有网络时可正常访问站点或应用，当用户有网络时，更新用户机器上的缓存文件

- 原理：离线缓存技术基于`.appcache`文件，通过此文件的解析清单离线存储资源，这些资源像 cookie 一样被存储下来，之后再网络离线状态下，浏览器会通过被离线存储的数据进行页面展示

- 使用：页面头部添加 manifest 属性，在 cache.mainfest 文件的编写离线存储的资源

  ```htlm
  CACHE MANIFEST
  #v0.11
  CACHE:
  js/app.js
  css/style.css
  NETWORK:
  resourse/logo.png
  FALLBACK:
  / /offline.html
  ```

##### 处理 HTML5 离线储存资源

- 在线时，浏览器发现 html 头部有 manifest 属性时会请求 manifest 文件，如果是第一次访问就会根据 manifest 文件内容下载相应的资源进行离线存储，如果已经访问过，浏览器使用缓存的资源加载页面，同时会对比新的 mainfest 文件和旧的 mainfest 是否有改变，决定是否重新下载
- 离线时，浏览器直接使用离线缓存资源

#### cookie，sessionStorage 和 localStorage 的区别

- 区别
  cookie 是网站为了标示用户身份存在用户本地终端上的数据（经过加密）
  cookie 数据始终在同源的 htto 请求中携带（即使不需要），即会在浏览器和服务器之间传递
  sessionStorage 和 localStorage 不会自动把数据发给服务器，仅在本地保存

- 存储大小
  cookie 大小不能超过 4k
  sessionStorage 和 localStorage 也有大小要求，5m
- 过期时间
  localStorage: 永久储存，手动删除
  sessionStorage：窗口关闭自动删除
  cookie：设置的 cookie 过期时间之前一直存在浏览器内核

- IE: trident 内核
- Firefox：gecko 内核
- Safari：webkit 内核
- Opera：以前是 presto 内核，Opera 现已改用 Google Chrome 的 Blink 内核
- Chrome：Blink(基于 webkit，Google 与 Opera Software 共同开发)

##### 理解

- 主要分成两部分：渲染引擎(`layout engineer`或`Rendering Engine`)和`JS`引擎
- 渲染引擎：负责取得网页的内容（`HTML`、`XML`、图像等等）、整理讯息（例如加入`CSS`等），以及计算网页的显示方式，然后会输出至显示器或打印机。浏览器的内核的不同对于网页的语法解释会有不同，所以渲染的效果也不相同。所有网页浏览器、电子邮件客户端以及其它需要编辑、显示网络内容的应用程序都需要内核
- `JS`引擎则：解析和执行`javascript`来实现网页的动态效果
- 最开始渲染引擎和`JS`引擎并没有区分的很明确，后来 JS 引擎越来越独立，内核就倾向于只指渲染引擎

#### Canvas 和 SVG 区别

- svg 绘制除的图形元素都是独立的 DOM 节点，能方便的绑定事件和用来修改；canvas 输出是一整幅画布
- svg 输出的图形的矢量图形，放大缩小不受影响，canvas 输出的是标量画布，像一张图片一样放大缩小会失真或者锯齿
- svg 使用 xml 文档来描述绘图，canvas 是 HTML5 提供的绘图 API，通过 getContent 方法获取画笔才可绘图

#### 使用 date-的好处

- 自定义属性可以统一化
- 维护方便，页面结构清晰

#### meta 标签

- charset 声明文档字符编码
- description、keywords、author 等页面描述
- viewport 为移动设备添加 viewport
- cache-control、expires 设置页面缓存状态

### attribute 和 property 的区别是什么？

- attribute 是 dom 元素在文档中作为 html 标签拥有的属性
- property 是 dom 元素在 js 中作为对象拥有的属性
- 对于 html 标准属性来说，attribute 和 property 是同步的，会自动更新
- 对于自定义属性来说是不同步的

#### 页面显示 HTML 过程

过程：构建 dom 树-->构建 render 树-->布局 render 树-->绘制 render 树

- 浏览器加载 html 文件，自上而下，构建 DOM 树
- 遇到请求外部资源（css、图片等）时，不影响 DOM 树的加载，请求时异步的
- 解析 CSS 文件构建渲染树，等渲染树构建完成，浏览器开始布局渲染树并绘制到屏幕上（css 放在最上面，浏览器预先加载 css 后，可以不必等待 HTML 加载完毕就可以渲染页面了），此时会涉及：reflow 回流和 repain 重绘
  - reflow 回流：DOM 节点中元素都是以盒模型的形式存在，需要浏览器去计算其位置和大小，此过程称为回流
  - repain 重绘：当盒模型的位置、大小及其他属性（字体、颜色等）确定后，浏览器便开始绘制内容，此过程称为重绘
- 页面首次访问必然会经历 reflow 和 repain，这两个过程非常消耗性能，尤其在移动设备上，所以应尽量减少 reflow 和 repain
- 当文档挂载过程遇到 js 文件，html 文档会挂起渲染的线程，等待 js 文件加载完毕并解析执行完成，才可以恢复 html 文档的渲染线程（JS 可能会修改 DOM，意味着，在 js 执行完成前，后续所有资源加载可能时没有必要的，这是 js 阻塞后续资源下载的根本原因，所以 js 会放在文档末尾）
- JS 的解析有浏览器的 js 引擎完成，例如 v8 引擎

#### 常见 web 安全及防护原理

- sql 注入原理：将 sql 插入到 web 表单提交或输入域名或页面请求的查询字符串，最终达到欺骗服务器进行恶意的 SQL 命令
- xss 原理及规范：跨站脚本（cross-site scripting）攻击指攻击者往 web 页面插入恶意 html 标签或 javascript 代码，使用户访问都会执行相应的嵌入代码，从而获取用户资料等。比如：攻击者在论坛中放一个看似安全的链接，骗取用户点击后，窃取`cookie`中的用户私密信息；或者攻击者在论坛中加一个恶意表单，当用户提交表单的时候，却把信息传送到攻击者的服务器中，而不是用户原本以为的信任站点
  CSP 内容安全策略：建立白名单，告诉浏览器哪些外部资源可以加载和执行，只需要配置规则，如何拦截是浏览器自己实现的
  - 设置 heep header 中的 Content-Security-Policy: default-src 'self' img-src child-src
  - 设置 meta 标签 http-equiv="content-Securoty-Policy"
- csrf 原理：跨站请求伪造（cross-site reqiest forgery），挟制用户在当前已登录的 web 应用程序上执行非本意的操作的攻击方法。就是说冒充用户发起请求，完成一些违背用户意愿的请求
  - 添加 TOKEN 验证
  - 在 HTTP 头部添加令牌信息
  - 阻止第三方网站请求接口
- `XSS`是获取信息，不需要提前知道其他用户页面的代码和数据包。`CSRF`是代替用户完成指定的动作，需要知道其他用户页面的代码和数据包

#### 说一下强制缓存和协商缓存

> 缓存指在本地磁盘中对访问过的资源保存的副本文件

- 请求过程：浏览器在第一次请求后缓存资源，再次请求时，会进行下面两个步骤
  浏览器会获取该缓存资源的 header 中的信息，根据 response header 中的 expires 和 cache-control 来判断是否命中强缓存，如果命中则直接从缓存中获取资源。

  如果没有命中强缓存，浏览器就会发送请求到服务器，这次请求会带上 IF-Modified-Since 或者 IF-None-Match, 它们的值分别是第一次请求返回 Last-Modified 或者 Etag，由服务器来对比这一对字段来判断是否命中。如果命中，则服务器返回 304 状态码，并且不会返回资源内容，浏览器会直接从缓存获取；否则服务器最终会返回资源的实际内容，并更新 header 中的相关缓存字段。

- 强缓存：不会像服务器发送请求，直接从缓存中读取资源，状态为 200
  Expires：过期时间，GMT（格林尼标准时间，世界标准时间，0 时区，北京处于东 8 区，所以北京时间=GMT 时间+8 小时）格式时间点字符串（Expires:Mon,18 Oct 2066 23:59:59 GMT）代表资源失效时间，浏览器再次请求加载资源时，如果在这个过期时间内，则命中强缓存
  Cache-Control：以 max-age 值来判断，相对时间（Cache-Control:max-age=3600）代表资源有效期为 3600s，返回头中 Date 标识消息发送时间，表示当前资源在 Date - Date + 3600s 时间段内都有效
  no-cache 不使用本地缓存，使用协商缓存
  no-store 直接禁止浏览器缓存数据，每次加载资源都会想服务器要完整的资源，类似于 network 中的 disabled cache
  public 可以被所有用户缓存，包括终端用户和 cdn 等中间件代理服务器
  private 只能被终端用户浏览器缓存
  如果 cache-control 与 expires 同时存在的话，cache-control 的优先级高于 expires。

- 协商缓存：由服务器决定缓存资源是否可用。第一次请求时会带着 Last-Modified 或 Etag，后续请求则会带着对应的请求字段 If-Modified-Since 或者 If-None-Match，若响应头没有 Last-Modified 或 Etag 字段时，则响应头也不会有对应的字段
  Last-Modified/If-Modified-Since：标记文件最后修改时间，下一次请求时，请求头会带上 If-Modified-Since 值就是 Last-Modified 告诉服务器本地缓存的文件最后修改时间，判断资源是否有变化，无变化时直接返回 304，浏览器直接使用本地缓存；有变化时正常返回请求资源内容，新的 Last-Modified 会在 response header 中返回，并在下次请求时更新本地缓存的 Last-Modified
  Etag/If-None-Match：服务器为每个资源生成一个 hash 值，资源有变化值就会改变，并将 ETag 字段返回给浏览器，服务器接收到 If-None-Match 后，比较两者是否一致来判定文件内容是否改变。每次都会返回 ETag
- 共同点
  都是从客户端缓存中读取资源，区别是强缓存不发请求，协商缓存发请求
- 区别
  强缓存不需要向服务器发请求，协商缓存有服务器决定是否使用缓存，存在依次通信
  强缓存状态码是 200（from cache），而协商缓存如果命中缓存的话，状态码是 304（not modified）
  from cache 分为 from memory cache 和 from disk cache，从内存中获取最快，但是是 session 级别的缓存，关闭浏览器之后就没有了。

- 优先级
  Cache-Control > expires > Etag > Last-Modified

- 最后总结一下浏览器的三级缓存原理：
  先去内存看，如果有，直接加载
  如果内存没有，择取硬盘获取，如果有直接加载
  如果硬盘也没有，那么就进行网络请求
  加载到的资源缓存到硬盘和内存
  Ctrl + F5 强制刷新的时候，会暂时禁用强缓存和协商缓存。

- 配置
  ```js
  // 1.服务端配置
  res.setHeader('max-age': '3600 public')
  res.setHeader(etag: '5c20abbd-e2e8')
  res.setHeader('last-modified': Mon, 24 Dec 2018 09:49:49 GMT)
  // 2. nginx配置
  add_header Cache-Control "max-age=3600"
  ```

#### 什么是预加载和懒加载

- 预加载：提交加载资源，当用户需要时可直接从本地缓存中渲染
- 懒加载：主要目的是作为服务器前端的优化，减少请求次数或延迟请求
- 行为相反，一个是提前加载，一个是迟缓甚至不加载
- 懒加载对服务器有一定的缓解压力作用，而预加载会增加服务器前端压力
