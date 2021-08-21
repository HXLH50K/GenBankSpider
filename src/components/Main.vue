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
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        :before-upload="beforeAvatarUpload"
        :http-request="readFile"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">开始解析</el-button>
        <div slot="tip" class="el-upload__tip">只能上传tab, txt文件</div>
      </el-upload>
    </el-row>
    <el-row>
      <el-table :data="tableData" stripe style="width: 100%" id="table">
        <el-table-column prop="id" label="id" width="180" align="center"></el-table-column>
        <el-table-column prop="host" label="host" width="180" align="center"></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
import { getHost } from '../../plugin/getHost.mjs'
export default {
  data() {
    return {
      tableData: [],
      ids: [],
      hosts: [],
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
      return 'http://localhost:8080/static/'
    },
    uploadSuccess(response, file, fileList) {
      console.log(response)
      if (response.code == 0) {
        this.$message({
          message: '导入成功',
          type: 'success'
        })
        console.log('A')
      } else {
        this.$message({
          message: '导入失败',
          type: 'error'
        })
        console.log('B')
      }
    },
    //文件上传失败触发
    uploadFalse(response, file, fileList) {
      this.$message({
        message: '文件上传失败！',
        type: 'error'
      })
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
    findStrIndex(str, cha, num) {
      var x = str.indexOf(cha)
      for (var i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1)
      }
      return x
    },
    readFile(param) {
      var that = this
      var fileObj = param.file
      let reader = new FileReader() //先new 一个读文件的对象 FileReader
      if (typeof FileReader === 'undefined') {
        //用来判断你的浏览器是否支持 FileReader
        this.$message({
          type: 'info',
          message: '您的浏览器不支持文件读取。'
        })
        return
      }
      //  reader.readAsText(file.raw, "gb2312");  //读.txt文件
      reader.readAsArrayBuffer(fileObj) //读任意文件
      reader.onload = function (e) {
        var ints = new Uint8Array(e.target.result) //要使用读取的内容，所以将读取内容转化成Uint8Array
        ints = ints.slice(0, 5000) //截取一段读取的内容
        let snippets = new TextDecoder('utf-8').decode(ints).split('\n') //二进制缓存区内容转化成中文（即也就是读取到的内容）
        for (let i = 0; i < snippets.length; i++) {
          let line = snippets[i]
          let start = that.findStrIndex(line, '|', 3 - 1)
          let end = that.findStrIndex(line, '|', 4 - 1)
          var id = line.substring(start + 1, end)
          that.ids.push(id)
        }
        for (let i = 0; i < that.ids.length; i++) {
          getHost(that.ids[i], process.env.VUE_APP_BASE_API).then(result => {
            console.log(i)
            that.hosts.push(result)
            that.tableData.push({ id: that.ids[i], host: result })
            console.log(result)
          })
        }
      }
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
