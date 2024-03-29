#### HTML5 新特性、语义化

##### 新特性

- 新的 DOCTYPE 声明<!DOCTYPE html>

- 新增 vedio 和 audio 标签

- 绘画 `canvas` 和 webGL

- 语意化更好内容元素

  article、footer、header、nav、section

- 表单控件

  calendar、date、time、email、url

- 新的技术

  webworker、websocket、Geolocation

- 本地离线存储 `localStorage` 长期存储数据，浏览器关闭后数据不丢失

- `sessionStorage` 的数据在浏览器关闭后自动删除

- DOM 查询操作、querySelector()和 querySelectorAll() .类名/#ID

- 拖放

  设置元素 draggable="true"即可拖放

##### 说一下 web worker

HTML 页面如果执行脚本时，页面状态是不可响应的，而 web worker 是运行在后台的简 js，独立于其他脚本、不会影响页面性能。通过 postMessage 将结果传回到主线程，这样在复杂操作的时候，就不会阻塞主线程了

创建 web worker

1. 检测浏览器是否支持
2. 创建 web worker 文件
3. 创建 web worker 对象

##### 语义化

- 用正确的标签做正确的事

- 计算机能快速读懂内容，高效处理信息，对搜索引擎更友好，有助于爬虫获取更多的有效信息
- 有利于 SEO
- 页面结构清晰，没有 CSS 样式下，页面也能呈现更好的内容结构
- 便于团队开发和维护，语义化更具有可读性
- header、footer、nav、section、main、aside

##### src 和 href 的区别

- src 主要用于加载 js，会阻塞 html 内容的加载，直到 js 文件加载、编译并执行完毕才会继续加载 html 内容，所以 js 内容一般放在页面底部
- href 主要加载 css 等、当浏览器识别到时，不会阻塞 html 内容的加载，而是会并行下载处理

##### 区分 HTML 和 HTML5

- 声明不同，HTML5<!DOCTYPE html>，HTML 很长一段
- 结构语义不同，HTML5 有很多新的标签，而 HTML 没有体现结构语义的标签，用<div id="header"></div>来表示网站头部

##### DOCTYPE 作用

<!Doctype>声明位于文档中的最前面，处于<html>标签之前。告知浏览器的解析器，用什么文档类型规范（Html或XHtml）来解析这个文档，不同的渲染模式会影响浏览器对 CSS 代码甚⾄ JavaScript 脚本的解析

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
  cookie 数据始终在同源的 http 请求中携带（即使不需要），即会在浏览器和服务器之间传递
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

- meta 标签由 name 和 content 属性定义，描述网页文档的属性，比如作者、网页描述、关键词等
- charset 声明文档字符编码
- description、keywords、author 等页面描述
- viewport 为适配移动端，可以控制视口的大小和比例
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
- 解析 CSS 文件构建 CSSOM 树，等 CSSOM 树构建完成，浏览器开始布局渲染树并绘制到屏幕上（css 放在最上面，浏览器预先加载 css 后，可以不必等待 HTML 加载完毕就可以渲染页面了），此时会涉及：reflow 回流和 repain 重绘
  - reflow 回流：DOM 节点中元素都是以盒模型的形式存在，需要浏览器去计算其位置和大小，此过程称为回流
  - repain 重绘：当盒模型的位置、大小及其他属性（字体、颜色等）确定后，浏览器便开始绘制内容，此过程称为重绘
- 页面首次访问必然会经历 reflow 和 repain，这两个过程非常消耗性能，尤其在移动设备上，所以应尽量减少 reflow 和 repain
- 当文档挂载过程遇到 js 文件，html 文档会挂起渲染的线程，等待 js 文件加载完毕并解析执行完成，才可以恢复 html 文档的渲染线程（JS 可能会修改 DOM，意味着，在 js 执行完成前，后续所有资源加载可能时没有必要的，这是 js 阻塞后续资源下载的根本原因，所以 js 会放在文档末尾）
- JS 的解析有浏览器的 js 引擎完成，例如 v8 引擎

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
  强缓存不需要向服务器发请求，协商缓存有服务器决定是否使用缓存，存在一次通信
  强缓存状态码是 200（from cache），而协商缓存如果命中缓存的话，状态码是 304（not modified）
  from cache 分为 from memory cache 和 from disk cache，从内存中获取最快，但是是 session 级别的缓存，关闭浏览器之后就没有了。

- 优先级
  Cache-Control > expires > Etag > Last-Modified

- 最后总结一下浏览器的三级缓存原理：
  先去内存看，如果有，直接加载
  如果内存没有，则去硬盘获取，如果有直接加载
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

