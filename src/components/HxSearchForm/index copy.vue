<template>
  <div class="search-form">
    <el-form ref="searchForm" :model="searchForm" v-bind="{ ...{ 'label-width': '112px' }, ...$attrs }" v-on="$listeners">
      <template v-for="(item, index) in formColumns">
        <el-row v-if="index < line" :key="index" :gutter="24">
          <el-col v-for="(items, indexs) in item" :key="indexs" v-bind="{...{xl:6, lg:8}, ...(items.colAttrs || {})}">
            <el-form-item :key="indexs" :label="items.label" :prop="items.name" v-bind="items.itemAttrs">
              <component :is="items.component" v-if="!items.slot" :key="indexs" v-model="searchForm[items.name]" v-bind="{ ...items.attrs, clearable: true }" style="width: 100%;" v-on="items.listeners">
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
        </el-row>
      </template>
      <el-collapse-transition>
        <div v-show="open">
          <template v-for="(item, index) in formColumns">
            <el-row v-if="index >= line" :key="index" :gutter="24">
              <el-col v-for="(items, indexs) in item" :key="indexs" v-bind="{...{xl:7, lg:8}, ...(items.colAttrs || {})}">
                <el-form-item :key="indexs" :label="items.label" :prop="items.name" v-bind="items.itemAttrs">
                  <component :is="items.component" v-if="!items.slot" :key="indexs" v-model="searchForm[items.name]" v-bind="{ ...items.attrs, clearable: true }" style="width: 100%;" v-on="items.listeners">
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
            </el-row>
          </template>
        </div>
      </el-collapse-transition>
    </el-form>
    <div>
      <el-button size="small" type="primary" plain @click="submitForm">??????</el-button>
      <slot name="export" size="small"></slot>
      <el-button size="small" @click="$refs.searchForm.resetFields(),$emit('resetField')">??????</el-button>
    </div>
    <footer v-if="formColumns.length > line" class="search-form-footer">
      <i class="el-icon-arrow-down" :class="{ open }" @click="open = !open"></i>
    </footer>
  </div>
</template>

<script>
/**
 * ????????????
 * @props {Number} line ????????????????????????
 * @props {Array}  form ????????????????????????
 * @emits submit ????????????????????????
 * @attrs https://element.eleme.cn/#/zh-CN/component/form
 * form????????? src/views/dashboard/index.vue
 * [
 *  {
 *      label: '??????',       // ????????????
 *      name: 'newTime',    // ????????? model ?????????prop???????????????
 *      dataType:'string',  // ???????????? string number array??? ??????string, array ?????????','????????????????????????1,2,3 => [1, 2, 3]
 *      slot: true          // ????????????
 *  },
 *  {
 *      label: '????????????',
 *      name: 'spu_id',
 *      component: 'el-input',  // ?????????????????????
 *      defaultValue: '',       // ?????????
 *      attrs: {                // form????????????
 *          placeholder: '?????????SPU ID'
 *      },
 *      listeners: {            // form????????????
 *          input(val) { console.log(val) }
 *      },
 *      itemAttrs: {            // from-item????????????
 *          rules: [{ required: true, message: 'spu_id????????????' }]
 *      }
 *  },
 *  {
 *      label: '???????????????',
 *      name: 'goods_class',
 *      component: 'el-select',
 *      defaultValue: '2',
 *      attrs: {
 *      placeholder: '?????????'
 *      },
 *      options: {                          // ??????options
 *        component: 'el-option',           // ?????????options ??????
 *        categorie: 'gia-quotationType',   // ????????? ??? ????????? ?????? ????????????????????????
 *        list: [                           // ?????????
 *          {
 *            value: '1',
 *            label: '?????????'
 *          },
 *          {
 *            value: '2',
 *            label: '?????????2'
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
      searchForm: {},
      searchFormType: {},
      formColumns: [],
      categorieOptions: {},
      open: false
    }
  },
  watch: {
    form: {
      handler() {
        this.computeFormColumns()
      },
      deep: true
    }
  },
  mounted() {
    this.computeFormColumns()
    this.$nextTick(() => {
      window.addEventListener('resize', this.onWindowResize)
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize)
  },
  methods: {
    /** ??????????????? */
    computeFormColumns() {
      const colNumber = window.innerWidth <= 1920 ? 3 : 4
      // const colNumber = 3
      this.formColumns = this.form.reduce((p, c, i) => {
        if (c.children) {
          if (Array.isArray(c.children)) {
            this.$set(this.searchForm, c.name, c.children)
          } else {
            for (const key in c.children) {
              this.$set(this.searchForm, key, c.children[key])
            }
          }
        } else {
          this.$set(this.searchForm, c.name, c.defaultValue)
        }
        this.$set(this.searchFormType, c.name, c.dataType || 'string')
        if (c?.options?.categorie) this.$set(this.categorieOptions, c?.options?.categorie, [])
        if (p[parseInt(i / colNumber)]) {
          p[parseInt(i / colNumber)].push(c)
        } else {
          p[parseInt(i / colNumber)] = [c]
        }
        return p
      }, [])
      this.getCategorieOptions(this.categorieOptions)
      this.$nextTick(() => {
        const { query } = this.$route
        for (const key in query) {
          if (Object.keys(this.searchForm).includes(key)) {
            if (Array.isArray(this.searchForm[key])) {
              try {
                this.$set(this.searchForm, key, query[key].split(','))
              } catch (error) {
                this.searchForm[key] = query[key]
              }
            } else {
              switch (this.searchFormType[key]) {
                case 'number':
                  try {
                    this.searchForm[key] = parseFloat(query[key])
                  } catch (error) {
                    this.searchForm[key] = query[key]
                  }
                  break
                case 'array':
                  try {
                    this.$set(this.searchForm, key, query[key].split(','))
                  } catch (error) {
                    this.searchForm[key] = query[key]
                  }
                  break
                default:
                  this.searchForm[key] = query[key]
                  break
              }
            }
          }
        }
      })
    },
    /** ?????????????????? */
    onWindowResize() {
      const colNumber = window.innerWidth <= 1920 ? 3 : 4
      if (this.formColumns.length && this.formColumns[0].length === colNumber) return
      this.formColumns = this.form.reduce((p, c, i) => {
        if (p[parseInt(i / colNumber)]) {
          p[parseInt(i / colNumber)].push(c)
        } else {
          p[parseInt(i / colNumber)] = [c]
        }
        return p
      }, [])
      this.$forceUpdate()
    },
    /** ???????????? */
    submitForm() {
      this.$refs.searchForm.validate((valid) => {
        if (valid) {
          const value = {}
          for (const key in this.searchForm) {
            if (this.searchForm[key] !== '' && this.searchForm[key] !== null && this.searchForm[key] !== undefined) {
              value[key] = this.searchForm[key]
            }
          }
          this.$emit('submit', value)
        } else {
          return false
        }
      })
    },
    /**
     * ???????????????options
     */
    getCategorieOptions(categorieOptions) {
      const categories = Object.keys(categorieOptions)
      if (!categories?.length) return
      this.$store.dispatch('constants/getConstants', { codes: categories }).then((data) => {
        for (let i = 0; i < categories.length; i++) {
          const key = categories[i]
          this.categorieOptions[key] = data[key]
        }
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-form {
  position: relative;
  // box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.2);

  /deep/ .el-form-item {
    margin-bottom: 19px;
  }

  .search-form-footer {
    text-align: center;
    position: absolute;
    width: 100%;

    > i {
      cursor: pointer;
      transition: 300ms;

      &.open {
        transform: rotateZ(-180deg);
      }
    }
  }
}
</style>
