<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate"  v-if="hasAuth('user:add')">
        添加
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="角色" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备权限" width="" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.role == '系统管理员'">*</span>
          <span v-else>{{ scope.row.devices }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter" size="mini">{{ scope.row.status | showStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_time" label="添加时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatTimer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" v-if="hasAuth('user:delete') && hasAuth('user:update')">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showAllotDialog(scope.row.uid)">分配</el-button>
          <el-button type="danger" size="mini" @click="removeUserData(scope.row.uid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pagenum" :limit.sync="listQuery.pagesize" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="addForm" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" placeholder="输入密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input v-model="addForm.password2" type="password" placeholder="输入确认密码" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="addForm.role" @change="handleRoleChanged">
            <el-radio :label="1">系统管理员</el-radio>
            <el-radio :label="2">现场操作员</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="分配设备"
      :visible.sync="allotDialogVisible"
      width="400"
      center
      :append-to-body="true"
      @close="allotDialogClosed"
    >
      <el-form ref="allotFormRef" :model="allotForm" label-width="80px">
        <el-form-item label="设备编号" prop="deviceId">
          <el-select v-model="allotForm.devices" multiple clearable placeholder="请选择设备编号">
            <el-option
              v-for="item in devices"
              :key="item.value"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0" style="text-align: center">
          <el-button @click="allotDialogVisible=false">取消</el-button>
          <el-button type="primary" @click="allotDevice" :loading="loading">{{loadingText}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, addUserData, setDeviceData, deleteUserData } from '@/api/user'
import { getDevices } from '@/api/devices'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'User',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'danger'
      }
      return statusMap[status]
    },
    showStatus(status) {
      return (status == true)? '正常' : '下线'
    },
    formatTimer: function(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      tableKey: 0,
      total: 0,
      listQuery: {
        pagenum: 1,
        pagesize: 20,
        status: undefined,
        username: undefined
      },
      statusOptions: [
        { key: 0, display_name: '下线' },
        { key: 1, display_name: '正常' }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      addForm: {
        username: null,
        password: null,
        role: 2
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入初始密码', trigger: 'blur' },
          { trigger: 'blur',
            validator:(rule,value,callback)=>{
              let reg=/^[A-Za-z\d$@$!%*?&]{6,}/
              if (!reg.test(value)){
                callback(new Error('密码长度最少为6位'))
              }else if (value === this.addForm.oldPassword){
                callback(new Error('新密码不能与原密码相同'))
              }else{
                callback();
              }
            }
          }
        ],
        password2: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { trigger: 'blur',
            validator:(rule,value,callback)=>{
              let reg=/^[A-Za-z\d$@$!%*?&]{6,}/
              if (!reg.test(value)){
                callback(new Error('密码长度最少为6位!'))
              }else if (value != this.addForm.newPassword){
                callback(new Error('两次输入新密码不一致!'))
              }else{
                callback();
              }
            }
          }
        ]
      },
      loading: null,
      loadingText: '确定',
      devices: null,
      allotDialogVisible:false,
      allotForm: {
        uid:null,
        devices:null
      },
    }
  },
  created() {
    this.fetchData()
    this.getDevicesList()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.list = response.data.data.userList
        this.total = response.data.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pagenum = 1
      this.fetchData()
    },
    resetTemp() {
      this.addForm = {
        id: undefined,
        username: '',
        password: '',
        password2: '',
        role: 2
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleRoleChanged(role){
      this.temp.role = role
    },
    showAllotDialog(id){
      this.allotForm.uid=id;
      this.allotDialogVisible=true;
    },
    allotDialogClosed(){
      this.allotForm.devices=[]
      this.$refs.allotFormRef.resetFields()
    },
    allotDevice(){
      if (this.allotForm.devices.length!==0){
        setDeviceData(this.allotForm).then(res=>{
          this.allotDialogVisible=false
          this.fetchData()
        })
      } else {
        Message.error("请分配设备")
      }

    },
    removeUserData(id){
      deleteUserData(id).then(res=>{
        this.fetchData()
      })
    },
    handleSizeChange(newSize) {
      this.listQuery.pagesize=newSize
      this.fetchData()
    },
    handleCurrentChange(newPage) {
      this.listQuery.pagenum=newPage
      this.fetchData()
    },
    createData(){
      this.$refs.dataForm.validate(valid => {
        if (!valid ) return
        this.loading = true
        this.loadingText = '提交中'
        addUserData(this.addForm).then(res => {
          this.$message.success('添加成功')
          this.dialogFormVisible = false;
          this.fetchData()
        })
      })
    },
    getDevicesList(){
      getDevices().then(res=>{
        this.devices=res.data.data;
      })
    }
  }
}
</script>
