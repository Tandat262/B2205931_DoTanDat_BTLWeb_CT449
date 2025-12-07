<template>
  <NavbarUser />

  <div class="container mt-4" v-if="book">

    <div class="row">
      <div class="col-md-4">
        <img 
          :src="book.Img || '/no-image.png'" 
          class="img-fluid rounded shadow"
          style="max-height: 400px; object-fit: cover;"
        />
      </div>

      <div class="col-md-8">
        <h2 class="fw-bold" style="color: var(--primary);">
          {{ book.TenSach }}
        </h2>

        <p class="text-muted mb-2">
          <i class="bi bi-barcode"></i> Mã sách: {{ book.MaSach }}
        </p>

        <p>
          <strong>Nhà xuất bản:</strong> {{ book.MaNXB }}
        </p>

        <p>
          <strong>Năm xuất bản:</strong> {{ book.NamXuatBan }}
        </p>

        <p>
          <strong>Nguồn gốc tác giả:</strong> {{ book.NguonGocTacGia }}
        </p>
        <p>
          <strong>Số lượng:</strong> {{ book.SoQuyen}}
        </p>
        <p>
          <strong>Giá:</strong> {{ book.DonGia?.toLocaleString() }} đ
        </p>

        <button class="btn btn-primary mt-3 px-4 py-2" @click="muon">
          <i class="bi bi-bookmark-plus me-1"></i> Mượn sách
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import NavbarUser from "@/components/NavbarUser.vue";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api/api";

const route = useRoute();
const router = useRouter();

const book = ref(null);
const MaDocGia = JSON.parse(localStorage.getItem("user"))?.MaDocGia; // 👈 Lấy đúng user đang login

onMounted(async () => {
  const res = await api.get(`/public/sach/${route.params.id}`);
  book.value = res.data;
});


const muon = async () => {
  if (!MaDocGia) {
    alert("Bạn cần đăng nhập trước khi mượn sách!");
    return router.push("/login");
  }

  try {
    const res = await api.post("/public/muon", {
      MaDocGia,
      MaSach: book.value.MaSach,
    });

    alert("Mượn sách thành công!");

    router.push("/muontra");

  } catch (err) {
    alert(err.response?.data?.message || "Không thể mượn sách!");
  }
};
</script>
