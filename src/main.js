import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css

import '@/icons' // icon
// import '@/permission' // 权限控制

// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

/**
 * 顶部进度条
 **/
// 简单配置
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

Vue.use(ElementUI) //, { locale }

Vue.config.productionTip = false

Vue.prototype.fuc = {
  formatData(data) {
    const datas = new Date(data)
    console.log(datas)
  },
  getNowFormatDate() {
    const date = new Date()
    const seperator1 = '-'
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    let strDate = date.getDate()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    const currentdate = year + seperator1 + month + seperator1 + strDate
    return currentdate
  }
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