- 预加载：提前加载资源，当用户需要时可直接从本地缓存中渲染
- 懒加载：主要目的是作为服务器前端的优化，减少请求次数或延迟请求
- 行为相反，一个是提前加载，一个是迟缓甚至不加载
- 懒加载对服务器有一定的缓解压力作用，而预加载会增加服务器前端压力
- 图片的加载是由 src 的值引起的,当对 src 赋值时浏览器回请求图片资源,基于这个。可以利用 html5 的特性 data-xxx 保存图片的路经,当我们需要加载图片的时候才将 data-xxx 的值赋予 src，就能实现图片的按需加载。也就是懒加载

#### 常见 web 安全及防护原理

- sql 注入原理：将 sql 插入到 web 表单提交或输入域名或页面请求的查询字符串，最终达到欺骗服务器进行恶意的 SQL 命令
- xss 原理及规范：跨站脚本（cross-site scripting）攻击指攻击者往 web 页面插入恶意 html 标签或 javascript 代码，使用户访问都会执行相应的嵌入代码，从而获取用户资料等。比如：攻击者在论坛中放一个看似安全的链接，骗取用户点击后，窃取`cookie`中的用户私密信息；或者攻击者在论坛中加一个恶意表单，当用户提交表单的时候，却把信息传送到攻击者的服务器中，而不是用户原本以为的信任站点

  防御措施：

  1. 输入过滤：只要有输入的地方，就存在 xss 攻击 1.攻击者提交恶意代码（前后台都需要做过滤检查或转码），2.浏览器执行恶意代码
  2. 利用 CSP 内容安全策略：建立白名单，告诉浏览器哪些外部资源可以加载和执行，只需要配置规则，如何拦截是浏览器自己实现的

  - 设置 heep header 中的 Content-Security-Policy: default-src 'self' img-src child-src
  - 设置 meta 标签 http-equiv="content-Securoty-Policy"

  3. cookie 的 HttpOnly 禁止 js 读取 Cookie 信息
  4. 通过验证码方法验证用户提交

  如果还有的话，像限制用户输入长度，因为 js 脚本一般都是比较长的

- csrf 原理：跨站请求伪造（cross-site request forgery），挟制用户在当前已登录的 web 应用程序上执行非本意的操作的攻击方法。就是说冒充用户发起请求，完成一些违背用户意愿的请求，与 xss 不同的是，xss 是攻击者直接对我们的网站 A 进行注入攻击，而 CSRF 是通过网站 B 对网站 A 进行滚伪造请求；例如，在购物网站 A 点击一个恶意链接 B，B 请求网站 A 下的下单接口，结果在 A 网站就真的会生成一个订单；原理是：网站 B 通过表单、get 请求来伪造网站 A 的请求，这时候请求会带上网站 A 的 cookie，若登陆信息保存在 cooklie 中，就实现了伪造攻击

  - 验证 csrf token，目前相对成熟的方案

    服务端随机生成 token，保存在服务端 session 中，同时保存到客户端中，客户端发送请求时，把 token 带到 HTTP 请求头或参数中，服务端接收到请求，验证请求中的 token 与 session 中的是否一致。
    token 可以在登录时写入到 cookies 中，发送请求时，js 读取 cookies 中的 token，并设置到 HTTP 请求头中。

  - 针对伪造请求的域名不是网站 A，限制 cookie 中的 sameSite 属性为 strict，只有同源网站的请求才会带上 cookie

  - 更换登录态方案

    由于 CSRF 本质是伪造请求携带了保存在 cookie 中的信息，所以对 session 机制的登录态比较不利，可以使用 JWT（JSON WEB TOken）方案，其 token 信息一般设置到 HTTP 请求头中，所以可以预防 CSRF 攻击

- `XSS`是获取信息，不需要提前知道其他用户页面的代码和数据包。`CSRF`是代替用户完成指定的动作，需要知道其他用户页面的代码和数据包
- TOKEN 可能被窃取，可以通过 XSS 攻击这种方式去窃取，可以结合一些其他的手段，预防 xss 攻击
- referer 字段
- vue 中的 xss 防御
  vue 框架已经进行了一些 xss 防御，对于一些外来的内容（例如接口或 url 参数），尽量用{{}}表达式显示（{{{}}}表示不经转义直接输出），因为{{}}中的内容进行了字符串化，浏览器不会对其中的内容进行执行操作；尽量避免 v-html 指令，或者先对内容进行 xss 过滤

#### cookie 面试题

> 由于 HTTP 是无状态协议，无状态指的是服务端对于客户端每次发送的请求都会认为是新的一个请求，上一次会话和下一次会话没有联系。但是很多场景需要知道上次会话和下一次会话的关系（比如登陆之后记住登陆状态），这时就引入了 cookie 和 session 体系。

