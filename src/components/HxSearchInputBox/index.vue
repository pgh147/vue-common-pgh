<template>
  <div>
    <el-input
      v-model="showValue"
      v-bind="{ ...{placeholer: '请输入关键字'}, ...$attrs }"
      v-on="$listeners"
      @keyup.native="()=>{isUserInput = true}"
      @clear="inputClear"
      @blur="inputBlur"
    >
      <i slot="suffix" class="el-icon-search" style="cursor: pointer;" @click.stop="ckSearchBox"></i>
    </el-input>
    <el-dialog :title="title" :fullscreen="false" :modal-append-to-body="false" class="larger" :custom-class="'larger'" :visible.sync="dialogVisible">
      <hx-view-card>
        <template v-slot:查询条件>
          <hx-search-form :form="form" label-width="150px" @submit="(value) => {queryParams = value}" />
        </template>
        <template v-slot:card1>
          <hx-table ref="hxTableDetail" :route="false" :table-cus-heiht="400" :show-tools="false" :data-key="dataKey" :total-key="totalKey" :query-fun="queryFun" :query-params="queryParams" :columns="columns" @selection-change="(val)=>{selectBatch = val}" />
        </template>
      </hx-view-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="sureDialog">确认选择</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 搜索输入选择框
 * @props {Function} queryFun     异步请求数据
 * @props {String}   dataKey      数据key
 * @props {String}   labelKey     option label   必填
 * @porps {String}   valueKey     option value    必填
 * @props {String}   dataKey      数据key
 * @props {String}   totalKey     总数key*
 * @porps {String}    form        弹框搜索字段
 * @porps {String}    columns     弹框表格显示字段
 * @porps {String}    title       弹框title
 *
 * 示例
 *   \views\Shipments\Bill\List\index.vue
 */
export default {
  name: 'HxSearchInputBox',
  props: {
    value: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Array | String,
      default: ''
    },
    queryFun: {
      type: Function,
      default: () => Promise.resolve([])
    },
    labelKey: {
      required: true,
      type: String,
      default: 'label'
    },
    valueKey: {
      required: true,
      type: String,
      default: 'value'
    },
    dataKey: {
      type: String,
      default: 'pageList'
    },
    totalKey: {
      type: String,
      default: 'totalCount'
    },
    form: {
      type: Array,
      default: () => []
    },
    columns: {
      required: true,
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '数据选择窗口'
    }
  },
  data() {
    return {
      defaultValue: this.value,
      isUserInput: false, // 是否为用户自己输入（用户自己输入的要校验数据）
      loading: false,
      dialogVisible: false,
      selectBatch: [],
      queryParams: { },
      showValue: ''
    }
  },
  watch: {
    value(value) {
      this.defaultValue = value
    },
    defaultValue(defaultValue) {
      this.$emit('input', defaultValue)
    }
  },
  methods: {
    inputClear() {
      this.selectBatch = []
      this.sureSelectData()
    },
    // 输入框 离开焦点
    inputBlur() {
      if (!this.isUserInput) return
      if (!this.showValue) return
      this.loading = true
      const param = {}
      param[this.labelKey] = this.showValue
      this.queryFun(param).then(({ data }) => {
        this.loading = false
        if (!data[this.dataKey] || data[this.dataKey].length === 0) {
          this.showValue = ''
          this.$message.warning('查询不到数据')
        } else {
          this.selectBatch = data[this.dataKey]
          this.sureSelectData()
        }
      }).catch(({ code, message }) => {
        this.$message.error(`${message}-[${code}]`)
        this.loading = false
      })
    },
    // 点击查询按钮 弹出选择框
    ckSearchBox() {
      this.dialogVisible = true
    },
    sureDialog(val) {
      this.isUserInput = false
      this.sureSelectData()
      this.dialogVisible = false
    },
    sureSelectData() {
      this.defaultValue = []
      if (this.selectBatch && this.selectBatch.length > 0) {
        const sel = []
        this.selectBatch.forEach(ele => {
          sel.push(ele[this.labelKey])
          this.defaultValue.push(ele[this.valueKey])
        })
        this.showValue = sel.join(',')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.view-card {
  padding: 5px 14px;
  margin-bottom: 0;
}
</style>
