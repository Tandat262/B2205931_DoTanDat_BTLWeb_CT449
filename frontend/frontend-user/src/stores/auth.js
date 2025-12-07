import { defineStore } from "pinia";
import api from "@/api/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user") || "null"),
  }),

  actions: {
    async login(credentials) {
      const res = await api.post("/public/login", credentials);

      this.token = res.data.token;
      this.user = res.data.user;

  
      localStorage.setItem("token", this.token);
      localStorage.setItem("user", JSON.stringify(this.user));


      if (this.user?.MaDocGia) {
        localStorage.setItem("MaDocGia", this.user.MaDocGia);
      }
    },

    async register(payload) {
      const res = await api.post("/public/register", payload);
      return res.data;
    },


    updateProfile(data) {
      this.user = { ...this.user, ...data };
      localStorage.setItem("user", JSON.stringify(this.user));
    },


    logout() {
      this.token = "";
      this.user = null;
      localStorage.clear();
    },
  },
});