- cookie
  客户端请求服务器时，如果服务器需要记录该用户状态，就通过 response Headers 向客户端浏览器颁发一个 cookie，而客户端浏览器会把 cookie 保存起来，当浏览器再次请求服务器时，浏览器把请求的网址连同该 cookie 一同提交给服务器，服务器通过检查该 cookie 来获取用户状态
- session
  当服务器接收请求时，就从存储在服务器上的无数 session 信息中去查找客户端请求时带过来的 cookie 的状态，如果服务器中没有这条 session 信息则添加一条 session 信息
  通常 cookie 中存的是 session 信息经过计算后的唯一 id sessionid

##### cookie 时如何工作的

- request

  当浏览器发送一个请求时，浏览器回自动检查是否有相应的 cookie，如果有则将 cookie 添加到 Request Headers 的 Cookie 字段中（cookie 字段是很多 name=value 以分号分隔的字符串）

- response

  当服务端需要种 cookie 时，在 http 请求的 Response Headers 中添加 Set-Cookie 字段，浏览器接收之后会自动解析识别，将 cookie 保存起来

  ```
  Set-Cookle:_ _hsid_t=3eac583831cb5952_t;Path=/;Domain=360.com; Max-Age=86400
  ```

````

##### cookie 和 session 的区别

- 存储位置不同

  cookie 存储在客户浏览器上，而 session 数据保存在服务器上

- 存储大小不同

  一般单个 cookie 保存的数据不能超过 4 个，单个域名最多保存 20 个 cookie；session 则无大小和限制

##### cookie 属性

- Name：cookie 名
- Value：cookie 值
- Domain：cookie 的域名。如果设置.example.com，那么子域名 a.example.com 和 b.example.com，都可以使用.example.com 的 cookie，反之则不行
- Path：允许读取 cookie 的 url 路径，一般设置为/
- Expires：cookie 过期时间。不设置，则为 session 会话期，页面退出时 cookie 失效
- HttpOnly：设置为 true 时，只有 http 能读取，js 只能读取未设置 HttpOnly 的 cookie
- Secure：标记为 Secure 的 cookie，只有 https 的请求可以携带
- SameSite：限制第三方 url 是否可以携带 cookie
  - Strict：仅允许同站点请求的 cookie
  - Lax：允许部分第三方请求携带 cookie，即导航到目标网址的 get 请求，包括超链接，预加载和 get 表单三种形式发送 cookie
  - None：任意发送 cookie，需要设置 Secure，网站必须采用 https
- Priority：优先级

##### 操作 cookie，js 和服务端

当设置了 HttpOnly 为 true 时，只有 http 请求读取，不能被 js 读取，具体表现为 document.cookie 读取到的值不包含设置的 HttpOnly

js 操作 cookie 使用 document.cookie

- 读取
  document.cookie 读取到字符串，包含 cookie 的 name 和 value，需要解析
- 写入
  ```js
  document.cookie =
    'uid=123;expires=Mon Jan 04 2022 17:42:40 GMT;path=/;secure;'
  document.cookie =
    'uid=123;expires=Mon Jan 04 2022 17:42:40 GMT;path=/caikuai;domain=edu.360.cn;secure;samesite=lax'
````

一次只能写入一个 cookie

- 删除

  只需要将一个已经存在的 cookie 名字过期时间设置为过去时间即可

  ```js
  document.cookie = "uid=123;expires=" + new Date(0) + ";path=/;secure;";
  ```

- 修改
  重新赋值，要保证 path 和 domain 两个值不变，否则会添加新的 cookie

  ```js
  document.cookie =
    "uid=123;expires=Mon Jan 04 2082 17:42:40 GMT;path=/;secure;";
  ```

##### 服务器端如何读写 cookie

- 写 cookie

  ```js
  res.setHeader("Set-Cookie", ["uid=123;maxAge: 900000; httpOnly: true"]);
  // 或者
  res.cookie("uid", "123", { maxAge: 900000, httpOnly: true });
  ```

- 读取 cookie

  ```js
  console.log(req.getHeader("Cookie")); // 拿到所有cookie
  // 或者
  console.log(req.cookie.name);
  ```

##### 查看浏览器是否打开 Cookie 功能

```js
window.navigator.cookieEnabled; // true
```

##### cookie 的共享策略是什么

domain 和 path 共同决定 cookie 可以被哪些 url 访问
访问一个 url 时，如果 url 的 host 和 domain 一致或者时 domain 的子域名，并且 url 的路径和 path 部分匹配，那么 cookie 才可以被获取

##### cookie 的编码

```js
document.cookie =
  "uid=123;expires=Mon Jan 04 2022 17:42:40 GMT;path=/caikuai;domain=edu.360.cn;secure;samesite=lax";
