<template>
  <div class="login-page d-flex justify-content-center align-items-center">
    <div class="login-card shadow">

      <div class="login-header py-3 text-center text-white fw-bold">
        <i class="bi bi-book-half me-2"></i>
        QUẢN LÝ THƯ VIỆN
      </div>

  
      <div class="px-5 py-4">
        <form @submit.prevent="login">

          <div class="mb-4">
            <label class="form-label fw-bold text-dark">
              <i class="bi bi-person-circle me-2"></i>
              Mã nhân viên (MSNV)
            </label>
            <input
              v-model="msnv"
              class="form-control form-control-lg custom-input"
              placeholder="Nhập MSNV"
              required
            />
          </div>

          <div class="mb-4">
            <label class="form-label fw-bold text-dark">
              <i class="bi bi-lock-fill me-2"></i>
              Mật khẩu
            </label>
            <input
              v-model="password"
              type="password"
              class="form-control form-control-lg custom-input"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button class="btn login-btn btn-lg w-100 fw-bold" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP" }}
          </button>

          <div v-if="error" class="alert alert-danger mt-4 text-center fw-bold">
            {{ error }}
          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/api'

const msnv = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()
const authStore = useAuthStore()

watch([msnv, password], () => {
  error.value = ""
})

const login = async () => {
  loading.value = true
  error.value = ""

  try {
    const res = await api.post("/auth/login", {
      MSNV: msnv.value.trim(),
      Password: password.value
    })

    authStore.login(res.data.token, res.data.user)
    router.push("/")

  } catch (err) {
    error.value = err.response?.data?.message || "Sai MSNV hoặc mật khẩu!"
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

.login-page {
  height: 100vh;
  width: 100%;
  background: var(--bg); 
  display: flex;
  justify-content: center;
  align-items: center;
}



.login-card {
  width: 420px;
  background: white;
  border-radius: 14px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.login-header {
  background: var(--primary); 
  font-size: 1.4rem;
  letter-spacing: 1px;
}

.custom-input {
  border-radius: 10px;
  border: 2px solid #d7ccc8;
  background: #fff;
  padding: 14px;
  font-size: 1rem;
  transition: 0.25s;
}

.custom-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 0.2rem rgba(121, 85, 72, 0.25);
}


.login-btn {
  background: var(--primary);
  color: white;
  border-radius: 10px;
  transition: 0.25s;
}

.login-btn:hover {
  background: var(--primary-dark);
}
</style>
