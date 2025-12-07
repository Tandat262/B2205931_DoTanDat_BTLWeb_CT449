<template>
  <div class="card book-card shadow-sm border-0">
    

    <img
      :src="book.Img || '/no-image.png'"
      class="card-img-top book-img"
      alt="book"
    />


    <div class="card-body">
      <h5 class="card-title text-dark fw-bold book-title">
        {{ book.TenSach }}
      </h5>
      <p class="card-text text-muted small mb-3">
        {{ book.NguonGocTacGia }}
      </p>

      <router-link
        :to="'/sach/' + book._id"
        class="btn btn-primary w-100 book-btn"
      >
        Xem chi tiết
      </router-link>
    </div>

  </div>
</template>

<script setup>
defineProps(["book"]);
</script>

<style scoped>
.book-card {
  border-radius: 14px;
  overflow: hidden;
  transition: 0.25s;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 18px rgba(0, 0, 0, 0.12);
}


.book-img {
  height: 260px;
  object-fit: cover;
}

.book-title {
  min-height: 48px;
  line-height: 1.2;
}


.book-btn {
  background-color: #8b6f62;
  border: none;
}
.book-btn:hover {
  background-color: #73594e;
}
</style>
