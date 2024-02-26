<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="deviceForm" :inline="true">
        <el-form-item label="设备编号">
          <el-input v-model="deviceForm.device" placeholder="请输入设备编号" style="width: 200px;" class="filter-item" @keyup.enter.native="onSubmit" @clear="loadVisionList" clearable />
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            @change="handleDateChanged"
            v-model="deviceForm.date"
            clearable=""
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSubmit">
          搜索
        </el-button>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      :data="visionList"
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
      <el-table-column label="设备编号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.deviceId }}
        </template>
      </el-table-column>
      <el-table-column label="场站" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电池电量" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.voltage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="0°值" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.zeroWallThickness }}</span>
        </template>
      </el-table-column>
      <el-table-column label="90°值" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nintyWallThickness }}</span>
        </template>
      </el-table-column>
      <el-table-column label="180°值" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oneEightZeroWallThickness }}</span>
        </template>
      </el-table-column>
      <el-table-column label="270°值" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.twoSevenZeroWallThickness }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采集时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.collectTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="" align="center" v-if="hasAuth('vision:delete')">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="removeVisionData(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryInfo.pagenum" :limit.sync="queryInfo.pagesize" @pagination="loadVisionList" />

  </div>
</template>

<script>
import { getDeviceList, getDevices, getDeviceById } from '@/api/devices'
import { getVisionList, deleteVisionData } from '@/api/data'
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
        date: null
      },
      queryInfo:{
        pagenum:1,
        pagesize:10,
        location:null,
        device:null
      },
      total:0,
      visionList:null,
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
    this.loadVisionList()
  },
  methods: {
    loadVisionList() {
      let curPath = this.$route.path
      let m = curPath.match(/location\/(\d+)/)
      if (m.length > 1) {
        this.queryInfo.location = m[1]
      }
      this.queryInfo.device=this.deviceForm.device
      getVisionList(this.queryInfo).then(res=>{
          if (res.data.data===null){
              this.visionList=null
          }else{
              this.visionList=res.data.data.visionList
              this.total=res.data.data.total
          }
        })
    },
    onSubmit() {
      this.loadVisionList()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize=newSize
      this.loadVisionList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum=newPage
      this.loadVisionList()
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
    removeVisionData(id){
        deleteVisionData(id).then(res=>{
            this.loadVisionList()
        })
    }
  }
}
</script>
