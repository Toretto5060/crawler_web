import axios from './resouce'
const host = process.env.VUE_APP_BASEURL

// 获取法院信息及表中总长度
export const getCourt = params => {
  return axios.get(host + '/getCourt', { params })
}

// 获取上海高院开庭信息
export const getCourtSh = params => {
  return axios.post(host + '/court/sh', params)
}
