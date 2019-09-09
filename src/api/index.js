import axios from './resouce'
const host = process.env.VUE_APP_BASEURL

// 检测用户名是否可用
export const getCourt = params => {
  return axios.post(host + '/court/sh', params)
}
