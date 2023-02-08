<template>
  <div class="search-form" :style="`min-height:${form.length < 3 ?'56px':'112px' } `">
    <div class="search-form-container" :class="{open}">
      <el-form ref="searchForm" :key="$route.name" :model="searchForm" v-bind="{ ...{ 'label-width': '112px' }, ...$attrs }" v-on="$listeners">
        <el-row :gutter="24">
          <el-col v-for="(items, indexs) in !open ? form.slice(0,5) : form" :key="items.name + indexs + $route.name" :span="8" v-bind="{ ...(items.colAttrs || {})}">
            <el-form-item :key="items.name + indexs + $route.name" :label="items.label" :prop="items.name" v-bind="items.itemAttrs">
              <component :is="items.component" v-if="!items.slot" :key="items.name + indexs + $route.name" v-model="searchForm[items.name]" :form-name="items.name" v-bind="{ ...{format:'yyyy-MM-dd'},...items.attrs, clearable: true }" style="width: 100%;" v-on="items.listeners">
                <template v-if="items.options && items.options.categorie">
                  <component :is="items.options.component" v-for="(ls) in categorieOptions[items.options.categorie] || []" :key="ls.value" v-bind="ls" />
                </template>
                <template v-else-if="items.options">
                  <component :is="items.options.component" v-for="(ls, is) in items.options.list" :key="is" v-bind="ls" />
                </template>
              </component>
              <slot v-else :name="items.name" :model="searchForm"></slot>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-top: 3px; text-align: right;" :push="computePush">
            <el-button icon="iconfont icon-search" size="mini" type="primary" @click="submitForm">查询</el-button>
            <slot name="export" size="mini"></slot>
            <el-button icon="iconfont icon-reset" size="mini" @click="resetFields">重置</el-button>
            <el-button v-if="form.length > 5" size="mini" @click="open = !open">{{ open ? "收起" : "展开" }}<i class="el-icon-arrow-right el-icon-arrow-down" :class="{open}"></i></el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
/**
 * 搜索表单
 * @props {Number} line 初始显示最大行数
 * @props {Array}  form 搜索表单视图数据
 * @emits submit 提交表单验证成功
 * @attrs https://element.eleme.cn/#/zh-CN/component/form
 * form示例： src/views/dashboard/index.vue
 * [
 *  {
 *      label: '时间',       // 标签文本
 *      name: 'newTime',    // 表单域 model 字段，prop也是取该值
 *      dataType:'string',  // 数据类型 string number array， 默认string, array 支持持','分隔的字符例如：1,2,3 => [1, 2, 3]
 *      slot: true          // 插槽模式
 *  },
 *  {
 *      label: '所属仓库',
 *      name: 'spu_id',
 *      component: 'el-input',  // 具体的表单组件
 *      defaultValue: '',       // 默认值
 *      attrs: {                // form组件属性
 *          placeholder: '請輸入SPU ID'
 *      },
 *      listeners: {            // form组件事件
 *          input(val) { console.log(val) }
 *      },
 *      itemAttrs: {            // from-item组件属性
 *          rules: [{ required: true, message: 'spu_id不能为空' }]
 *      }
 *  },
 *  {
 *      label: '所屬分類：',
 *      name: 'goods_class',
 *      component: 'el-select',
 *      defaultValue: '2',
 *      attrs: {
 *      placeholder: '请选择'
 *      },
 *      options: {                          // 数据options
 *        component: 'el-option',           // 具体的options 组件
 *        categorie: 'gia-quotationType',   // 字典项 与 组件值 冲突 字典项优先级更高
 *        list: [                           // 组件值
 *          {
 *            value: '1',
 *            label: '黄金糕'
 *          },
 *          {
 *            value: '2',
 *            label: '黄金糕2'
 *          }
 *        ]
 *      }
 *  }
 * ]
 */
