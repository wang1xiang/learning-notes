* icondont官网
> https://www.iconfont.cn/home/index?spm=a313x.7781069.1998910419.2
  搜索需要的图片，可以选择png或者svg下载
> 使用(svg)
1. 添加svg图片到项目
2. 引入
```js
import shutdown from '@/assets/icons/shutdown.svg?inline' // path to your '*.svg?inline' file.

export { shutdown }
```
3. 使用
```js
import { shutdown } from '@config/icons'
data() {
  return {
    shutdown
  }
}
<a-icon component="shutdown"/>
```
  