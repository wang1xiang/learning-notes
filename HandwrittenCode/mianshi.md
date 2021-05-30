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

#### cdn 原理

内容分发网络（Content Delivery Network）：将网站的内容通过中心平台分发到部署在各地的 CDN 节点进行缓存，再通过负载均衡技术将用户的请求转发到就近的服务器上获取所需内容，降低网络堵塞，提供访问网站的响应速度

当用户访问使用 CDN 服务的网站时，本地 DNS 服务器通过 CNAME 方式将最终域名请求重定向到 CDN 服务。CDN 通过一组预先定义好的策略(如内容类型、地理区域、网络负载状况等)，将当时能够最快响应用户的 CDN 节点 IP 地址提供给用户，使用户可以以最快的速度获得网站内容。

#### const 可以不给值吗

不可以，const 一旦声明变量，就必须立即初始化，不能留到以后赋值。
必须在声明的同一语句中指定它的值（这是有道理的，因为以后不能更改）

#### Content-type 常见头

- application/x-www-form-urlencoded
  原生 form 表单，如果不设置 enctype（在发送到服务器之前应该如何对表单数据进行编码），那么最终会以 application/x-www-form-urlencoded （空格转换为 "+" 加号，特殊符号转换为 ASCII HEX 值）方式提交
- mulitpart/form-data
  表单上传文件时，需要设置 enctype 为 mulitpart/form-data
- application/json
  消息主体为序列化的 JSON 字符串，可以提交复杂的数据结构，适合 RESTfule 接口，各大抓包工具都会以树行结构展示 json 数据，很友好
- text/html
  HTTP 作为传输协议，XML 作为编码方式的远程调用规范

#### HTTP

- 常见 HTTP 方法
  GET：请求访问被 URI 识别的资源
  POST：传输信息给服务器
  PUT：传输文件，保存到对于 URI 位置
  HEAD：获得报文首部，不返回报文主体，一般用于验证 URI 是否有效
  DELETE：删除文件，与 PUT 方法相反，删除对应 URI 位置的文件
  OPTIONS：查询相应 URI 支持的 HTTP 方法
- GET 和 POST 区别

  - get 重点是获取资源，post 重点是向服务器发送数据
  - get 请求数据通过 URL 请求，请求过程用户可见，post 传输数据通过 http 的 post 机制，将字段与对应值封存在请求实体中发送给服务器，此过程用户不可见
  - get 传输数据量小，受 URL 长度限制，效率高；post 传输大量数据，上传文件时只能通过 post 方式
  - get 是不安全的，URL 可见，可能会泄漏私密信息
  - get 只支持 ASCII 字符，向服务器传输的中文字符可能会乱码

- 常见响应码
  - 1xx：提示信息，代表请求已接受，继续处理
  - 2xx：成功
  - 3xx：重定向
  - 4xx：客户端错误--请求有语法错误或请求无法实现
    401：Unauthorized 表示用户没有权限（用户名，密码错误等等）
    403：Forbidden 表示用户有权限，但未被授权访问特定资源
  - 5xx：服务端错误

#### HTTPS

- HTTP 缺陷
  通信使用明文未加密，内容可能被窃听
  不验证通信方身份，可能遭到伪装
  无法验证报文完成性，可能被篡改

- HTTPS
  客户端浏览器在使用 HTTPS 方式与 Web 服务器通信阶段

  1. 证书验证
     浏览器发起 HTTPS 请求，要求与 Web 服务器建立 SSL 连接
     服务端返回 HTTPS 证书：Web 服务器收到客户端请求后，会生成一对公钥和私钥，并把公钥放在证书中发送给客户端浏览器
     客户端验证证书是否合法，如果不合法则提示告警
  2. 数据传输
     当证书验证合法后，在本地生成随机数
     通过公钥加密随机数，并把加密后的随机数传输到服务端
     服务端通过私钥对随机数进行解密
     服务端通过客户端传入的随机数构造对称加密算法，对返回结果内容进行加密后传输

  为什么数据传输是对称加密？

  1. 非对称加密的加解密效率低，而 http 请求中通常是有大量的交互，非对称加密效率无法接受
  2. 在 HTTPS 的场景中只有服务端保存私钥，一对公私钥只能实现简单的加解密，所以采用对称加密

  本地随机数被窃取怎么办？

  证书验证时采用非对称加密实现，传输过程采用对称加密，而其中对称加密算法中重要的随机数是由本地生成并存储在本地的，HTTPS 如何保证随机数不会被窃取？
  HTTPS 并不包含对随机数的安全保证，HTTPS 保证的只是传输过程安全，而随机数存储于本地，本地的安全属于另一范畴

  HTTPS 抓包
  HTTPS 的数据是加密的，常规下抓包工具代理请求后抓到的包内容是加密状态，无法直接查看。

