### 懒加载

也叫延时加载、按需加载，只加载用户可是窗口的一部分图片数据。在滚动屏幕时加载图片，减少服务器负载

- 特点

  - 提升用户体验
  - 减少无用资源的加载
  - 防止加载过多图片时影响其他资源的加载

- 实现原理

  当对 src 赋值时浏览器就会发起请求图片资源，根据这个原理可以使用 HTML5 的`data-xxx`来存储图片的路径，需要加载图片的时候再`data-xxx`中的路径赋值给 src，这样就实现图片的懒加载

- 实现知识点

  - window.innerHeight 获取浏览器可视区高度
  - document.body.scrollTop || document.documentElement.scrollTop 获取浏览器滚动过的距离
  - img.offsetTop 获取图片元素顶部距离文档顶部的高度
  - 懒加载条件：img.offset < window.innerHeight + document.body.scrollTop

  ```html
  <div class="container">
    <img src="loading.gif" data-src="pic.png" />
    <img src="loading.gif" data-src="pic.png" />
    <img src="loading.gif" data-src="pic.png" />
    <img src="loading.gif" data-src="pic.png" />
    <img src="loading.gif" data-src="pic.png" />
    <img src="loading.gif" data-src="pic.png" />
  </div>
  <script>
    const lazyLoad = () => {
      const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      const winHeight = window.innerHeight;
      const imgs = document.querySelectorAll("img");

      for (let i of imgs) {
        if (imgs[i].offsetTop < scrollTop + winHeight) {
          imgs[i].src = imgs[i].getAttribute("data-src");
        }
      }
    };
    window.onscroll = lazyLoad();
  </script>
  ```

- 懒加载与预加载区别
  
  预加载：提前加载可能会用到的资源，后续用到时直接从缓存中获取，减少获取资源等待时间提升用户体验，对服务器有压力
  懒加载：迟缓或不加载资源，对服务器有一定的缓解压力作用
  
### 回流重绘

- 回流
  
  当渲染树中部分或全部元素尺寸、结构或属性发生改变时，浏览器会重新渲染部分或全部文档的过程
  
  页面首次渲染、浏览器窗口改变、元素内容改变、元素尺寸或位置改变等会触发回流

- 重绘

  当元素样式发生改变，但不影响在文档流中的位置时，浏览器对元素进行重新绘制

  元素color、background等改变时触发重绘
  
- 关系

  回流会触发重绘、重绘不一定出发回流

- 减少回流和重绘

  - 元素脱离文档流，使用absolute或fixed，发生变化时不会影响其他元素
  - 将元素先设置为display: none，操作完成后显示，因为none时操作DOM不会触发回流和重绘
