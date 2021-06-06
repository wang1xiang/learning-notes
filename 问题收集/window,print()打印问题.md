**##### window.print()打印功能**

项目使用 Vue + ant Design Vue，要添加表单的打印功能，如果直接使用 window.print()打印出来的样式会出现问题，而且出现了页眉和页脚，如果所示

优化如下：

- 去除页眉和页脚

  在 index.html 中添加样式去除页眉页脚，如下

  ```html
  <style media="print">
    @page {
      size: auto;
      margin: 0mm;
    }
  </style>
  ```

- 样式优化

  表单的 label 框统一靠右处理

  ```html
    <style media="print">
    @page {
      size: auto;

      margin: 0mm;
    }
    .ant-form-item-label {
      text-align: right !important;
    }
  </style>
  ```

优化完成后，再次点击打印
