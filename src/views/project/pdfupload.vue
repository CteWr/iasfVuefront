<template>
  <div>
    <el-form-item label="上传文件">
      <el-input v-model="addForm.fileName" placeholder="请上传文件" style="width: 220px;" :disabled="true">
      </el-input>
    <el-upload
          drag
          style="width: 200px;display: inline;margin-left: 25px;"
          class="upload-demo"
          ref="upload"
          action="url"
          :show-file-list="true"
          :before-upload="beforeUpload">
          <el-button slot="trigger" type="danger" icon="el-icon-upload2">选取文件</el-button>
          <el-button type="danger" @click="viewFile" icon="el-icon-view">预览</el-button>
        </el-upload>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'pdfupload',
  data() {
    return {
      url: '',
      uid: '',
      addForm:{
        file:null,
        fileName:'',
        fileData:null
      },
    }
  },
  methods:{
    //上传之前调用方法
    initUrl(id) {
      this.url = this.$http.adornUrl(
        `/sys/oss/upload3?token=${this.$cookie.get("token")}` +
        `&uid=` +
        this.uid
      );
    },
    beforeUpload(file){
      this.addForm.file = file;
      this.addForm.fileName = file.name;
      // this.fileSize = file.size;
      const extension = file.name.split('.').slice(-1) == 'pdf'
      if (!extension) {
        this.$message.warning('上传模板只能是pdf格式!')
        return
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      let that = this;
      reader.onload = function() {
        that.addForm.fileData = reader.result;
      };
      return false; // 返回false不会自动上传
    },
    //预览pdf 文件，这里用的是打开新窗口用浏览器查看PDF
    viewFile(){
      if(this.addForm.fileData == null){
        this.$message.warning('请先上传PDF文件');
        return false;
      }
      var win = window.open();
      win.document.write(
        '<body style="margin:0px;"><object data="' +
        this.addForm.fileData +
        '" type="application/pdf" width="100%" height="100%"><iframe src="' +
        this.addForm.fileData +
        '" scrolling="no" width="100%" height="100%" frameborder="0" ></iframe></object></body>'
      );
    },
    //点击确定按钮上传到后台
    submitAddForm(){
      var formData = new FormData();
      formData.append('uploadPdf', this.addForm.file);
      this.$commonAjax.postFile('/xxx/xxx', formData,
        (json)=> {
          if (json.code == 0) {
            this.$message.success("文件上传成功");
          } else {
            this.$message.error("文件上传失败");
          }
        },
        (error)=> {
          this.$message.error("系统繁忙请稍后再试!");
        }
      );
    },
  },
  mounted() {
  },
  created(){
  }
}
</script>

<style scoped>

</style>
