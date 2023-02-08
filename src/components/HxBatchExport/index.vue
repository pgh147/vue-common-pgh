<!-- 导出组件 -->
<template>

  <el-button v-bind="{...$attrs}" :icon="icon" size="mini" :type="type" :loading="exportLoading" @click="exportSubmit">{{ name }}</el-button>

</template>

<script>
import { fileValidMixin } from '@/utils/fileValidMixin'
import dayjs from 'dayjs'
/**
 * 导出按钮
 * @props {String}       type         按钮类型       required: false
 * @props {String}       name         显示的名字     required: false
 * @props {String}       fileName     文件名称
 * @props {String}       exportType   导出类型 blob： 二进制导出
 * @props {String}       exportUrl    导出url 为二进制导出时必填
 * @props {Object}       params       异步方法的参数  required: true
 * @props {Function}     exportFun    异步请求数据   required: true
 * @emit
 *     getExportParams  获取查询的数据
 */
export default {
  name: 'HxBatchExport',
  mixins: [fileValidMixin],
  props: {
    name: {
      type: String,
      default: () => '导出'
    },
    tips: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: () => ''
    },
    fileType: {
      type: String,
      default: () => ''
    },
    exportFun: {
      type: Function,
      // require: true,
      default: () => Promise.resolve([])
    },
    exportType: {
      type: String,
      default: ''
    },
    exportUrl: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      // require: true,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      export: 'iconfont icon-leave1',
      downloadl: 'iconfont icon-download',
      exportLoading: false
    }
  },
  computed: {
    icon() {
      return this.name.indexOf('下载') !== -1 ? this.downloadl : this.export
    }
  },
  created() {
    console.log()
  },
  methods: {
    // 导出
    exportSubmit() {
      this.$emit('sub')
      this.$confirm(this.tips ? this.tips : '<strong>确认要导出文件吗?</strong><br/>确认后会导出excel文件，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.$emit('getExportParams')
        this.exportLoading = true
        if (this.exportType === 'blob') {
          this.$store.dispatch('message/add', {
            fileName: `${this.fileName}-${dayjs().format('YYYYMMDDHHmmss')}.${this.fileType ? this.fileType : 'xlsx'}`,
            type: 'ExportFile',
            exportUrl: this.exportUrl,
            exportParam: this.params,
            exportType: 'blob'
          })

          this.$bus.$emit('noticeMsg', {
            fileName: `${this.fileName}-${dayjs().format('YYYYMMDDHHmmss')}.${this.fileType ? this.fileType : 'xlsx'}`,
            type: 'ExportFile',
            exportUrl: this.exportUrl,
            exportParam: this.params,
            exportType: 'blob'
          })

          this.exportLoading = false
        } else {
          this.$nextTick(() => {
            this.exportFun({ ...this.params }).then(({ data, code, message }) => {
              if (code !== 1000 || data == null) {
                return this.$message.warning(message)
              }
              if (code === 1000 && data) {
                this.$store.dispatch('message/add', {
                  fileName: `${this.fileName || this.$route.meta.title}-${dayjs().format('YYYYMMDDHHmmss')}.xlsx`,
                  type: 'ExportFile',
                  exportParam: { id: data?.id || data, type: 2 }
                })

                this.$bus.$emit('noticeMsg', {
                  fileName: `${this.fileName || this.$route.meta.title}-${dayjs().format('YYYYMMDDHHmmss')}.xlsx`,
                  type: 'ExportFile',
                  exportParam: { id: data?.id || data, type: 2 }
                })

                this.exportLoading = false
                // this.loopResultValid(data, 2, () => { this.$message.success('导出成功') },
                //   () => { this.exportLoading = false })
              }
            }).catch(({ code, message }) => {
              this.exportLoading = false
              this.$message.warning(message)
            })
          })
        }
      })
    }
  }
}
</script>
