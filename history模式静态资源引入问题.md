* 当vue的router模式设置为mode: 'history'时，全局引入 js 或者css在页面刷新后会失效
  1.将mode: 'history'注释掉，变成 hash  模式，此时刷新不会有问题
  2.在index.html引入的时候，将相对路径转换成绝对路径
  相对路径：<script src="./powerbi.js"></script>
  绝对路径：<script src="/powerbi.js"></script>
  ./ 是指用户所在的当前目录（相对路径）
  / 是指根目录（绝对路径，项目根目录），也就是项目根目录(dist目录)
  对于hash模式，根路径是固定的，就是项目的根目录，但是history模式下，以/开头的嵌套路径会被当作根路径