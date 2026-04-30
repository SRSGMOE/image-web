<template>
  <div>
    <h2>系统设置</h2>
    <el-form :model="settings" label-width="120px">
      <el-form-item label="站点名称">
        <el-input v-model="settings.siteName" />
      </el-form-item>
      <el-form-item label="管理员邮箱">
        <el-input v-model="settings.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSettings">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const settings = ref({ siteName: '', email: '' })

onMounted(async () => {
  const res = await api.get('/settings')
  settings.value = res.data
})

const saveSettings = async () => {
  try {
    await api.put('/settings', settings.value)
    ElMessage.success('设置保存成功')
  } catch (e) {
    ElMessage.error('保存失败')
  }
}
</script>
