> 两种方式(单独 js 文件引入 echarts)

#### 第一种引入

1. 加载 echarts

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

1. 加载 enquire

```js
cnpm install babel-plugin-equire -D
// 配置 babel.config.js
plugins:['equire']
```

2. 配置 echats 文件

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

#### 自适应屏幕大小

```js
data () {
  return {
    resizeTimer: null,
  }
},
mounted () {
  window.addEventListener('resize', () => {
    if (_this.resizeTimer) clearTimeout(_this.resizeTimer)
    _this.resizeTimer = setTimeout(() => {
      _this.myChart.resize()
    }, 100)
  })
}
```
