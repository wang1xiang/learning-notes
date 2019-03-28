## 文件和json区别
* 文件属于流文件，不是json，需要修改相应类型responseType为arrayBuffer为而不是header，拿到二进制文件还需要按照服务器响应头的数据类型转换
* 请求成功后，在返回方法中设置
```javascript
let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=UTF-8'})
let objectUrl = URL.createObjectURL(blob)
const link = document.createElement('a')
link.download = fileName
link.href = objectUrl
link.click()
```
* 这样就可以下载成功，但是有问题
* 如果接口报错，后台返回json结果会乱码，因为已经处理为文件流