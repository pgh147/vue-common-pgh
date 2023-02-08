<template>
  <!-- <el-select v-model="defaultValue" v-bind="$attrs" v-on="$listeners">
    <el-option v-for="(item,index) in options" :key="index" v-bind="item" />
  </el-select> -->
  <el-radio-group v-model="defaultValue" v-bind="$attrs" v-on="$listeners">
    <el-radio v-for="item in options" :key="'ss1'+item.value" :label="item.value">{{ item.label }}</el-radio>
  </el-radio-group>
</template>

<script>
/**
 * 字典项选择器
 * @props {Number || String}    value       绑定值
 * @props {String}              categorie   字典项key 支持常量key
 */
export default {
  name: 'HxRadioGroup',
  props: {
    radios: {
      type: Array,
      default: () => []
    },
    value: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Number | String,
      default: ''
    },
    categorie: {
      type: String,
      default: ''
    },
    module: {
      type: String,
      default: 'hscm-manage-web'
    }
  },
  data() {
    return {
      defaultValue: '',
      options: []
    }
  },
  watch: {
    value(value) {
      this.defaultValue = value
    },
    defaultValue(value) {
      this.$emit('input', value)
    },
    categorie(categorie) {
      this.getListMultiCode(categorie)
    }
  },
  mounted() {
    if (this.radios && this.radios.length > 0) {
      this.options = this.radios
    } else {
      if (this.categorie) this.getListMultiCode(this.categorie)
    }
  },
  methods: {
    getListMultiCode(categorie) {
      this.$store.dispatch('constants/getConstants', { codes: [categorie], module: this.module }).then((data) => {
        this.options = data[categorie]
        if (this.defaultValue === '' || this.defaultValue === 'undefined' || typeof this.defaultValue === undefined) { this.defaultValue = this.options[0]?.value }
      })
    }
  }
}
</script>
