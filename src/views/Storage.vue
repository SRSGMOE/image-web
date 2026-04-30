<template>
  <div>
    <h2>存储策略配置</h2>
    <el-form :model="config" label-width="120px">
      <el-form-item label="R2 存储桶名称">
        <el-input v-model="config.bucket" />
      </el-form-item>
      <el-form-item label="R2 访问密钥 ID">
        <el-input v-model="config.accessKeyId" />
      </el-form-item>
      <el-form-item label="R2 访问密钥">
        <el-input v-model="config.accessKey" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveConfig">保存配置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const config = ref({ bucket: '', accessKeyId: '', accessKey: '' })

onMounted(async () => {
  const res = await api.get('/settings')
  config.value = res.data
})

const saveConfig = async () => {
  try {
    await api.put('/settings', config.value)
    ElMessage.success('配置保存成功')
  } catch (e) {
    ElMessage.error('保存失败')
  }
}
</script>
