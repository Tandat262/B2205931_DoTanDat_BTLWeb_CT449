import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes = [
  
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue')
  },


  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },

      { 
        path: 'dashboard', 
        name: 'Dashboard', 
        component: () => import('@/views/admin/DashboardView.vue') 
      },

      { 
        path: 'sach', 
        name: 'Sach', 
        component: () => import('@/views/admin/SachView.vue') 
      },

      {
        path: 'docgia',
        name: 'DocGia',
        component: () => import('@/views/admin/DocGiaView.vue')
      },

      {
        path: 'muontra',
        name: 'MuonTra',
        component: () => import('@/views/admin/MuonTraView.vue')
      },

       {
        path: 'nhanvien',
        name: 'NhanVien',
        component: () => import('@/views/admin/NhanVienView.vue')
      },

      {
        path: 'nxb',
        name: 'NXB',
        component: () => import('@/views/admin/NXBView.vue')
      },
      
      {
  path: "/quahan",
  component: () => import("@/views/admin/QuaHanView.vue"),
  meta: { requiresAuth: true }
}

    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
