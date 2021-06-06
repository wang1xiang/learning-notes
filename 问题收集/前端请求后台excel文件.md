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
* 下载的文件会乱码,并且下载的文件名也是乱码

### 可以使用window.location.href来下载文件,就不会有问题
## 上传文件
* 使用antd upload控件实现步骤<br>
1.引入upload
```javascript
<a-upload name="file" :multiple="true" :action="url" :headers="headers" :data="{modelId: modelId}" :fileList="fileList" @change="handleChange">
  <a-button>
    <a-icon type="upload" /> 上传文件
  </a-button>
</a-upload>
```
2.设置参数<br>
* 比如,这里action代表上传的地址,data为需要的参数,fileList为文件列表<br>
然后点击上传文件,就可以实现上传
