<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold" style="color: var(--danger)">
        <i class="bi bi-exclamation-triangle-fill me-2"></i> Sách quá hạn
      </h2>
    </div>

  
    <div class="card shadow-sm border-danger mb-4">
      <div class="card-body d-flex justify-content-between align-items-center">
        <h4 class="fw-bold mb-0">
          Tổng số sách quá hạn: 
          <span class="text-danger">{{ tongQuaHan }}</span>
        </h4>

        <button class="btn btn-outline-danger" @click="fetchData">
          <i class="bi bi-arrow-repeat"></i> Làm mới
        </button>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Mã độc giả</th>
              <th>Mã sách</th>
              <th>Ngày mượn</th>
              <th>Số ngày trễ</th>
              <th>Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in danhSach" :key="item._id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.MaDocGia }}</td>
              <td>{{ item.MaSach }}</td>
              <td>{{ formatDate(item.NgayMuon) }}</td>
              <td class="fw-bold text-danger">{{ tinhTre(item.NgayMuon) }} ngày</td>
              <td>
                <span class="badge bg-danger">Quá hạn</span>
              </td>
            </tr>

            <tr v-if="danhSach.length === 0">
              <td colspan="6" class="text-center text-muted py-4">
                Không có sách quá hạn 🎉
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/api";

const tongQuaHan = ref(0);
const danhSach = ref([]);


const fetchData = async () => {
  try {
    const res = await api.get("/admin/thongke/quahan");
    tongQuaHan.value = res.data.quaHan;
    danhSach.value = res.data.danhSach;
  } catch (err) {
    console.error("Lỗi:", err);
  }
};


const tinhTre = (ngayMuon) => {
  const ngay = new Date(ngayMuon);
  const now = new Date();
  const diff = Math.floor((now - ngay) / (1000 * 60 * 60 * 24));
  return diff - 14 > 0 ? diff - 14 : 0; 
};


const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN");
};

onMounted(fetchData);
</script>

<style scoped>
.badge {
  font-size: 0.9rem;
}
</style>