export default {
  name: 'HxSearchForm',
  props: {
    line: {
      type: Number,
      default: 2
    },
    form: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      defaultQuery: {},
      searchForm: {},
      searchFormType: {},
      categorieOptions: {},
      open: false
    }
  },
  computed: {
    computePush() {
      let push = 0
      const formLen = this.form?.length ?? 0
      if ((this.open && formLen % 3 === 0) || formLen === 3) {
        push = 16
      } else if (formLen <= 5 || (this.open && formLen > 5)) {
        push = `${formLen / 3}`.includes(333333) ? 8 : 0
      }
      // this.computeFormColumns()
      return push
    }
  },
  watch: {
    form: {
      handler() {
        this.computeFormColumns()
      },
      deep: true
    },
    '$route': () => {
      this?.computeFormColumns()
    }
  },
  created() {
    this.computeFormColumns()
    const { params, query } = this.$route
    this.defaultQuery = { ...params, ...query }
  },
  methods: {
    /** 计算表单栏 */
    computeFormColumns() {
      const form = this.form
      const formLength = form?.length || 0
      // 处理 searchForm 的字典项
      for (let len = 0; len < formLength; len++) {
        // 统计字典项key
        if (form[len]?.options?.categorie) {
          this.$set(this.categorieOptions, form[len]?.options?.categorie, [])
        }
        // 填充默认数据
        if (form[len]?.children && typeof form[len]?.children === 'object') {
          Object.keys(form[len]?.children).forEach(key => {
            this.$set(this.searchForm, key, form[len].children[key] || '')
          })
        } else {
          this.$set(this.searchForm, form[len].name, form[len].defaultValue)
        }
        // 处理 searchForm 字典项的类型
        try {
          this.$set(this.searchFormType, form[len].name, form[len].dataType ? form[len].dataType : (Array.isArray(form[len].defaultValue) ? 'array' : (typeof form[len].defaultValue || 'string')))
        } catch (error) {
          this.$set(this.searchFormType, form[len].name, 'string')
          console.error(error)
        }
      }
      // 处理字典项
      this.getCategorieOptions(this.categorieOptions)
      // 数据还原
      this.$nextTick(() => {
        const { query } = this.$route
        for (const key in query) {
          if (Object.keys(this.searchForm).includes(key)) {
            switch (this.searchFormType[key]) {
              case 'number':
                try {
                  this.$set(this.searchForm, key, parseFloat(query[key]))
                } catch (error) {
                  this.$set(this.searchForm, key, query[key])
                }
                break
              case 'array':
                try {
                  this.$set(this.searchForm, key, query[key].split(','))
                } catch (error) {
                  this.$set(this.searchForm, key, query[key])
                }
                break
              default:
                this.$set(this.searchForm, key, query[key])
                break
            }
          }
        }
        document.querySelectorAll('.el-select__tags').forEach(el => {
          el.title = '键盘键“Shift”+鼠标“滚轮上下”查看更多选项'
        })
      })
    },
    /** 提交表单 */
    submitForm() {
      this.$refs.searchForm.validate((valid) => {
        if (valid) {
          const value = {}
          for (const key in this.searchForm) {
            if (this.searchForm[key] !== '' && this.searchForm[key] !== null && this.searchForm[key] !== undefined) {
              if (Array.isArray(this.searchForm[key])) {
                if (this.searchForm[key].length) value[key] = this.searchForm[key]
              } else {
                value[key] = this.searchForm[key]
              }
            }
          }
          this.$emit('submit', value)
        } else {
          return false
        }
      })
    },
    /**
     * 获取字典项options
     */
    getCategorieOptions(categorieOptions) {
      const categories = Object.keys(categorieOptions)
      if (!categories?.length) return
      this.$store.dispatch('constants/getConstants', { codes: categories }).then((data) => {
        for (let i = 0; i < categories?.length; i++) {
          const key = categories[i]
          this.categorieOptions[key] = data[key]
        }
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      })
    },
    resetFields() {
      this.$refs.searchForm.resetFields()
      this.form.forEach(({ name, defaultValue, children }) => {
        if (Object.keys(this.searchForm).includes(name)) {
          this.searchForm[name] = this.defaultQuery[name] || defaultValue
        }
        if (children && typeof children === 'object') {
          Object.keys(children).forEach(key => {
            this.searchForm[key] = children[name] || ''
          })
        }
      })
      this.$emit('resetField')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-icon-arrow-right.el-icon-arrow-down {
  font-size: 16px;
}

/deep/.el-button {
  font-size: 14px;
}

.search-form {
  position: relative;
  max-height: 112px;
  z-index: 999;
  padding-bottom: 16px;
  margin-bottom: 16px;
  width: calc(100% - 16px);

  .search-form-container {
    max-height: 112px;
    position: absolute;
    width: inherit;
    padding: 16px;
    padding-bottom: 0;
    overflow: hidden;
    // box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.2);
    background: #fff;
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    transition: 1000ms;

    &.open {
      max-height: 400px;
      overflow: hidden auto;

      &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background-color: #f5f5f5;
      }

      &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 14px;
      }
    }

    /deep/ .el-row {
      .el-col {
        padding-bottom: 16px;
      }
    }

    /deep/ .el-form-item {
      margin-bottom: 0 !important;
    }

    /deep/ .el-range-input {
      text-overflow: ellipsis;
    }

    /deep/ .el-select__input {
      width: auto !important;
    }

    .el-icon-arrow-down {
      transition: 1000ms;
      transform: rotate(0deg);

      &.open {
        transform: rotate(-180deg);
      }

      &::before {
        content: '\e6df' !important;
      }
    }
  }
}
</style>

<style lang="scss">
.search-form .search-form-container .el-select__tags {
  white-space: nowrap;
  overflow: auto hidden;
  display: inline;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 0;
  }

  .el-tag {
    width: auto;
  }
}
</style>
