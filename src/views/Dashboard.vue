<template>
  <div>
    <h2>数据分析</h2>
    <el-row :gutter="20">
      <el-col :span="6"><el-card><div>总图片数: {{ stats.total }}</div></el-card></el-col>
      <el-col :span="6"><el-card><div>总容量: {{ stats.size }}</div></el-card></el-col>
      <el-col :span="6"><el-card><div>今日上传: {{ stats.today }}</div></el-card></el-col>
      <el-col :span="6"><el-card><div>今日流量: {{ stats.traffic }}</div></el-card></el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const stats = ref({ total: 0, size: '0 MB', today: 0, traffic: '0 MB' })

onMounted(async () => {
  const res = await api.get('/stats')
  stats.value = res.data
})
</script>
