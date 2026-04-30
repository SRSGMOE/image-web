<template>
  <div>
    <h2>上传图片</h2>
    <el-upload
      action="/api/upload"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :show-file-list="false"
    >
      <el-button type="primary">选择文件</el-button>
    </el-upload>
    <div v-if="uploadUrl" class="upload-result">
      <p>上传成功！</p>
      <el-input v-model="uploadUrl" readonly />
      <el-button @click="copyUrl">复制链接</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api'

const uploadUrl = ref('')

const beforeUpload = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过10MB')
    return false
  }
  return true
}

const handleSuccess = (res) => {
  if (res.success) {
    uploadUrl.value = res.url
    ElMessage.success('上传成功')
  }
}

const copyUrl = () => {
  navigator.clipboard.writeText(uploadUrl.value)
  ElMessage.success('链接已复制')
}
</script>

<style scoped>
.upload-result { margin-top: 20px; }
</style>
