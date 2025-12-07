<template>
    <NavbarUser/>
  <div class="auth-container">
    <div class="auth-card shadow">

      <h2 class="text-center mb-4 fw-bold">Đăng ký độc giả</h2>

      <Form :validation-schema="schema" @submit="submit">
    
        <div class="mb-3">
          <label class="form-label">Họ lót</label>
          <Field name="HoLot" class="form-control" />
          <ErrorMessage name="HoLot" class="text-danger small" />
        </div>

   
        <div class="mb-3">
          <label class="form-label">Tên</label>
          <Field name="Ten" class="form-control" />
          <ErrorMessage name="Ten" class="text-danger small" />
        </div>

        <div class="mb-3">
          <label class="form-label">Ngày sinh</label>
          <Field name="NgaySinh" type="date" class="form-control" />
          <ErrorMessage name="NgaySinh" class="text-danger small" />
        </div>

   
        <div class="mb-3">
          <label class="form-label">Giới tính</label>
          <Field as="select" name="Phai" class="form-control">
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </Field>
        </div>


        <div class="mb-3">
          <label class="form-label">Địa chỉ</label>
          <Field name="DiaChi" class="form-control" />
          <ErrorMessage name="DiaChi" class="text-danger small" />
        </div>

      
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

        <button class="btn btn-primary w-100 mt-2">Đăng ký</button>

      </Form>

      <p class="text-center mt-3">
        Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link>
      </p>

    </div>
  </div>
</template>

<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from "@/stores/auth";
import NavbarUser from "@/components/NavbarUser.vue";
import api from "@/api/api";

const auth = useAuthStore();


const checkPhoneUnique = async (phone) => {
  try {
    const res = await api.get(`/public/check-phone?phone=${phone}`);
    return !res.data.exists;
  } catch {
    return true; 
  }
};

const schema = yup.object({
  HoLot: yup.string().required("Vui lòng nhập họ lót"),
  Ten: yup.string().required("Vui lòng nhập tên"),

  NgaySinh: yup
    .date()
    .typeError("Ngày sinh không hợp lệ")
    .max(new Date(), "Ngày sinh không được lớn hơn ngày hiện tại")
    .required("Vui lòng chọn ngày sinh"),

  DiaChi: yup.string().required("Vui lòng nhập địa chỉ"),

  DienThoai: yup
    .string()
    .matches(/^0\d{9}$/, "Số điện thoại phải gồm 10 số")
    .required("Vui lòng nhập số điện thoại")
    .test(
      "unique-phone",
      "Số điện thoại đã tồn tại",
      async (value) => {
        const res = await api.get(`/public/check-phone/${value}`);
        return !res.data.exists;
      }
    ),

  Password: yup
    .string()
    .min(6, "Mật khẩu phải từ 6 ký tự trở lên")
    .required("Vui lòng nhập mật khẩu"),

  Phai: yup.string(),
});

const submit = async (values) => {
  try {
    await auth.register(values);
    alert("Đăng ký thành công!");
    window.location.href = "/login";
  } catch (err) {
    alert(err.response?.data?.message || "Lỗi đăng ký");
  }
};
</script>


<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
.auth-card {
  width: 450px;
  padding: 32px;
  border-radius: 14px;
  background: white;
  border: 1px solid #ddd;
}
</style>
