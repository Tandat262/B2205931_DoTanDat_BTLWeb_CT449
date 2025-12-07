<template>
  <NavbarUser />

  <div class="container py-4">

  
    <h2 class="fw-bold mb-4" style="color: var(--primary);">
      <i class="bi bi-journal-bookmark-fill me-2"></i> Mượn sách
    </h2>

    <div class="row g-4">

    
      <div class="col-md-4">
        <div class="card-user p-3">

          <h5 class="fw-bold mb-3">
            <i class="bi bi-book-half me-2"></i> Đăng ký mượn
          </h5>

          <form @submit.prevent="muonSach">
            <div class="mb-3">
              <label class="fw-bold">Chọn sách</label>
              <select v-model="selectedBook" class="form-control">
                <option value="">-- Chọn sách --</option>
                <option v-for="s in books" :key="s._id" :value="s.MaSach">
                  {{ s.TenSach }}
                </option>
              </select>
            </div>

            <button class="btn btn-primary w-100 mt-2">
              <i class="bi bi-arrow-right-circle me-1"></i>
              Xác nhận mượn
            </button>
          </form>

        </div>
      </div>

     
      <div class="col-md-8">

  
        <div class="card-user p-3 mb-4">
          <h5 class="fw-bold mb-3">
            <i class="bi bi-hourglass-split me-2"></i> Sách đang mượn
          </h5>

          <div v-if="dangMuon.length === 0" class="text-muted text-center">
            Chưa có sách nào đang mượn.
          </div>

          <div v-for="m in dangMuon" :key="m._id" class="muon-card row g-3">
            <div class="col">
              <h6 class="fw-bold">{{ m.Sach.TenSach }}</h6>
              <p class="small m-0">Ngày mượn: {{ formatDate(m.NgayMuon) }}</p>
            </div>
          </div>
        </div>

        <div class="card-user p-3">
          <h5 class="fw-bold mb-3">
            <i class="bi bi-clock-history me-2"></i> Lịch sử mượn
          </h5>

          <div v-if="lichSu.length === 0" class="text-muted text-center">
            Chưa có lịch sử mượn.
          </div>

          <div v-for="h in lichSu" :key="h._id" class="history-card row g-3">
            <div class="col-8">
              <strong>{{ h.Sach.TenSach }}</strong>
              <p class="small">Mượn: {{ formatDate(h.NgayMuon) }}</p>
              <p class="small">Trả: {{ formatDate(h.NgayTra) }}</p>
            </div>

            <div class="col-4 text-end text-success fw-bold">
              <i class="bi bi-check-circle"></i> Đã trả
            </div>
          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import NavbarUser from "@/components/NavbarUser.vue";
import api from "@/api/api";
import { ref, onMounted } from "vue";

const books = ref([]);
const selectedBook = ref("");
const dangMuon = ref([]);
const lichSu = ref([]);

const MaDocGia = localStorage.getItem("MaDocGia");


const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN");


const loadBooks = async () => {
  const res = await api.get("/public/sach");
  books.value = res.data;
};


const loadDangMuon = async () => {
  const res = await api.get(`/public/muon/full/${MaDocGia}`);
  dangMuon.value = res.data.filter(x => !x.NgayTra);
};


const loadLichSu = async () => {
  const res = await api.get(`/public/muon/full/${MaDocGia}`);
  lichSu.value = res.data.filter(x => x.NgayTra);
};


const muonSach = async () => {
  if (!selectedBook.value) return alert("Vui lòng chọn sách!");

  try {
    await api.post("/public/muon", {
      MaDocGia,
      MaSach: selectedBook.value
    });

    alert("Mượn sách thành công!");
    selectedBook.value = "";

    loadDangMuon();
    loadLichSu();
  } catch (err) {
    alert(err.response?.data?.message || "Lỗi mượn sách!");
  }
};

onMounted(() => {
  loadBooks();
  loadDangMuon();
  loadLichSu();
});
</script>

<style scoped>
.muon-card,
.history-card {
  padding: 12px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}
.container {
  max-width: 1100px !important;
  margin: auto;
}

.card-user {
  border-radius: 12px;
  background: white;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

h2 {
  text-align: center;
}

.muon-card,
.history-card {
  padding: 16px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  margin-bottom: 12px;  
}


.card-user {
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e0dada;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  padding: 20px;
}


.card-user .row {
  margin-top: 4px;
}

</style>
