<template>
  <NavbarUser />

  <div class="container mt-4">
    <h3>Kết quả tìm kiếm cho: "{{ keyword }}"</h3>

    <div v-if="loading" class="mt-4">Đang tải...</div>

    <div v-else-if="books.length === 0" class="mt-4">
      Không tìm thấy sách nào.
    </div>

    <div v-else class="row mt-4 g-3">
      <div 
        class="col-md-3"
        v-for="book in books"
        :key="book._id"
      >
        <BookCard :book="book" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import api from "@/api/api";

import NavbarUser from "@/components/NavbarUser.vue";
import BookCard from "@/components/BookCard.vue";

const route = useRoute();

const keyword = ref(route.query.keyword || "");
const books = ref([]);
const loading = ref(true);

const loadData = async () => {
  loading.value = true;

  try {
    const res = await api.get(`/public/sach?search=${keyword.value}`);
    books.value = res.data;
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);

watch(() => route.query.keyword, (newVal) => {
  keyword.value = newVal;
  loadData();
});
</script>
