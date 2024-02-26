<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="">
          <el-input v-model="searchForm.name" placeholder="请输入课题名称" style="width: 200px;" class="filter-item" @keyup.enter.native="onSubmit" @clear="loadLocationList" />
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSubmit">
          搜索
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate" v-if="hasAuth('param:add')">
          添加
        </el-button>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      :data="locationList"
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
      <el-table-column label="课题编码" width="" align="center">
        <template slot-scope="scope">
          {{ scope.row.projectid }}
        </template>
      </el-table-column>
      <el-table-column label="课题名称" width="" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="角色" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="" align="center" v-if="hasAuth('alarm:delete')">
        <template slot-scope="scope">
          <pdf
            :src="pdfUrl"
            :page="currentPage"
            @num-pages="pageCount=$event"
            @page-loaded="currentPage=$event"
            @loaded="loadPdfHandler">
          </pdf>
          <el-button type="info" size="mini" @click="downOrder()">下载</el-button>

          <el-button type="danger" size="mini" @click="removeLocationData(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryInfo.pagenum" :limit.sync="queryInfo.pagesize" @pagination="loadLocationList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDialogVisible">
      <el-form  ref="addFormRef" :rules="addFormRules" :model="addForm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item v-if="dialogStatus==='create'" label="课题名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入课题名称" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="课题描述" prop="description">
          <el-input v-model="addForm.description" placeholder="请输入课题描述" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="主要学科">
          <el-radio-group v-model="addForm.mainSubject" style="margin-right: 12px">
            <el-radio v-for="(radio, index) in Subjectlist" :label="radio" :key="index">{{radio}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="实验方法">
          <el-radio-group v-model="addForm.fangfa" style="margin-right: 12px">
            <el-radio v-for="(radio, index) in methodsList" :label="radio" :key="index">{{radio}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <pdfupload v-if="dialogStatus==='create'"></pdfupload>
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
  </div>
</template>

<script>
import { getLocationList, addLocationData, updateLocationData, deleteLocationData, getLocationById } from '@/api/location'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import uploadfile from '@/views/project/uploadfile'
import pdfupload from '@/views/project/pdfupload'
export default {
  name: 'Location',
  components: {
    Pagination,
    uploadfile,
    pdfupload
  },
  filters: {
  },
  data() {
    return {
      Subjectlist: ['物理学', '化学', '天文学', '生物学'],
      methodsList: ['衍射', '散射', '成像', '小角', '荧光'],
      isIndeterminate: false,
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: 'pdf', // 文件类型
      pdfUrl: '', // pdf文件地址
      searchForm: {
        name: null
      },
      queryInfo: {
        pagenum: 1,
        pagesize: 10,
        name: null,
      },
      total: 0,
      locationList: null,
      addDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '下载',
        create: '创建'
      },
      addForm: {
        name: null,
        description: null,
        mainSubject: null,
        fangfa: []
      },
      addFormRules: {
        name: [{ required: true, message: '请输入课题名称', trigger: 'blur'}],
        description: [{ required: false, message: '请输入场站描述', trigger: 'blur'}]
      },
      loading: false,
      loadingText: '确定'
    }
  },
  created() {
    this.loadLocationList()
  },
  methods: {
    handleCheckedColumnChangeSales(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.names.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.addForm.fangfa.length
    },
    initPdf(){
      //这里的PDF路径就是上传到后台的路径
      this.downloadFileUrl = 'http://xxx.xxx.xxx.xxx/file.pdf';
      this.pdfUrl = 'http://xxx.xxx.xxx.xxx/file.pdf';
    },
    downOrder(){
      window.location.href = "http://xxx.xxx.xxx.xxx/downloadFile?token=xxx&path=" + this.downloadFileUrl;
      this.$message.success('下载成功！');
    },
    loadLocationList() {
      this.queryInfo.name = this.searchForm.name
      getLocationList(this.queryInfo).then(res=>{
          if (res.data.data===null) {
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
        description:null,
        mainSubject: null,
        methods: null
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
    removeLocationData(id){
      deleteLocationData(id).then(res=>{
        this.loadLocationList()
      })
    },
    editDialog(id){
      this.dialogStatus = 'update'
      getLocationById(id).then(res=>{
        this.addForm=res.data.data
      })
      this.addDialogVisible=true;
      this.$refs.addFormRef.clearValidate()
    },
    updateLocation(){
      this.$refs.addFormRef.validate(valid=>{
        if (!valid) return
        this.loading=true
        this.loadingText='提交中'
        updateLocationData(this.addForm).then(res=>{
          this.loading=false
          this.$message.success('下载成功')
          this.addDialogVisible=false;
          this.loadLocationList()
        })
      })
    }
  }
}
</script>
