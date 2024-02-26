<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="">
          <el-input v-model="searchForm.name" placeholder="请输入场站名称" style="width: 200px;" class="filter-item" @keyup.enter.native="onSubmit" @clear="loadLocationList" />
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSubmit">
          搜索
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate" v-if="hasAuth('param:add')">
          添加
        </el-button>
      </el-form>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDialogVisible">
      <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="课题名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入课题名称" />
        </el-form-item>
        <el-form-item label="场站描述" prop="description">
          <el-input v-model="addForm.description" placeholder="请输入课题描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?addLocation():updateLocation()">
          确认
        </el-button>
      </div>
    </el-dialog>
</template>

<script>
import { getLocationList, addLocationData, updateLocationData, deleteLocationData, getLocationById } from '@/api/location'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'Location',
  data() {
    return {
      searchForm: {
        name: null
      },
      queryInfo:{
        pagenum:1,
        pagesize:10,
        name:null
      },
      total:0,
      locationList:null,
      addDialogVisible:false,
      dialogStatus: '',
      textMap: {
        update: '下载',
        create: '创建'
      },
      addForm: {
        name:null,
        description:null
      },
      addFormRules:{
        name:[{required:true,message:"请输入课题名称",trigger:'blur'}],
        description:[{required:false,message:"请输入课题描述",trigger:'blur'}]
      },
      loading:false,
      loadingText:'确定',
    }
  },
  methods: {
    loadLocationList() {
      this.queryInfo.name = this.searchForm.name
      getLocationList(this.queryInfo).then(res=>{
          if (res.data.data===null){
              this.locationList=null
          }else{
              this.locationList=res.data.data.locationList
              this.total=res.data.data.total
          }
        })
    },
    onSubmit() {
      this.loadLocationList()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize=newSize
      this.loadLocationList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum=newPage
      this.loadLocationList()
    },
    removeLocationData(id){
        deleteLocationData(id).then(res=>{
            this.loadLocationList()
        })
    },
    resetForm() {
      this.addForm = {
        name:null,
        description:null
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.addDialogVisible = true
      this.$nextTick(() => {
        this.$refs['addFormRef'].clearValidate()
      })
    },
    addLocation(){
      this.$refs.addFormRef.validate(valid=>{
        if (!valid) return
        this.loading=true
        this.loadingText='提交中'
        addLocationData(this.addForm).then(res=>{
          this.loading=false
          this.$message.success('添加成功')
          this.addDialogVisible=false;
          this.loadLocationList()
        })
      })
    },
    addDialogClosed(){
      this.loading=false
      this.loadingText='确定'
      this.$refs.addFormRef.resetFields()
    },
  }
}
</script>

