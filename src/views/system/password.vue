<template>
  <div class="app-container" style="">
    <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="120px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="addForm.oldPassword" type="password" placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="addForm.newPassword" type="password" placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="addForm.confirmPassword" type="password" placeholder="请输入确认密码" />
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel">重置</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserProfile,getMenu,setNewPassword } from '@/api/user'

export default {
  data() {
    return {
      userInfo:{
        username:'',
      },
      addForm: {
        oldPassword:null,
        newPassword:null,
        confirmPassword:null
      },
      addFormRules:{
        oldPassword:[
          {required: true, message: '旧密码不能为空', trigger: 'blur'},
        ],
        newPassword:[
          {required: true, message: '新密码不能为空', trigger: 'blur'},
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
        confirmPassword: [
          {required: true, message: '确认密码不能为空', trigger: 'blur'},
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
      loading:false,
      loadingText:'确定'
    }
  },
  methods: {
    onCancel() {
      this.addForm = {
        oldPassword:null,
        newPassword:null,
        confirmPassword:null
      }
    },
    onSubmit(){
      this.$refs.addFormRef.validate(valid=>{
        if (!valid ) return
        this.loading=true
        this.loadingText='提交中'
        let obj={
          username:this.userInfo.username,
          oldPassword:this.addForm.oldPassword,
          newPassword:this.addForm.newPassword,
          confirmPassword:this.addForm.confirmPassword
        }
        setNewPassword(obj).then(res=>{
          localStorage.clear()
          this.$store.commit("resetState")
          this.$router.push('/login')
        })
      })
    },
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>
