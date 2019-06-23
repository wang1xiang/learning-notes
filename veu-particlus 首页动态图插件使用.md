> 引入
```js
import VueParticles from 'vue-particles'
Vue.use(VueParticles)
```
> 使用
```js
<vue-particles
  :style="{width:width + 'px',height:height + 'px'}" // 指定高度和宽度
  color="#dedede"
  :particleOpacity="0.8"
  :particlesNumber="40"
  shapeType="circle"
  :particleSize="4"
  linesColor="#dedede"
  :linesWidth="1"
  :lineLinked="true"
  :lineOpacity="0.7"
  :linesDistance="150"
  :moveSpeed="3"
  :hoverEffect="true"
  hoverMode="grabgrab"
  :clickEffect="true"
  clickMode="push"
  >
</vue-particles>
```
> vue-particles不兼容ie
修改vue-particles/src/vue-particles/index.js
```javascrpt
  install (Vue, options) {
    Vue.component('vue-particles', particles)
  }
  -->
  install: function (Vue, options) {
    Vue.component('vue-particles', particles)
  }
```
