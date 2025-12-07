<template>
  <NavbarUser />

  <div class="auth-container">
    <div class="auth-card shadow">

      <h3 class="text-center mb-4 fw-bold">Đăng nhập độc giả</h3>

      <Form :validation-schema="schema" @submit="submit">

        <div class="mb-3">
          <label class="form-label">Số điện thoại</label>
          <Field name="DienThoai" class="form-control" />
          <ErrorMessage name="DienThoai" class="text-danger small" />
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <Field name="Password" type="password" class="form-control" />
          <ErrorMessage name="Password" class="text-danger small" />
        </div>

        <button class="btn btn-primary w-100 mt-2">Đăng nhập</button>
      </Form>

      <p class="text-center mt-3">
        Chưa có tài khoản? <router-link to="/register">Đăng ký</router-link>
      </p>

    </div>
  </div>
</template>

<script setup>
import NavbarUser from "@/components/NavbarUser.vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const schema = yup.object({
  DienThoai: yup
    .string()
    .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
  Password: yup.string().required("Vui lòng nhập mật khẩu"),
});

const submit = async (values) => {
  try {
    await auth.login(values);
    window.location.href = "/";
  } catch {
    alert("Sai số điện thoại hoặc mật khẩu!");
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  margin-top: 60px;
}
.auth-card {
  width: 430px;
  padding: 32px;
  border-radius: 14px;
  background: white;
  border: 1px solid #ddd;
}
</style>
