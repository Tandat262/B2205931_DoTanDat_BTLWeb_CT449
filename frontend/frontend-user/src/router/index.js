import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";


import Home from "@/views/HomeView.vue";
import Login from "@/views/LoginView.vue";
import Register from "@/views/RegisterView.vue";
import MuonTra from "@/views/MuonTraView.vue";
import BookDetail from "@/views/BookDetailView.vue";
import Search from "@/views/SearchView.vue";
const routes = [
  { path: "/", component: Home },

  {
    path: "/login",
    component: Login,
    meta: { guestOnly: true },
  },

  {
    path: "/register",
    component: Register,
    meta: { guestOnly: true },
  },

  {
    path: "/muontra",
    component: MuonTra,
    meta: { requiresAuth: true },
  },

  {
    path: "/sach/:id",
    component: BookDetail,
  },

  {
  path: "/profile",
  name: "profile",
  component: () => import("@/views/ProfileView.vue"),
},
{
    path: "/search",
    component: Search,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  
  if (to.meta.requiresAuth && !auth.token) {
    return next("/login");
  }


  if (to.meta.guestOnly && auth.token) {
    return next("/");
  }

  return next();
});

export default router;
