import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './permission'

import './style/common.scss'
// import VueBarcode from 'vue-barcode'
// import Print from 'vue-print-nb'
// Vue.use(Print)
// Vue.component('barcode', VueBarcode)

import * as utils from './utils'
import bus from './utils/bus'
import './utils/icons.js'
// import Print from 'vue-print-nb'

// Vue.use(Print) // 注册
import '@/assets/iconFont/iconfont.css'
import filters from '@/filters'
import directives from '@/directives'

import ElementUI from 'element-ui'
import Fragment from 'vue-fragment'

import UmyUi from 'umy-ui'
import 'umy-ui/lib/theme-chalk/index.css'

/** 表格组件 */
import HxTable from '@/components/HxTable'
/** 视图卡片组件 */
import HxViewCard from './components/HxViewCard/index'
/** 搜索表单组件 */
import HxSearchForm from './components/HxSearchForm/index'
/** 表单组件 */
import HxForm from './components/HxForm/index'
import HxFormItem from './components/HxForm/HxFormItem/index'
/** 数字输入框组件 */
import HxInputNumber from './components/HxInputNumber/index'
/** 操作分隔符组件 */
import HxCutOff from './components/HxCutOff/index'
/** 字典项选择器 */
import HxKeyValueSelect from './components/HxKeyValueSelect/index'
/** svg-icon */
import HxSvgIcon from './components/HxSvgIcon/index'

// import VueSocketIO from 'vue-socket.io'
// import SocketIO from 'socket.io-client'
// 自定义过滤器
Object.keys(filters).forEach(filterName => {
  Vue.filter(filterName, filters[filterName])
})

// 自定义
Object.keys(directives).forEach(filterName => {
  Vue.directive(filterName, directives[filterName])
})

Vue.use(Fragment.Plugin)
Vue.use(ElementUI)
Vue.use(UmyUi)

Vue.component('HxTable', HxTable)
Vue.component('HxViewCard', HxViewCard)
Vue.component('HxSearchForm', HxSearchForm)
Vue.component('HxForm', HxForm)
Vue.component('HxFormItem', HxFormItem)
Vue.component('HxInputNumber', HxInputNumber)
Vue.component('HxCutOff', HxCutOff)
Vue.component('HxKeyValueSelect', HxKeyValueSelect)
Vue.component('HxSvgIcon', HxSvgIcon)

Vue.prototype.$utils = utils
Vue.prototype.$bus = bus

Vue.config.productionTip = false


// Vue.use(new VueSocketIO({
//   debug: true,
//   // connection: 'http://172.30.14.184:10087',
//   connection: SocketIO('ws://172.30.14.184:10087', { path: '/imserver/imserver/89889', 'Access-Control-Allow-Origin': '*' }),
//   extraHeaders: { 'Access-Control-Allow-Origin': '*' }
//   // vuex: {
//   //   store,
//   //   actionPrefix: 'SOCKET_',
//   //   mutationPrefix: 'SOCKET_'
//   // }
//   // options: { path: '/tushu/', transports: ['websocket'] }
//   // options: { path: '/imserver/89889' } // Optional options
// }))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
