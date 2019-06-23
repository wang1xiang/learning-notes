> 两种方式(单独js文件引入echarts)
#### 第一种引入
1. 加载echarts
```js
  // 加载echarts，注意引入文件的路径
 import echarts from 'echarts/lib/echarts'
 // 再引入你需要使用的图表类型，标题，提示信息等
 import 'echarts/lib/chart/bar'
 import 'echarts/lib/component/legend'
 import 'echarts/lib/component/title'
 export default echarts
```
2. 使用
```js
  // 需要的地方引入
  import echarts from '@/utils/echarts'
```
#### 第二种引入
1. 加载enquire
```js
cnpm install babel-plugin-equire -D
// 配置 babel.config.js
plugins:['equire']
```
2. 配置echats文件
```js
// eslint-disable-next-line
const echarts = equire([
  'tooltip',
  'candlestick',
  'bar',
  'line',
  'axisPointer',
  'legend',
  'grid',
  'graph',
  'gauge',
  'lines'
])
export default echarts
```
3. 使用
```js
  // 需要的地方引入
  import echarts from '@/utils/echarts'
```
