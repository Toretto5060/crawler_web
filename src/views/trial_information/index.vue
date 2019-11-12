<template>
  <div class="information">
    <el-row
     v-loading="tableLoading"
        :element-loading-text="loadingText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.2)"
    >
      <div class="cont">
        <div class="titles">
          <el-form ref="form" :model="form">
            <el-form-item label="开庭日期">
              <el-date-picker
              :clearable="false"
                v-model="date"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                @change="isChange"
              />
            </el-form-item>
            <el-form-item label="法院">
              <el-select v-model="selectItems" placeholder="" @change="selectItem">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="审判长">
              <el-input v-model="form.presiding_judge" clearable />
            </el-form-item>
            <el-form-item label="原告">
              <el-input v-model="form.plaintiff" clearable />
            </el-form-item>
            <el-form-item label="被告">
              <el-input v-model="form.defendant" clearable />
            </el-form-item>
            <el-form-item label="案号">
              <el-input v-model="form.case_num" clearable />
            </el-form-item>
          </el-form>
          <el-button style="float:left;margin-left:1rem" :disabled="btnDisabled" :loading="btnLoading" icon="el-icon-search" circle @click="getData" />
        </div>
        <div class="textCont">
          <div class="attention">
            <div class="textTop">
              <span>* </span>
              <div class="statement">数据来源:<a href="http://www.hshfy.sh.cn/shfy/gweb2017/ktgg_search.jsp?zd=splc" target="_Blank">上海市高级人民法院 → 开庭公告</a></div>
            </div>
            <div class="textBom">
              <div class="text">共有{{allCourtNum}}条数据</div>
              <div v-if="selectShow">&nbsp;&nbsp;&nbsp;查询到{{selectCourtNum}}条数据</div>
            </div>
          </div>
        </div>
        <a :href="downLoadUrl" download="file" v-if="downLoadShow">
          <el-button  type="success" icon="el-icon-download" round>下载excel</el-button>
        </a>
        <!-- <div class="downLoad">
          <el-button v-if="downLoadShow" @click="downLoad"  type="success" icon="el-icon-download" round>下载excel</el-button>
        </div> -->
        <div class="tables">
          <el-table
            :data="tableData"
            style="width:54.69rem;"
            height=680
          >
            <el-table-column
              v-for="(item,index) in tableTitle" :key="index"
              :prop=item.prop
              :label=item.label
              :width=item.width
            />
          </el-table>
          <!-- <div class="statement">
            <p>表格数据用于核对数据，默认显示30条数据;数据顺序可能与官网略有不同，请核对后下载!</p>
            <p>暂不支持查询下载日期内全部数据，即<span>法院信息、审判长、原告、被告、案号</span>必填其一。</p>
          </div> -->
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import {ip, getCourtSh, getCourt } from '../../api/index'
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      date: [],
      form: {
        startDate: '',
        endDate: '',
        court: '',
        presiding_judge: '',
        plaintiff: '',
        defendant: '',
        case_num: '',
        init:true,
        // timestamp:''
      },
      options: [{
        value: '',
        label: '全部'
      }],
      selectItems: '',
      tableTitle:[{
        label:'法院',
        prop:'court',
        width:'50'
      },{
        label:'法庭',
        prop:'the_court',
        width:'100'
      },{
        label:'开庭日期',
        prop:'trial_date',
        width:'90'
      },{
        label:'案号',
        prop:'case_num',
        width:'140'
      },{
        label:'案由',
        prop:'cause_action',
        width:'95'
      },{
        label:'承办部门',
        prop:'department',
        width:'100'
      },{
        label:'审判长/主审人',
        prop:'presiding_judge',
        width:'100'
      },{
        label:'原告/上诉人',
        prop:'plaintiff',
        width:'100'
      },{
        label: '被告/被上诉人',
        prop: 'defendant',
        width: '100'
      },],
      tableData:[],
      tableLoading: false,
      btnLoading: false,
      allCourtNum: '',
      selectCourtNum: '',
      selectShow: false,
      btnDisabled: true,
      downLoadShow: false,
      loadingText: '',
      workbook: '',
      worksheet: '',
      downLoadUrl:''
    }
  },
  created() {
  },
  watch: {
    'form.court'(){
      if (this.isEmpty()) {
        this.btnDisabled = false
      } else {
        this.btnDisabled = true
      }
      this.downLoadShow = false
    },
    'form.presiding_judge'(){
      if (this.isEmpty()) {
        this.btnDisabled = false
      } else {
        this.btnDisabled = true
      }
      this.downLoadShow = false
    },
    'form.plaintiff'(){
      if (this.isEmpty()) {
        this.btnDisabled = false
      } else {
        this.btnDisabled = true
      }
      this.downLoadShow = false
    },
    'form.defendant'(){
      if (this.isEmpty()) {
        this.btnDisabled = false
      } else {
        this.btnDisabled = true
      }
      this.downLoadShow = false
    },
    'form.case_num'(){
      if (this.isEmpty()) {
        this.btnDisabled = false
      } else {
        this.btnDisabled = true
      }
      this.downLoadShow = false
    },
    'date'() {
      let startDate = this.date[0].split('-')
      let endDate = this.date[1].split('-')
      if (!this.fuc.checkTime(this.date[0],this.date[1],3)) {
        this.$notify({
          title: '时间范围过长',
          message: '为了良好体验，时间筛选范围每次最多三个月，已为你设置最大值',
          type: 'error'
        });
        this.date[1] = this.fuc.getNextMouth(3)
      }
    }
  },
  mounted() {
    this.setDefault();
    this.getData();     
  },
  methods: {
    /**
     *设置默认起始日期
     */
    setDefault() {
      const today = this.fuc.getNowFormatDate()
      const splitToday = this.fuc.getNowFormatDate().split('-');
      let nextMonth = this.fuc.getNextMouth(1)
      this.date = [today, nextMonth]
      this.form.startDate = this.date[0]
      this.form.endDate = this.date[1]
      getCourt().then((res) => {
        if (res.code === 0) {
          const newArr = [{
            value: '',
            label: '全部'
          }]
          for (const i in res.data.data) {
            const obj = {
              value: res.data.data[i],
              label: res.data.data[i]
            }
            newArr.push(obj)
          }
          this.options = newArr
          this.selectItems = this.options[0].value
          this.allCourtNum = res.data.total
        }
      })
    },
    isEmpty() {
      let thisItem = false;
      this.form.presiding_judge = (this.form.presiding_judge).replace(/\s*/g,"")
      this.form.plaintiff = (this.form.plaintiff).replace(/\s*/g,"")
      this.form.defendant = (this.form.defendant).replace(/\s*/g,"")
      this.form.case_num = (this.form.case_num).replace(/\s*/g,"")
      for (let i in this.form) {
        if (i != 'startDate' && i != 'endDate' && i != 'init' && i != 'timestamp' && this.form[i].indexOf(' ') == -1) {
          if (this.form[i].length > 0) {
              thisItem = true
          }
        }
      }
      return thisItem;
    },
    isChange(data) {
      this.form.startDate = data[0]
      this.form.endDate = data[1]
    },
    selectItem() {
      this.form.court = this.selectItems
    },
    getData() {
      this.tableLoading = true
      this.btnLoading = true
      this.tableData = []
      this.selectCourtNum = 0
      if (this.form.init) {
        this.loadingText = "数据正在赶来，请稍后"
      } else {
        this.loadingText = "资源较多，请耐心等待"
      }
      this.form.timestamp = Date.parse(new Date());
      getCourtSh(this.form).then((res) => {
        if (res.code == 0) {
          this.tableLoading = false
          this.btnDisabled = true    // 筛选完成，查询不可点击
          this.btnLoading = false
          const dataList = res.data.data
          if (dataList.length > 0) {
            for (let j in dataList) {
              if (j < 30) {
                let obj = {}
                for (let i in this.tableTitle) {
                  obj[this.tableTitle[i].prop] = dataList[j][this.tableTitle[i].prop]
                }
                this.tableData.push(obj)
              }
            }
            if (!this.form.init) {
              this.selectShow = true;
              this.selectCourtNum = res.data.data.length
              this.downLoadShow = true

              this.$message({
                message: '数据打包成功，下载excel请核对数据是否正确',
                type: 'success',
                center: true,
                duration:3500
              });

              this.downLoadUrl = ip + res.data.url
              // 处理成exceljs需要数据格式
              /**
               * 写入头部
               */
              let setWidth = [11,16.5,27,22,8.5,8.5,8.5,8.5,8.5];
              let titleList = []
              for (let x in this.tableTitle) {
                let obj = {
                  header: this.tableTitle[x].label,
                  key: this.tableTitle[x].label,
                  width: setWidth[x]
                }
                titleList.push(obj)
              }
              // this.worksheet.columns = titleList;

              for (let x=0; x<res.data.data.length; x++) {
                let rowData = []
                for (let y in res.data.data[x]) {
                  rowData.push(res.data.data[x][y])
                }
                let rowObj = {}
                for (let z in rowData) {
                  let attributeName = this.tableTitle[z].label
                  rowObj[attributeName] = rowData[z]
                }
                // this.worksheet.addRow(rowObj)
              }
            } else {
                if (!localStorage.getItem('popAlert')) {
                  setTimeout(()=>{
                  this.$confirm('<div class="statement" style="text-align: center"><p style="text-indent:2em">表格数据用于核对数据，默认显示30条数据;数据顺序可能与官网略有不同，请核对后下载!</p><p style="text-indent:2em">暂不支持查询下载日期内全部数据，即<span style="color:red">法院信息、审判长、原告、被告、案号</span>必填其一。</p></div>', '提示', {
                    confirmButtonText: '已阅',
                    cancelButtonText: '不再弹出',
                    type: 'warning',
                    center: true,
                    roundButton:true,
                    closeOnClickModal:false,
                    showClose:false,
                    dangerouslyUseHTMLString: true
                  }).then(() => {
                    
                  }).catch(() => {
                    localStorage.setItem('popAlert',false)
                  });
                },1500)
              }   
            }
          } else {
            this.downLoadShow = false;
          }
          this.form.init = false;
        }
      }).catch((err) => {
        this.tableLoading = false
        this.btnLoading = false
      })
    },
    downLoad() {
      location.href = this.downLoadUrl
    }
  }
}
</script>
<style lang="less" scoped>
  .information{
    width: 100%;
    height: 100%;
    // position: absolute;
    // top: 0;
    // left: 0;
    .cont {
      padding: 20px;
      .titles {
        width: 100%;
        float: left;
        // min-height: 5rem;
      }
      .textCont {
        width: 20rem;
        height: 3rem;
        float: left;
        font-size: 14px;
        color: #888;
        .attention {
          height: 3rem;
          .statement {
            margin-left: 0.6rem;
          }
          span {
            float: left;
            color:red;
            line-height: 1.3rem
          }
          .textTop {
            height: 1.5rem;
            line-height: 1rem;
            a {
              color: #4682B4
            }
          }
          .textBom {
            height: 2rem;
            div {
              float: left;
            }
          }
        }
      }
      .downLoad{
        float: left;
      }
      .tables {
        width:100%;
        float: left;
        position: relative;
        .el-table {
          float: left;
        }
        // .statement {
        //   color: #888;
        //   width: 12rem;
        //   float: left;
        //   margin-left: 5rem;
        //   margin: auto;
        //   // position: absolute;
        //   // top: 1rem;
        //   // left: 60rem;
        //   font-size: 14px;
        //   p {
        //     text-indent:1em;
        //     padding: 0;
        //     margin: 0;
        //     padding-bottom: 0.5rem;
        //     span {
        //       color: red;
        //     }
        //   }
        // }
      }
    }

  }
