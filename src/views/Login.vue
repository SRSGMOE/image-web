<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>图床登录</h2>
      <el-form :model="form" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input v-model="form.username" placeholder="用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" @keyup.enter="handleLogin" />
        </el-form-item>
        <el-button type="primary" @click="handleLogin" :loading="loading">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()
const form = ref({ username: '', password: '' })
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await api.post('/login', form.value)
    if (res.data.success) {
      localStorage.setItem('token', res.data.token)
      router.push('/')
    }
  } catch (e) {
    ElMessage.error('登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: #eef2f6; }
.login-card { width: 400px; text-align: center; }
</style>
