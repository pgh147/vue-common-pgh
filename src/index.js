//  src/index.js
import HxRadioGroup from "@/components/HxRadioGroup/index.vue"
import HxSteps from "@/components/HxSteps/index.vue"

function install(Vue){   //外部的Vue.use(MyLib)会执行该方法，完成组件的全局注册。
  Vue.use(HxRadioGroup)
  Vue.use( HxSteps)
}

if(window && window.Vue) {   //通过`script`标签引入的情况，在组件内部完成组件注册。
  Vue.use(install)
}

export default install
