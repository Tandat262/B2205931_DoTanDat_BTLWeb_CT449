<template>
  <NavbarUser />

  <div class="container mt-4">

   
    <div class="mb-4">
      <img 
        src="/banner.jpg"
        class="rounded w-100 shadow"
        style="max-height: 280px; object-fit: cover;"
      />
    </div>

    <h3 class="mb-3 fw-bold" style="color: var(--primary);">
      <i class="bi bi-stars me-2"></i> Sách mới nhất
    </h3>

    <div class="row g-3">
      <div class="col-md-3" v-for="s in books" :key="s._id">
        <BookCard :book="s" />
      </div>
    </div>

  </div>
</template>

<script setup>
import NavbarUser from "@/components/NavbarUser.vue";
import BookCard from "@/components/BookCard.vue";
import api from "@/api/api";
import { ref, onMounted } from "vue";

const books = ref([]);

onMounted(async () => {
  const res = await api.get("/public/sach");
  books.value = res.data;
});
</script>
