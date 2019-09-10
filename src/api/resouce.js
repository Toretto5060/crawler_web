import Vue from "vue"
import axios from "axios"
import router from "../router"
import store from "../store"
let axiosIns = axios.create({
  // timeout: 6000
})
// axiosIns.defaults.timeout = 5000
// http request 请求拦截器
axiosIns.interceptors.request.use(
  config => {
    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    // const token = localStorage.getItem("blog_token") ? localStorage.getItem("blog_token") : store.state.token
    // token && (config.headers.blog_token = token)
    return config
  },
  error => {
    return error
  }
)
// 添加响应拦截器
axiosIns.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(response.data)
    }
  },
  error => {
    let msg = ""
    if (error.response.status) {
      if (error.response.request.responseURL.indexOf('checkLogin') < 0) {
        msg = error.response.data.msg
      }
      switch (error.response.status) {
        case 401:
        router.push({ path: '/login' })
        break
      }
    } else {
      msg = 'TIME OUT'
    }
    if (msg) {
      Vue.prototype.$Message.error(msg)
    }
    return Promise.reject(error.response.data)
  }
)
export default axiosIns
