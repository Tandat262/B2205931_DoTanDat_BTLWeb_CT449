<template>
  <NavbarUser />

  <div class="container mt-4" style="max-width: 600px">
    <div class="profile-card shadow p-4">

      <h3 class="fw-bold mb-4 text-center">Thông tin cá nhân</h3>

      <Form
  :validation-schema="schema"
  :initial-values="initialValues"
  :key="JSON.stringify(initialValues)"
  @submit="update"
>


        <div class="mb-3">
          <label>Họ lót</label>
          <Field name="HoLot" class="form-control" />
          <ErrorMessage name="HoLot" class="text-danger small" />
        </div>

        <div class="mb-3">
          <label>Tên</label>
          <Field name="Ten" class="form-control" />
          <ErrorMessage name="Ten" class="text-danger small" />
        </div>

        <div class="mb-3">
          <label>Ngày sinh</label>
          <Field name="NgaySinh" type="date" class="form-control" />
          <ErrorMessage name="NgaySinh" class="text-danger small" />
        </div>

        <div class="mb-3">
          <label>Giới tính</label>
          <Field as="select" name="Phai" class="form-control">
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </Field>
        </div>

        <div class="mb-3">
          <label>Địa chỉ</label>
          <Field name="DiaChi" class="form-control" />
          <ErrorMessage name="DiaChi" class="text-danger small" />
        </div>

        <div class="mb-3">
          <label>Số điện thoại</label>
          <Field name="DienThoai" class="form-control" disabled />
          <div class="small text-muted">Không thể thay đổi số điện thoại</div>
        </div>

        <button class="btn btn-primary w-100 mt-3">Lưu thay đổi</button>

      </Form>

    </div>
  </div>
</template>

<script setup>
import NavbarUser from "@/components/NavbarUser.vue";
import { useAuthStore } from "@/stores/auth";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import api from "@/api/api";
import { ref, onMounted } from "vue";

const auth = useAuthStore();

const formatDateInput = (iso) => {
  if (!iso) return "";
  return new Date(iso).toISOString().split("T")[0];
};


const initialValues = ref({
  HoLot: "",
  Ten: "",
  NgaySinh: "",
  Phai: "",
  DiaChi: "",
  DienThoai: ""
});


onMounted(async () => {
  try {
    const res = await api.get(`/public/profile/${auth.user.MaDocGia}`);
    const u = res.data;

    initialValues.value = {
      HoLot: u.HoLot,
      Ten: u.Ten,
      NgaySinh: formatDateInput(u.NgaySinh),
      Phai: u.Phai,
      DiaChi: u.DiaChi,
      DienThoai: u.DienThoai
    };
  } catch (err) {
    console.log("Lỗi load profile:", err);
  }
});


const schema = yup.object({
  HoLot: yup.string().required("Vui lòng nhập họ lót"),
  Ten: yup.string().required("Vui lòng nhập tên"),
  NgaySinh: yup.date().max(new Date(), "Ngày sinh không hợp lệ"),
  DiaChi: yup.string().required("Vui lòng nhập địa chỉ"),
});


const update = async (values) => {
  try {
    await api.put(`/public/profile/${auth.user.MaDocGia}`, values);

   
    auth.user = { ...auth.user, ...values };
    localStorage.setItem("user", JSON.stringify(auth.user));

    alert("Cập nhật thành công!");
  } catch (err) {
    alert(err.response?.data?.message || "Lỗi cập nhật");
  }
};
</script>

<style scoped>
.profile-card {
  background: white;
  border-radius: 14px;
  border: 1px solid #ddd;
}
</style>
