##### 实现Monaco Editor搜索功能

[官网](https://microsoft.github.io/monaco-editor/)

一直使用Monaco Editor作为项目中的代码编辑器，但是缺少搜索功能，直接使用浏览器的搜索不能实现定位，所以根据API写了一个搜索功能

- 模拟网页搜索页面实现

  ```html
  <section v-show="showInput" class="search-input">
        <a-input v-model="searchValue" ref="input" @change="findAllMatches(searchValue)" />
        <p style="color: #fff;font-size: 16px;margin-bottom: 0;">
          {{ allMatches.length ? matchIndex + 1 : matchIndex }}/{{ allMatches.length }}
        </p>
        <a-divider style="height: 30px;color:#ACAEB1;" type="vertical" />
        <a-icon
          style="color: #ACAEB1;font-size: 16px;margin-right: 8px;cursor: pointer;"
          type="down"
          @click="goto('preview', !allMatches.length || matchIndex >= allMatches.length - 1)"
          :style="{ cursor: !allMatches.length || matchIndex >= allMatches.length - 1 ? 'not-allowed' : 'pointer' }"
        />
        <a-icon
          style="color: #ACAEB1;font-size: 16px;margin-right: 8px;cursor: pointer;"
          type="up"
          @click="goto('next', !allMatches.length || matchIndex <= 0)"
          :style="{ cursor: !allMatches.length || matchIndex <= 0 ? 'not-allowed' : 'pointer' }"
        />
        <a-icon
          style="color: #ACAEB1;font-size: 16px;margin-right: 8px;cursor: pointer;"
          type="close"
          @click="showInput = false"
        />
      </section>
  ```

- mounted中定义crtl + f方法

  ```vue
  mounted () {
  	this.$nextTick(() => {
        // 定义crtl+f搜索方法
        this.monacoInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_F, () => {
          this.showInput = true
          this.$nextTick(() => {
            this.$refs.input.focus()
          })
        })
      })
  }
  ```

- 定义查找内容方法

  ```js
  // 匹配所有选择内容 并将内容保存到allMatches数组中 用于点击上下按钮时获取range
      findAllMatches(searchText) {
        const { monacoInstance } = this
        this.allMatches = []
        if (searchText) {
          const data = monacoInstance.getModel().findMatches(searchText)
          data.forEach((item, index) => {
            const {
              range: { startLineNumber, endLineNumber, startColumn, endColumn }
            } = item
            let range = new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn)
            this.allMatches.push(range)
            if (index === 0) {
              monacoInstance.setSelection(range)
              monacoInstance.revealRangeInCenter(range)
            }
          })
        }
        this.matchIndex = 0
        return this.allMatches
      },
  ```

- 定义焦点跳转方法

  ```js
  // 点击上下按钮 移动选中位置
      goto(type, flag) {
        if (flag) return
        type === 'preview' ? this.matchIndex++ : this.matchIndex--
        const { allMatches, matchIndex, monacoInstance } = this
        const range = allMatches[matchIndex]
        const model = monacoInstance.getModel()
        monacoInstance.setModel(model)
        monacoInstance.setSelection(range)
        monacoInstance.revealRangeInCenter(range)
      }
  ```

  