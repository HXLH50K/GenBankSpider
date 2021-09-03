<template>
  <div id="root">
    <el-row>
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="uploadUrl()"
        :data="upData"
        :on-error="uploadFalse"
        :on-success="uploadSuccess"
        :on-progress="uploading"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        :before-upload="beforeAvatarUpload"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">开始解析</el-button>
        <div slot="tip" class="el-upload__tip">只能上传tab, txt文件</div>
      </el-upload>
    </el-row>
    <el-row>
      <el-table :data="tableData" stripe style="width: 100%" id="table">
        <el-table-column prop="gb" label="gb" width="180" align="center"></el-table-column>
        <el-table-column prop="result" label="host" width="180" align="center"></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
// import { getHost } from '../../plugin/getHost.mjs'
export default {
  data() {
    return {
      tableData: [],
      fileList: [],
      form: {
        fileName: ''
      }
    }
  },
  computed: {
    upData: function () {
      return this.form
    }
  },
  methods: {
    uploadUrl: function () {
      return 'http://localhost:8081/upload/'
    },
    uploadSuccess(response, file, fileList) {
      console.log(response.length)
      for (let x of response) {
        this.tableData.push(x)
      }
      console.log(this.tableData)
    },
    //文件上传失败触发
    uploadFalse(response, file, fileList) {
      this.$message({
        message: '文件上传失败！',
        type: 'error'
      })
    },
    uploading() {
      while (true) {
        console.log(123)
      }
    },
    // 上传前对文件的大小和类型的判断
    beforeAvatarUpload(file) {
      this.form.fileName = file.name
      const extension = file.name.split('.')[1] === 'tab'
      const extension1 = file.name.split('.')[1] === 'txt'
      if (!extension && !extension1) {
        this.$message({
          message: '上传文件只能是 tab, txt 格式!',
          type: 'error'
        })
      }
      return extension || extension1
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#root {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: auto;
}
</style>
