<template>
  <div>
  
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold" style="color: var(--primary)">
        Quản lý Mượn – Trả
      </h2>
      <button class="btn btn-primary fw-bold" @click="openMuonModal">
        Mượn sách
      </button>
    </div>

  
    <div class="card p-3 mb-4 shadow-sm">
      <input
        v-model="keyword"
        @input="search"
        class="form-control form-control-lg"
        placeholder="Tìm theo mã độc giả hoặc mã sách..."
      />
    </div>

  
    <div class="card shadow-sm">
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Mã độc giả</th>
              <th>Tên độc giả</th>
              <th>Tên sách</th>
              <th>Ngày mượn</th>
              <th>Ngày trả</th>
              <th>Trạng thái</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, index) in list" :key="p._id">
              <td>{{ index + 1 }}</td>
              <td>{{ p.DocGia.MaDocGia }}</td>
              <td>{{ p.DocGia.HoLot }} {{ p.DocGia.Ten }}</td>
              <td>{{ p.Sach.TenSach }}</td>
              <td>{{ formatDate(p.NgayMuon) }}</td>
              <td>{{ p.NgayTra ? formatDate(p.NgayTra) : "--" }}</td>
              <td>
                <span class="badge" :class="p.NgayTra ? 'bg-success' : 'bg-warning'">
                  {{ p.NgayTra ? "Đã trả" : "Đang mượn" }}
                </span>
              </td>
              <td class="text-end">
                <button
                  class="btn btn-success btn-sm"
                  @click="traSach(p._id)"
                  :disabled="!!p.NgayTra"
                >
                  Trả
                </button>
              </td>
            </tr>
            <tr v-if="list.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  
    <div class="modal fade" id="muonModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" style="border-radius: 16px">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title fw-bold">Mượn sách cho độc giả</h5>
            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitMuon">
          
              <div class="mb-3">
                <label class="fw-bold">Độc giả</label>
                <select v-model="form.MaDocGia" class="form-select" required>
                  <option value="" disabled>Chọn độc giả</option>
                  <option v-for="dg in docGias" :key="dg._id" :value="dg.MaDocGia">
                    {{ dg.MaDocGia }} - {{ dg.HoLot }} {{ dg.Ten }} ({{ dg.DienThoai }})
                  </option>
                </select>
              </div>

        
              <div class="mb-3">
                <label class="fw-bold">Sách</label>
                <select v-model="form.MaSach" class="form-select" required>
                  <option value="" disabled>Chọn sách</option>
                  <option v-for="s in sachCon" :key="s._id" :value="s.MaSach">
                    {{ s.MaSach }} - {{ s.TenSach }} (Còn: {{ s.SoQuyen }} quyển)
                  </option>
                </select>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary fw-bold">
                  Xác nhận mượn sách
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/api";

const list = ref([]);
const keyword = ref("");
const docGias = ref([]);
const sachs = ref([]);
const sachCon = ref([]); 

const form = ref({
  MaDocGia: "",
  MaSach: "",
});


const fetchList = async () => {
  const res = await api.get("/admin/muontra");
  list.value = res.data;
};

const fetchDocGia = async () => {
  const res = await api.get("/admin/docgia");
  docGias.value = res.data;
};

const fetchSach = async () => {
  const res = await api.get("/admin/sach");
  sachs.value = res.data;
  sachCon.value = res.data.filter(s => s.SoQuyen > 0);
};


const search = () => {
  if (!keyword.value) return fetchList();
  const kw = keyword.value.toLowerCase();
  list.value = list.value.filter(p =>
    p.DocGia.MaDocGia.toLowerCase().includes(kw) ||
    p.Sach.MaSach.toLowerCase().includes(kw) ||
    p.Sach.TenSach.toLowerCase().includes(kw)
  );
};


const openMuonModal = () => {
  form.value = { MaDocGia: "", MaSach: "" };
  new bootstrap.Modal(document.getElementById("muonModal")).show();
};


const submitMuon = async () => {
  try {
    await api.post("/admin/muon", form.value);
    alert("Mượn sách thành công!");
    new bootstrap.Modal(document.getElementById("muonModal")).hide();
    fetchList();
    fetchSach(); 
  } catch (err) {
    alert(err.response?.data?.message || "Không thể mượn sách");
  }
};

const traSach = async (id) => {
  if (!confirm("Xác nhận trả sách?")) return;
  await api.post(`/admin/tra/${id}`);
  fetchList();
  fetchSach();
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "--";

onMounted(() => {
  fetchList();
  fetchDocGia();
  fetchSach();
});
</script>

<style scoped>
.badge {
  font-size: 0.9rem;
}
.form-select {
  font-size: 1rem;
}
</style>