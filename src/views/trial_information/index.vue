<template>
  <div class="information">
    <el-form ref="form" :model="form">
      <el-form-item label="开庭日期">
        <el-date-picker
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
        <el-input v-model="form.presiding_judge" />
      </el-form-item>
      <el-form-item label="原告">
        <el-input v-model="form.plaintiff" />
      </el-form-item>
      <el-form-item label="被告">
        <el-input v-model="form.defendant" />
      </el-form-item>
      <el-form-item label="案号">
        <el-input v-model="form.case_num" />
      </el-form-item>
    </el-form>
    <el-button icon="el-icon-search" circle @click="getData" />
  </div>
</template>

<script>
import { getCourtSh, getCourt } from '../../api/index'
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
        case_num: ''
      },
      options: [{
        value: '',
        label: '全部'
      }],
      selectItems: ''
    }
  },
  created() {
  },
  mounted() {
    this.setDefault()
  },
  methods: {
    /**
     *设置默认起始日期
     */
    setDefault() {
      const today = this.fuc.getNowFormatDate()
      const splitToday = this.fuc.getNowFormatDate().split('-')
      const nextMonth = splitToday[0] + '-' + ((Number(splitToday[1]) + 1) > 9 ? (Number(splitToday[1]) + 1) : '0' + (Number(splitToday[1]) + 1)) + '-' + splitToday[2]
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
        }
      })
    },
    isChange(data) {
      this.form.startDate = data[0]
      this.form.endDate = data[1]
    },
    selectItem() {
      this.form.court = this.selectItems
    },
    getData() {
      getCourtSh(this.form).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .information{
    padding: 20px;
  }
</style>
<style lang="less">
  .information{
    .el-range-input:nth-child(4) {
      margin-left: 12px;
    }
  }
</style>