```

cookie 一般包含等号、冒号、分号、空格、逗号、斜杠等特殊字符，需要对其进行编码，使用 encodeURIComponent/decodeURIComponent 操作

不使用 escape 和 encodeURI 的原因是，encodeURIComponent 可以将更多字符进行编码，比如‘/’

##### cookie 应对 xss 漏洞

xss 漏洞原理是：由于未对用户提交的表单数据或者 url 参数等数据做处理就显示在页面上，导致用户提交的内容在页面上被作为 html 解析执行

常规方案：对特殊字符进行滚处理，如对“<”或“>“进行转义

cookie 设置：对用用户利用 script 脚本采集 cookie 信息，可以将重要的 cookie 信息设置为 HttpOnly 来避免 cookie 被 js 采集

##### cookie 应对 csrf 攻击

跨站请求伪造原理：用户登陆 A 网站，然后因为某些原理访问 B 网站（比如跳转），B 网站直接发送一个 A 网站的请求进行一些危险操作，由于 A 网站处理登陆状态，就发生了 CSRF 攻击，核心是利用了 cookie 信息可以被跨站携带

常规方案：采用验证码或 token 等

cookie 设置：由于 CSRF 攻击核心是利用 cookie 信息可以被跨站携带，可以对核心 cookie 的 SameSite 设置为 Strict 或 Lax 来避免

##### 不同浏览器共享 cookie 吗

不共享，是对立的 cookie

#### web 端 cookie 的设置和获取

```js
//写cookie
function setCookie(name, value) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie =
    name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
//读取cookie
function getCookie(name) {
  var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}
//删除cookie
function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null) {
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  }
}
```

##### iframe 优点和缺点

优点

1. 用于加载速度较慢的内容
2. 可以使脚本并行下载
3. 可以实现跨子域

缺点

1. iframe 会阻塞主页面的 onload 事件
2. 会产生很多页面不容易管理

##### 渐进增强和优雅降级

- 渐进增强：针对低版本浏览器进行页面重构，保证基本的功能情况下，再针对高级浏览器进行效果、交互等方面的改进，提升用户体验
- 优雅降级：一开始就构建完整的功能，然后再针对低版本浏览器进行兼容

##### 从浏览器地址栏输入 url 到请求返回发生了什么

1. 缓存：根据URL来查看是否命中缓存，如果命中缓存直接用缓存，不命中时继续下一步
2. DNS解析：浏览器向 DNS 服务器请求解析该 URL 中域名所对应的 IP 地址，浏览器操作系统都会缓存一些URL对应的IP地址，加速解析过程，同时大型网站都通过dns-prefetch作DNS预解析，提前解析，减少页面卡顿
3. TCP连接：解析到 IP 地址后开始进行 TCP 连接，三次握手确认双方的接收和发送能力（HTTPS需要七次握手 3次TCP + 4次TLS传输层安全性协议）TLS握手关键在于利用通信双发发生的随机字符串和服务端的证书公钥生成一个双方通过协商后的对称密钥，这样通信双方就可以使用这个对称密钥在后续的数据传输中加密消息数据，防止中间人的监听和攻击，保证通讯安全。
4. HTTP请求：浏览器发送 http 请求，读取服务端文件
5. 服务器处理请求：服务器响应请求并返回 http 报文
6. 浏览器渲染页面：浏览器解析 HTML 文件并渲染页面

   - 自上而下解析 HTML 文件生成 DOM 节点树
   - 根据 CSS 生成 CSSOM（CSS Object Mode）树，不阻塞 DOM 树但阻塞 render 树
   - 遇到 script 时，判断文件的 async 和 defer 属性，加载并执行 js 造成页面渲染的阻塞
   - DOM 树和 CSSOM 树结合生成 render 树
   - 布局（layout）：根据渲染树将节点树的每一个节点布局再屏幕上的正确位置
   - 绘制（painting）：遍历渲染树绘制所有节点，为每个节点适用对应的样式

   优化:

   1. HTML 文档结构层次尽量少，不深于 6 层
   2. 脚本放后
   3. 少量首屏样式放在内联样式中，减少请求
   4. 样式结构简单明了
   5. 脚本中尽量减少 DOM 操作，避免过度触发回流
   6. 断开 TCP 链接

    如何查看性能指标：
    1. network查看各种资源请求的情况
    2. performance查看页面各项性能的火焰图、白屏时间、FPS、资源加载时间、longtask等信息
7. TCP四次挥手，断开连接

   服务端收到客户端的SYN请求报文后，可以直接发送SYN和ACK报文。ACK是用来应答，SYN是用来同步的。但当关闭连接时，服务端收到客户端报文后，不会立即关闭连接，而是先回复ACK报文表示自己已经收到关闭请求，但需要服务端报文都发送完了，才能发送FIN报文，因此服务端多了一步操作需要四次回挥手
