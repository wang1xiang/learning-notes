* 简单点的，columns可以放到data外面定义
```js
customRender: (text) => text + ' 次'
```
* 复杂点的，columns应该放到data中去定义
```js
data () {
  const columns = [
   {
     customRender: (text) => {
      if (text===0) {
        return <span style="color:rgb(0, 255, 0);margin-left: 5px;"><a-icon type="info-circle" theme="twoTone" twoToneColor="rgb(0, 255, 0)" ></a-icon>启用</span>
      } else {
        return  <span style="color:rgb(255, 0, 0); margin-left: 5px;"><a-icon type="warning" theme="twoTone" twoToneColor="rgb(255, 0, 0)" ></a-icon>禁用</span>
      }
    }
   } 
  ]
  return {
    columns
  }
}
```
模板
```js
<template>
  <div>
    <div style="display:flex;align-items: center;">
      <a-input-search
        v-if="showTitle"
        placeholder="请输入"
        v-on:keyup.enter="onSearch"
        @search="onSearch"
        v-model="searchValue"
        enterButton
        class="tablesearch"
      />
      <slot name="toolbar" v-bind="{selectedRowKeys}"></slot>
    </div>
    <a-table
      v-if="paging"
      :columns="columns"
      :dataSource="tableData"
      :scroll="scroll"
      :size="size"
      :rowKey="record => record.id || record.uuid"
      :rowSelection="rowSelection === null ? rowSelection : {selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :loading="tableLoading"
      :pagination="paging"
      class="table"
      @change="handleTableChange"
      :bordered="border">
      <!-- { pageSizeOptions: ['10', '20', '30', '40', '50'], current: 1, pageSize: 20, showSizeChanger: true, showQuickJumper: true } -->
      <template v-for="item in columns" :slot="item.dataIndex" slot-scope="text, record, index" >
        <slot :name="item.dataIndex" v-bind="{text, record, index}"></slot>
      </template>
    </a-table>
    <a-table
      v-else
      :columns="columns"
      :dataSource="tableData"
      :scroll="scroll"
      :size="size"
      :rowKey="record => record.id || record.uuid"
      :rowSelection="rowSelection === null ? rowSelection : {selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :loading="tableLoading"
      :pagination="pagination !== undefined ? pagination : { pageSize: 20, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '30', '40', '50'] }"
      class="table"
      :bordered="border">
      <!-- { pageSizeOptions: ['10', '20', '30', '40', '50'], current: 1, pageSize: 20, showSizeChanger: true, showQuickJumper: true } -->
      <template v-for="item in columns" :slot="item.dataIndex" slot-scope="text, record, index" >
        <slot :name="item.dataIndex" v-bind="{text, record, index}"></slot>
      </template>
    </a-table>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  // showTitle展示上方操作true显示  border展示边框true展示 pagination、rowSelection展示多选框null不展示 selectedRowKeys通知管理
  props: ['size', 'tableLoading', 'columns','data','showTitle','border', 'pagination', 'rowSelection', 'paging', 'selectedRowKey', 'selectedRows'],
  data () {
    return {
      cacheData: [...this.data],
      tableData: [...this.data],
      selectedRowKeys: [],
      deleteLoadign: false,
      searchValue: '',
      scroll: {x: true}
    }
  },
  // 邮件通知
  computed: {
    ...mapGetters({
      allSelectedRowKeys: 'getSelectedRows'
    })
  },
  methods: {
    ...mapActions(['setSelectedKeys', 'setSelectedRows']),
    // 搜索框查询
    onSearch (value) {
      if(typeof value!=='string'){
        return
      }
      if( value !== '') {
        this.tableData=this.cacheData.filter(item => {
          for (let i in item) {
            let str=''+item[i];
            if (i!=='uuid' && str.indexOf(value)!==-1) {
              return item
            }
          }
        })
      } else {
        this.tableData = [...this.cacheData]
      }
    },
    // 选择
    onSelectChange (selectedRowKeys, selectedRow) {
      if (this.allSelectedRowKeys.length > 0 && this.$route.name === 'eventNotify' && this.$route.name === 'scriptManage') {
        this.selectedRowKeys = selectedRowKeys
        const selectedRows = this.allSelectedRowKeys.filter(item => selectedRowKeys.includes(item.id))
        this.setSelectedKeys(selectedRowKeys)
        this.setSelectedRows(selectedRows)
      } else {
        this.selectedRowKeys = selectedRowKeys
        this.setSelectedKeys(selectedRowKeys)
        this.setSelectedRows(selectedRow)
      }
    },
    // 分页改变 current不设置时 不需要change事件 change事件需要和后台异步取数据
    handleTableChange (pagination) {
      let pageInfo = {}
      pageInfo = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      }
      this.$emit('tableChange', pageInfo)
    }
  },
  watch: {
    searchValue: {
      handler (value) {
        if (value === '') {
          this.onSearch('')
        }
      }
    },
    data : {
      handler (value) {
        this.tableData = value
        this.cacheData = value
      }
    },
    selectedRowKey: {
      handler (value) {
        // 邮件通过勾选树同时勾选设备
        this.selectedRowKeys = value
        this.setSelectedRows(this.selectedRows)
      }
    }
  }
}
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.table {
  margin-top:5px;
}
.tablesearch {
  margin-left: auto;
  width: 220px;
}
/* th td不换行 */
>>> .ant-table td { white-space: nowrap; }
>>> .ant-table th { white-space: nowrap; }
</style>

```