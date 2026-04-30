<template>
  <el-container>
    <el-aside width="200px" style="background: #001529; color: white;">
      <div style="padding: 20px; font-size: 18px; font-weight: bold;">Cloud Storage</div>
      <el-menu :default-active="$route.path" background-color="#001529" text-color="#bfcbd9" active-text-color="#409EFF" @select="handleSelect">
        <el-menu-item index="/dashboard"><el-icon><Data-Line /></el-icon> 数据分析</el-menu-item>
        <el-menu-item index="/upload"><el-icon><Upload /></el-icon> 上传图片</el-menu-item>
        <el-menu-item index="/manage"><el-icon><Picture /></el-icon> 图片管理</el-menu-item>
        <el-menu-item index="/storage"><el-icon><Setting /></el-icon> 存储策略</el-menu-item>
        <el-menu-item index="/settings"><el-icon><User /></el-icon> 系统设置</el-menu-item>
      </el-menu>
    </el-aside>
    <el-main style="background: #fff;">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { DataLine, Upload, Picture, Setting, User } from '@element-plus/icons-vue'

const router = useRouter()
const handleSelect = (key) => {
  router.push(key)
}
</script>

<style>
.el-aside { height: 100vh; }
.el-main { padding: 20px; }
</style>
