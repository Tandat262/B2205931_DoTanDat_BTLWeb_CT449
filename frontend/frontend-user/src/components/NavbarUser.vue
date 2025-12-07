<template>
  <nav class="header-user d-flex justify-content-between align-items-center">
    <h2 class="m-0">Thư viện Online</h2>

    <div class="d-flex align-items-center gap-3">

      <router-link to="/">Trang chủ</router-link>
      <router-link to="/muontra">Mượn sách</router-link>
      <router-link to="/profile">Hồ sơ</router-link>

      <input
        v-model="keyword"
        @keyup.enter="search"
        type="text"
        placeholder="Tìm sách..."
        class="form-control form-control-sm"
        style="width: 200px;"
      />
      <button class="btn btn-sm btn-primary" @click="search">
        Tìm kiếm
      </button>

      <template v-if="auth.token">
        <span class="mx-3 fw-bold">{{ auth.user?.Ten }}</span>
        <button class="btn btn-secondary btn-sm" @click="logout">Đăng xuất</button>
      </template>

      <template v-else>
        <router-link to="/login">Đăng nhập</router-link>
      </template>
    </div>
  </nav>
</template>


<script setup>
defineProps({});
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const keyword = ref("");

const search = () => {
  if (!keyword.value.trim()) return;
  router.push(`/search?keyword=${keyword.value.trim()}`);
};

const logout = () => {
  auth.logout();
  window.location.href = "/login";
};
</script>

