import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../views/Layout.vue'),
    redirect: '/dashboard',
    children: [
      { path: '', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'upload', name: 'Upload', component: () => import('../views/Upload.vue') },
      { path: 'manage', name: 'Manage', component: () => import('../views/Manage.vue') },
      { path: 'storage', name: 'Storage', component: () => import('../views/Storage.vue') },
      { path: 'settings', name: 'Settings', component: () => import('../views/Settings.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
