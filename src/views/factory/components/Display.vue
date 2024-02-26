<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="displayForm">
        <el-form-item label="设备编号">
          <el-select v-model="displayForm.device" clearable placeholder="请选择设备编号"
            @change="handleDeviceChanged">
            <el-option
              v-for="item in devices"
              :key="item.value"
              :label="item.label"
              :value="item.device">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            @change="handleDateChanged"
            v-model="displayForm.date"
            clearable=""
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="chart-container" id="bar-display"></div>
  </div>
</template>

<script>
import { getVisionBar } from '@/api/data'
import { getDevices } from '@/api/devices'

export default {
  name: "Display",
  data(){
    return{
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      displayForm: {
        device: null,
        date: null
      },
      queryInfo:{
        startDate:null,
        endDate:null,
        location:null,
        device:null
      },
      devices:null
    }
  },
  methods:{
    loadVisionBar(){
      this.queryInfo.device=this.displayForm.device
      getVisionBar(this.queryInfo).then(res => {
        if (res.data.data===null){
          let visionChart=this.$echarts.init(document.getElementById("bar-display"));
          visionChart.setOption({
            title: {
              text: '当前设备暂无监测数据',
              x: 'center',
              y: 'center',
              textStyle: {
                color: 'black',
                fontWeight: 'normal',
                fontSize: 16
              }
            },
          },true)
          window.addEventListener("resize",function(){
            visionChart.resize();
          });
        }else{
          let visionChart = this.$echarts.init(document.getElementById("bar-display"));
          visionChart.setOption({
            title: {
              text: '设备 '+res.data.data.deviceId+' 监测数据趋势'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              top: '8%',
              data: ['0°值', '90°值', '180°值', '270°值']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: res.data.data.sequence,
              axisLine: {
                show: true
              },
              axisLabel: {
                show: true
              },
            },
            yAxis: {
              type: 'value',
              axisLine: {
                show: true
              },
              axisLabel: {
                show: true
              },
              splitNumber:4,
            },
            series: [
              {
                name: '0°值',
                type: 'line',
                stack: '总量',
                data: res.data.data.zero
              },
              {
                name: '90°值',
                type: 'line',
                stack: '总量',
                data: res.data.data.nine
              },
              {
                name: '180°值',
                type: 'line',
                stack: '总量',
                data: res.data.data.eight
              },
              {
                name: '270°值',
                type: 'line',
                stack: '总量',
                data: res.data.data.seven
              }
            ]
          }, true)

          window.addEventListener("resize", function(){
            visionChart.resize();
          });
        }
      })
    },
    onSubmit() {
      this.loadVisionBar()
    },
    handleDeviceChanged(device){
      this.queryInfo.device=this.displayForm.device
      this.loadVisionBar()
    },
    handleDateChanged(dates){
      if(dates!==null){
        this.queryInfo.startDate=this.displayForm.date[0]+' 00:00:00'
        this.queryInfo.endDate=this.displayForm.date[1]+' 23:59:59'
      }else{
        this.queryInfo.startDate=''
        this.queryInfo.endDate=''
      }
      this.loadVisionBar()
    },
    getDevicesList(){
      let curPath = this.$route.path
      let m = curPath.match(/location\/(\d+)/)
      if (m.length > 1) {
        this.queryInfo.location = m[1]
      }
      getDevices(this.queryInfo).then(res=>{
        this.devices=res.data.data;
      })
    }

},
    // 生命周期 - 创建完成（可以访问当前this实例）",数据模型已加载，方法已加载,html模板已加载,html模板未渲染
    created () {
      this.getDevicesList()
    },
    // 生命周期 - 挂载完成（可以访问DOM元素）",html模板已渲染
    mounted () {
      this.loadVisionBar()
    }
}
</script>

<style scoped>
  .demo-form-inline{
    display: flex;
    justify-content: flex-start;
    height: 40px;
    line-height: 40px;
    margin-bottom: 20px;
  }
  .chart-container {
    position: relative;
    width: 100%;
    /* height: calc(100vh - 84px); */
    height: 400px;
  }
</style>