<template>
  <div class="d-flex" style="min-height: 100vh;">
    
   
    <aside class="sidebar-bg text-white d-flex flex-column">
      <div class="text-center py-5 border-bottom border-light border-opacity-10">
        <i class="bi bi-book-fill" style="font-size: 4rem;"></i>
        <h4 class="mt-3 fw-bold mb-0">QUẢN LÝ THƯ VIỆN</h4>
      </div>

      <nav class="flex-grow-1 px-3 py-4">
        <router-link
          to="/dashboard"
          class="menu-item"
          active-class="active-link"
        >
          <i class="bi bi-speedometer2 me-3 fs-4"></i> Trang chủ
        </router-link>

        <router-link
          to="/sach"
          class="menu-item"
          active-class="active-link"
        >
          <i class="bi bi-book me-3 fs-4"></i> Quản lý Sách
        </router-link>

        <router-link
          to="/docgia"
          class="menu-item"
          active-class="active-link"
        >
          <i class="bi bi-people me-3 fs-4"></i> Quản lý Độc giả
        </router-link>

         <router-link
    to="/nhanvien"
    class="menu-item"
    active-class="active-link"
  >
    <i class="bi bi-person-badge me-3 fs-4"></i> Quản lý Nhân viên
  </router-link>

  <router-link
    to="/nxb"
    class="menu-item"
    active-class="active-link"
  >
    <i class="bi bi-building me-3 fs-4"></i> Nhà xuất bản
  </router-link>

        <router-link
          to="/muontra"
          class="menu-item"
          active-class="active-link"
        >
          <i class="bi bi-journal-check me-3 fs-4"></i> Mượn / Trả sách
        </router-link>

        <router-link
          to="/quahan"
          class="menu-item text-danger"
          active-class="active-danger"
        >
          <i class="bi bi-exclamation-triangle me-3 fs-4"></i> Sách quá hạn
        </router-link>
      </nav>

      <div class="p-4 border-top border-light border-opacity-10 text-center">
        <p class="mb-2 fw-bold">{{ currentUser?.HoTenNV || 'Nhân viên' }}</p>
        <button @click="logout" class="btn btn-outline-light btn-sm w-100">
          <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
        </button>
      </div>
    </aside>

  
    <main class="flex-grow-1" style="background: var(--bg);">
      <div class="p-4 p-lg-5">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const currentUser = authStore.currentUser

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar-bg {
  width: 280px;
  background: var(--primary);
  min-height: 100vh;
}


.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  margin-bottom: 8px;
  color: white;
  border-radius: 10px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s;
}


.menu-item:hover {
  background: rgba(255, 255, 255, 0.15);
}


.active-link {
  background: rgba(255, 255, 255, 0.25) !important;
}

.active-danger {
  background: rgba(220, 53, 69, 0.25) !important;
}
</style>
