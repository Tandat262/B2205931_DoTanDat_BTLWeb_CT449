<template>
  <div>
    <h1 class="display-5 fw-bold mb-5 text-center" style="color: #795548;">
      <i class="bi bi-speedometer2 me-3"></i>
      CHÀO MỪNG BẠN ĐẾN VỚI HỆ THỐNG QUẢN LÝ THƯ VIỆN
    </h1>

   
    <div v-if="loading" class="text-center fs-4 py-5">
      Đang tải dữ liệu...
    </div>

  
    <div v-else class="row g-4">

 
      <div class="col-lg-3 col-md-6">
        <div class="card text-white h-100" style="background: #795548; border-radius: 16px;">
          <div class="card-body text-center py-5">
            <i class="bi bi-book fs-1 mb-3"></i>
            <h2 class="display-6 fw-bold">{{ stats.totalBooks }}</h2>
            <p class="fs-5 mb-0">Tổng số sách</p>
          </div>
        </div>
      </div>

 
      <div class="col-lg-3 col-md-6">
        <div class="card text-white h-100" style="background: #A1887F; border-radius: 16px;">
          <div class="card-body text-center py-5">
            <i class="bi bi-people fs-1 mb-3"></i>
            <h2 class="display-6 fw-bold">{{ stats.totalReaders }}</h2>
            <p class="fs-5 mb-0">Độc giả</p>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6">
        <div class="card text-white h-100" style="background: #6D4C41; border-radius: 16px;">
          <div class="card-body text-center py-5">
            <i class="bi bi-person-badge fs-1 mb-3"></i>
            <h2 class="display-6 fw-bold">{{ stats.totalStaff }}</h2>
            <p class="fs-5 mb-0">Nhân viên</p>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6">
        <div class="card text-white h-100" style="background: #FFB74D; border-radius: 16px;">
          <div class="card-body text-center py-5">
            <i class="bi bi-journal-check fs-1 mb-3"></i>
            <h2 class="display-6 fw-bold">{{ stats.borrowing }}</h2>
            <p class="fs-5 mb-0">Đang mượn</p>
          </div>
        </div>
      </div>

    </div>

 
    <div class="text-center mt-5">
      <h3 class="fw-bold" style="color: #795548;">
        Xin chào,
        <span class="text-primary">{{ currentUser?.HoTenNV || "Quản trị viên" }}</span>!
      </h3>

      <p class="text-muted fs-5">
        Hôm nay là {{
          new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })
        }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/api";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const currentUser = authStore.user; 


const loading = ref(true);
const stats = ref({
  totalBooks: 0,
  totalReaders: 0,
  totalStaff: 0,
  borrowing: 0,

});


onMounted(async () => {
  try {
    const res = await api.get("/admin/thongke");
    stats.value = res.data;
  } catch (err) {
    console.error("Lỗi lấy thống kê:", err);
  } finally {
    loading.value = false;
  }
});
</script>
