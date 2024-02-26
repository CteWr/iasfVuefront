<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="deviceForm.device" placeholder="请输入设备编号" style="width: 200px;" class="filter-item" @keyup.enter.native="onSubmit" @clear="loadDeviceList" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSubmit">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate" v-if="hasAuth('device:add')">
        添加
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="deviceList"
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
      <el-table-column label="设备编号" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.deviceId }}
        </template>
      </el-table-column>
      <el-table-column label="设备地址" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="场站" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管内介质" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inPipeMedium }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管内温度" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inPipeTemperature }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管内压力" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inPipePressure }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管径" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pipeDiameter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原始值" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.originWallThickness }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物联网卡号" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.iotCardId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管道描述" width="240" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pipelineDescribe }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260" align="center" v-if="hasAuth('device:delete')">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addDataDialog(scope.row.deviceId)">添加初始数据</el-button>
          <el-button type="info" size="mini" @click="editDialog(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="mini" @click="removeDeviceData(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryInfo.pagenum" :limit.sync="queryInfo.pagesize" @pagination="loadDeviceList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDialogVisible">
      <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="设备编号" prop="deviceId">
          <el-input v-model="addForm.deviceId" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="场站" prop="location">
          <!-- <el-input v-model="addForm.location" placeholder="请输入设备地址" /> -->
          <el-select v-model="addForm.locationId" v-bind:disabled="selDisabled" clearable placeholder="请选择场站" @change="handleLocationSelected">
            <el-option
              v-for="item in locations"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备地址" prop="address">
          <el-input v-model="addForm.address" placeholder="请输入设备地址" />
        </el-form-item>
        <el-form-item label="管内介质" prop="inPipeMedium">
          <el-input v-model="addForm.inPipeMedium" placeholder="请输入管内介质" />
        </el-form-item>
        <el-form-item label="管内温度" prop="inPipeTemperature">
          <el-input v-model="addForm.inPipeTemperature" placeholder="请输入管内温度" />
        </el-form-item>
        <el-form-item label="管内压力" prop="inPipePressure">
          <el-input v-model="addForm.inPipePressure" placeholder="请输入管内压力" />
        </el-form-item>
        <el-form-item label="管径" prop="pipeDiameter">
          <el-input v-model="addForm.pipeDiameter" placeholder="请输入管径" />
        </el-form-item>
        <el-form-item label="原始值" prop="originWallThickness">
          <el-input v-model="addForm.originWallThickness" placeholder="请输入原始值" />
        </el-form-item>
        <el-form-item label="物联网卡号" prop="iotCardId">
          <el-input v-model="addForm.iotCardId" placeholder="请输入物联网卡号" />
        </el-form-item>
        <el-form-item label="左边距" prop="leftDistance">
          <el-input v-model="addForm.leftDistance" placeholder="请输入左边距百分比，如50" />
        </el-form-item>
        <el-form-item label="上边距" prop="topDistance">
          <el-input v-model="addForm.topDistance" placeholder="请输入上边距百分比，如50" />
        </el-form-item>
        <el-form-item label="管道描述" prop="pipelineDescribe">
          <el-input v-model="addForm.pipelineDescribe" type="textarea" placeholder="请输入管道描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?addDevice():updateDevice()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加初始数据" :visible.sync="addDataDialogVisible">
      <el-form ref="addDataFormRef" :rules="addDataFormRules" :model="addDataForm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="电池电量" prop="voltage">
          <el-input v-model="addDataForm.voltage" placeholder="请输入电池电量" />
        </el-form-item>
        <el-form-item label="0°值" prop="zeroWallThickness">
          <el-input v-model="addDataForm.zeroWallThickness" placeholder="请输入0°值" />
        </el-form-item>
        <el-form-item label="90°值" prop="nintyWallThickness">
          <el-input v-model="addDataForm.nintyWallThickness" placeholder="请输入90°值" />
        </el-form-item>
        <el-form-item label="180°值" prop="oneEightZeroWallThickness">
          <el-input v-model="addDataForm.oneEightZeroWallThickness" placeholder="请输入180°值" />
        </el-form-item>
        <el-form-item label="270°值" prop="twoSevenZeroWallThickness">
          <el-input v-model="addDataForm.twoSevenZeroWallThickness" placeholder="请输入270°值" />
        </el-form-item>
        <el-form-item label="采集时间" prop="collectTime">
          <el-date-picker
            v-model="addDataForm.collectTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDataDialogVisible=false">
          取消
        </el-button>
        <el-button type="primary" @click="addData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDeviceList,deleteDeviceData,addDeviceData,getDevices,updateDeviceData,getDeviceById } from '@/api/devices'
import { addVisionData } from '@/api/data'
import { getLocationOptions } from '@/api/location'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Device',
  components: { Pagination },
  filters: {
  },
  data() {
    return {
      deviceForm: {
        device: null,
      },
      queryInfo:{
        pagenum:1,
        pagesize:10,
        device:null
      },
      total:0,
      deviceList:null,
      locations:null,
      addDialogVisible:false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      addForm: {
        deviceId:null,
        location:null,
        address:null,
        pipelineDescribe:null,
        inPipeMedium:null,
        inPipeTemperature:null,
        inPipePressure:null,
        pipeDiameter:null,
        originWallThickness:0,
        iotCardId:null,
        leftDistance:null,
        topDistance:null
      },
      addFormRules:{
        deviceId:[{required:true,message:"请输入设备编号",trigger:'blur'}],
        // location:[{required:true,message:"请选择场站",trigger:'change'}],
        pipelineDescribe:[{required:true,message:"请输入管道描述",trigger:'blur'}],
        inPipeMedium:[{required:true,message:"请输入管内介质",trigger:'blur'}],
        inPipeTemperature:[{required:true,message:"请输入管内温度",trigger:'blur'}],
        inPipePressure:[{required:true,message:"请输入管内压力",trigger:'blur'}],
        pipeDiameter:[{required:true,message:"请输入管径",trigger:'blur'}],
        originWallThickness:[{required:true,message:"请输入原始值",trigger:'blur'}],
        iotCardId:[{required:true,message:"请输入物联网卡号",trigger:'blur'}],
        leftDistance:[{required:true,message:"请输入左边距",trigger:'blur'}],
        topDistance:[{required:true,message:"请输入上边距",trigger:'blur'}],
      },
      addDataDialogVisible:false,
      addDataForm: {
        deviceId:null,
        voltage:null,
        zeroWallThickness:null,
        nintyWallThickness:null,
        oneEightZeroWallThickness:null,
        twoSevenZeroWallThickness:null,
        collectTime:null
      },
      addDataFormRules:{
        voltage:[{required:true,message:"请输入电池电量",trigger:'blur'}],
        zeroWallThickness:[{required:true,message:"请输入0°值",trigger:'blur'}],
        nintyWallThickness:[{required:true,message:"请输入90°值",trigger:'blur'}],
        oneEightZeroWallThickness:[{required:true,message:"请输入180°值",trigger:'blur'}],
        twoSevenZeroWallThickness:[{required:true,message:"请输入270°值",trigger:'blur'}],
        collectTime:[{required:true,message:"请选择采集时间",trigger:'blur'}],
      },
      selDisabled:false,
      loading:false,
      loadingText:'确定',
    }
  },
  created() {
    this.loadDeviceList()
    this.loadLocationList()
  },
  methods: {
    loadDeviceList() {
      this.queryInfo.device=this.deviceForm.device
      getDeviceList(this.queryInfo).then(res=>{
          if (res.data.data===null){
              this.deviceList=null
          }else{
              this.deviceList=res.data.data.deviceList
              this.total=res.data.data.total
          }
        })
    },
    onSubmit() {
      this.loadDeviceList()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize=newSize
      this.loadDeviceList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum=newPage
      this.loadDeviceList()
    },
    handleLocationSelected(location){
      this.addForm.location=location
    },
    loadLocationList() {
      getLocationOptions().then(res => {
        this.locations = res.data.data
      })
    },
    resetForm() {
      this.addForm = {
        deviceId:null,
        locationId:null,
        address:null,
        pipelineDescribe:null,
        inPipeMedium:null,
        inPipeTemperature:null,
        inPipePressure:null,
        pipeDiameter:null,
        originWallThickness:0,
        iotCardId:null,
        leftDistance:null,
        topDistance:null
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.selDisabled = false
      this.addDialogVisible = true
      this.$nextTick(() => {
        this.$refs['addFormRef'].clearValidate()
      })
    },
    addDevice(){
      this.$refs.addFormRef.validate(valid=>{
        if (!valid) return
        this.loading=true
        this.loadingText='提交中'
        addDeviceData(this.addForm).then(res=>{
          this.loading=false
          this.$message.success('添加成功');
          this.addDialogVisible=false;
          this.loadDeviceList()
        })
      })
      getDevices().then(res=>{
        this.$store.commit("setDevices",res.data.data)
      })
    },
    addDialogClosed(){
      this.loading=false
      this.loadingText='确定'
      this.$refs.addFormRef.resetFields()
    },
    removeDeviceData(id){
        deleteDeviceData(id).then(res=>{
            this.loadDeviceList()
        })
    },
    editDialog(id){
      this.dialogStatus = 'update'
      this.selDisabled = true
      getDeviceById(id).then(res=>{
        this.addForm=res.data.data
        this.$refs['addFormRef'].clearValidate()
      })
      this.addDialogVisible=true
    },
    updateDevice(){
      this.$refs.addFormRef.validate(valid=>{
        if (!valid) return
        this.loading=true
        this.loadingText='提交中'
        updateDeviceData(this.addForm).then(res=>{
          this.loading=false
          this.$message.success('修改成功')
          this.addDialogVisible=false
          this.loadDeviceList()
        })
      })
    },
    addDataDialog(deviceId) {
      this.addDataForm.deviceId=deviceId
      this.addDataDialogVisible = true
    },
    addData(){
      this.$refs.addDataFormRef.validate(valid=>{
        if (!valid) return
        this.addDataForm.collectTime=this.addDataForm.collectTime.toLocaleString()
        this.loading=true
        this.loadingText='提交中'
        addVisionData(this.addDataForm).then(res=>{
          this.loading=false
          this.$message.success('添加成功');
          this.addDataDialogVisible=false;
          this.loadDeviceList()
        })
      })
    }
  }
}
</script>
