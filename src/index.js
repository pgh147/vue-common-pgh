//  src/index.js
import HxRadioGroup from "@/components/HxRadioGroup/index.vue"
import HxSteps from "@/components/HxSteps/index.vue"

function install(Vue){   //�ⲿ��Vue.use(MyLib)��ִ�и÷�������������ȫ��ע�ᡣ
  Vue.use(HxRadioGroup)
  Vue.use( HxSteps)
}

if(window && window.Vue) {   //ͨ��`script`��ǩ����������������ڲ�������ע�ᡣ
  Vue.use(install)
}

export default install
