import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon

// import '@/permission' // 权限控制

import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})


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
  },
  getNextMouth(month) {  // 获取距离现在几个月日期
    let today = new Date().getTime()
    let formatData = new Date(today).toISOString().split('T')[0]
    let splitData = formatData.split('-')

    let num = 0
    let bigMonth = [1,3,5,7,8,10,12]
    let smallMonth = [2,4,6,9,11]
    let bigNum = 31
    let smallNum = 30

    let thisMonth = Number(splitData[1])
    let thisMonthList = []
    thisMonthList.push(thisMonth)
    for (let i=0; i < month; i++) {
      thisMonth += 1
      if (thisMonth > 12) {
        thisMonth = thisMonth - 12
      }
      thisMonthList.push(thisMonth)
    }

    for (let j = 0; j < thisMonthList.length - 1; j ++) {
      if(bigMonth.indexOf(thisMonthList[j]) > -1) {
        num += bigNum
      } else if (smallMonth.indexOf(thisMonthList[j]) > -1) {
        num += smallNum
      }
    }
    let newData = today + 60 * 60 * 1000 * 24 * num
    return new Date(newData).toISOString().split('T')[0]
  },
  checkTime(startDate,endDate,month) {  // 判断时间是否是某几个个月内，满足返回true,反之
    var begintime = startDate;
    var endtime = endDate;
    if(!endtime){
        return true;
    }
    var time1 = new Date(begintime).getTime();
    var time2 = new Date(endtime).getTime();
    if(begintime==''){
        alert("开始时间不能为空");
        return false;
    }
    if(endtime==''){
        alert("结束时间不能为空");
        return false;
    }
    if(time1 > time2){
        alert("开始时间不能大于结束时间");
        return false;
    }
    //判断时间跨度是否大于某个月
    var arr1 = begintime.split('-');
    var arr2 = endtime.split('-');
    arr1[1] = parseInt(arr1[1]);
    arr1[2] = parseInt(arr1[2]);
    arr2[1] = parseInt(arr2[1]);
    arr2[2] = parseInt(arr2[2]);
    var flag = true;
    if(arr1[0] == arr2[0]){//同年
        if(arr2[1]-arr1[1] > month){ //月间隔超过某个月
            flag = false;
        }else if(arr2[1]-arr1[1] == month){ //月相隔某个月，比较日
            if(arr2[2] > arr1[2] || arr2[2] == arr1[2]){ //结束日期的日大于开始日期的日
                flag = false;
            }
        }
    }else{ //不同年
        if(arr2[0] - arr1[0] > 1){
            flag = false;
        }else if(arr2[0] - arr1[0] == 1){
            if(arr1[1] < 10){ //开始年的月份小于10时，不需要跨年
                flag = false;
            }else if(arr1[1]+month-arr2[1] < 12){ //月相隔大于某个月
                flag = false;
            }else if(arr1[1]+month-arr2[1] == 12){ //月相隔某个月，比较日
                if(arr2[2] > arr1[2]  || arr2[2] == arr1[2]){ //结束日期的日大于开始日期的日
                    flag = false;
                }
            }
        }
    }
    if(!flag){
      return false;
    }
    return true;
  },
}
