### vue版本不对应解决
* 启动报错
  - vue@2.6.8
  - vue-template-compiler@2.6.6
  This may cause things to work incorrectly. Make sure to use the same version for both.
  If you are using vue-loader@>=10.0, simply update vue-template-compiler.
  If you are using vue-loader@<10.0 or vueify, re-installing vue-loader/vueify should bump vue-template-compiler to the latest.
* 版本不一致导致报错，将vue的版本改成和vue-template-compiler的版本一致，使用命令
  cnpm install vue-template-compiler@2.6.8 --save--dev