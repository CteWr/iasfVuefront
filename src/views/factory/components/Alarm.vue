<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="deviceForm" :inline="true">
        <el-form-item label="设备编号">
          <el-input v-model="deviceForm.device" placeholder="请输入设备编号" style="width: 200px;" class="filter-item" @keyup.enter.native="onSubmit" @clear="loadAlarmList" clearable />
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSubmit">
          搜索
        </el-button>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      :data="alarmList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="设备编号" width="" align="center">
        <template slot-scope="scope">
          {{ scope.row.deviceId }}
        </template>
      </el-table-column>
      <el-table-column label="设备地址" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警值" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警原因" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmReason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="" align="center" v-if="hasAuth('alarm:delete')">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="removeAlarmData(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryInfo.pagenum" :limit.sync="queryInfo.pagesize" @pagination="loadAlarmList" />

  </div>
</template>

<script>
import { getDeviceList, getDevices, getDeviceById } from '@/api/devices'
import { getAlarmList, deleteAlarmData } from '@/api/alarm'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'History',
  components: { Pagination },
  filters: {
  },
  data() {
    return {
      deviceForm: {
        device: null,
        location: null,
        date: null
      },
      queryInfo:{
        pagenum:1,
        pagesize:10,
        device:null
      },
      total:0,
      alarmList:null,
      addDialogVisible:false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      loading:false,
      loadingText:'确定',
    }
  },
  created() {
    this.loadAlarmList()
  },
  methods: {
    loadAlarmList() {
      let curPath = this.$route.path
      let m = curPath.match(/location\/(\d+)/)
      if (m.length > 1) {
        this.queryInfo.location = m[1]
      }

      this.queryInfo.device=this.deviceForm.device
      getAlarmList(this.queryInfo).then(res=>{
          if (res.data.data===null){
              this.alarmList=null
          }else{
              this.alarmList=res.data.data.alarmList
              this.total=res.data.data.total
          }
        })
    },
    onSubmit() {
      this.loadAlarmList()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize=newSize
      this.loadAlarmList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum=newPage
      this.loadAlarmList()
    },
    handleDateChanged(dates){
      if(dates!==null){
        this.queryInfo.startDate=this.deviceForm.date[0]+' 00:00:00'
        this.queryInfo.endDate=this.deviceForm.date[1]+' 23:59:59'
      }else{
        this.queryInfo.startDate=''
        this.queryInfo.endDate=''
      }
      // this.loadVisionList()
    },
    removeAlarmData(id){
        deleteAlarmData(id).then(res=>{
            this.loadAlarmList()
        })
    }
  }
}
</script>