</style>
<style lang="less">
  .information{
    .el-row {
      width: 100%;
      height: 100%;
      overflow: auto
    }
    .el-range-input:nth-child(4) {
      margin-left: 12px;
    }
    .el-form-item__content {
      font-size: 16px;
    }
    .el-form {
      width: 100%;
      height: 100%;
    }
    .el-form-item {
      float: left;
    }
    .el-form-item:nth-child(1) {
      width: 22rem;
      .el-form-item__label {
        width: 4.6rem;
        text-align: left;
      }
      .el-date-editor,.el-range-editor,.el-input__inner,.el-date-editor--daterange {
        width: 16rem;
      }
    }
    .el-form-item:nth-child(2) {
      width: 9rem;
      .el-form-item__label {
        width: 2.6rem;
        text-align: left;
      }
      .el-date-editor,.el-range-editor,.el-input__inner,.el-date-editor--daterange {
        width: 5rem;
      }
    }
    .el-form-item:nth-child(3) {
      width: 10.5rem;
      .el-form-item__label {
        width: 3.6rem;
        text-align: left;
      }
      .el-form-item__content {
        width: 5.7rem;
        float: left;
      }
    }

    .el-form-item:nth-child(4) {
      width: 9.6rem;
      .el-form-item__label {
        width: 2.6rem;
        text-align: left;
      }
      .el-form-item__content {
        width: 5.7rem;
        float: left;
      }
    }
    .el-form-item:nth-child(5) {
      width: 9.6rem;
      float: left;
      .el-form-item__label {
        width: 2.6rem;
        text-align: left;
      }
      .el-form-item__content {
        width: 5.7rem;
        float: left;
      }
    }
    .el-form-item:nth-child(6) {
      width: 10rem;
      .el-form-item__label {
        width: 2.6rem;
        text-align: left;
      }
      .el-form-item__content {
        width: 7rem;
        float: left;
      }
    }
    .el-table {
      font-size: 12px;
    }
  }
</style>
