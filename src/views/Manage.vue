<template>
  <div>
    <h2>图片管理</h2>
    <el-table :data="images" style="width: 100%">
      <el-table-column prop="name" label="文件名" />
      <el-table-column prop="url" label="链接">
        <template #default="scope">
          <el-button link type="primary" @click="copyUrl(scope.row.url)">复制</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="大小">
        <template #default="scope">
          {{ (scope.row.size / 1024).toFixed(2) }} KB
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button link type="danger" @click="deleteImage(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const images = ref([])

onMounted(async () => {
  const res = await api.get('/images')
  images.value = res.data
})

const copyUrl = (url) => {
  navigator.clipboard.writeText(url)
  ElMessage.success('链接已复制')
}

const deleteImage = async (id) => {
  try {
    await api.delete(`/images/${id}`)
    ElMessage.success('删除成功')
    onMounted()
  } catch (e) {
    ElMessage.error('删除失败')
  }
}
</script>
