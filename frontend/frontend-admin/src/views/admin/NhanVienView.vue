<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold" style="color: var(--primary)">
        <i class="bi bi-person-badge me-2"></i> Quản lý Nhân viên
      </h2>
      <button class="btn btn-primary fw-bold" @click="openAddModal">
        <i class="bi bi-plus-lg me-2"></i> Thêm Nhân viên
      </button>
    </div>

 
    <div class="card p-3 mb-4 shadow-sm">
      <input
        v-model="keyword"
        @input="fetchList"
        class="form-control form-control-lg"
        placeholder="Tìm theo tên hoặc MSNV..."
      />
    </div>

    
    <div class="card shadow-sm">
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>MSNV</th>
              <th>Họ tên</th>
              <th>Chức vụ</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(nv, index) in list" :key="nv._id">
              <td>{{ index + 1 }}</td>
              <td>{{ nv.MSNV }}</td>
              <td>{{ nv.HoTenNV }}</td>
              <td>{{ nv.ChucVu }}</td>
              <td>{{ nv.DiaChi }}</td>
              <td>{{ nv.SoDienThoai }}</td>

              <td class="text-end">
                <button class="btn btn-warning btn-sm me-2" @click="openEditModal(nv)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-danger btn-sm" @click="remove(nv._id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>

            <tr v-if="list.length === 0">
              <td colspan="7" class="text-center text-muted py-4">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  
    <div class="modal fade" id="nvModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" style="border-radius: 16px">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">{{ isEditing ? "Sửa" : "Thêm" }} Nhân viên</h5>
            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">

           
           <Form
  :key="formKey"
  :validation-schema="schema"
  @submit="handleSave"
  ref="formRef"
  v-slot="{ errors }"
>

              <div class="row g-3">
                <div class="col-md-6">
                  <label class="fw-bold">MSNV</label>
                  <Field name="MSNV" class="form-control" :disabled="isEditing" />
                  <span class="text-danger small">{{ errors.MSNV }}</span>
                </div>

                <div class="col-md-6">
                  <label class="fw-bold">Họ tên</label>
                  <Field name="HoTenNV" class="form-control" />
                  <span class="text-danger small">{{ errors.HoTenNV }}</span>
                </div>

                <div class="col-md-6">
                  <label class="fw-bold">Mật khẩu</label>
                  <Field
                    name="Password"
                    type="password"
                    class="form-control"
                    :placeholder="isEditing ? 'Để trống nếu không đổi' : ''"
                  />
                  <span class="text-danger small">{{ errors.Password }}</span>
                </div>

                <div class="col-md-6">
                  <label class="fw-bold">Chức vụ</label>
                  <Field name="ChucVu" class="form-control" />
                  <span class="text-danger small">{{ errors.ChucVu }}</span>
                </div>

                <div class="col-md-6">
                  <label class="fw-bold">Địa chỉ</label>
                  <Field name="DiaChi" class="form-control" />
                  <span class="text-danger small">{{ errors.DiaChi }}</span>
                </div>

                <div class="col-md-6">
                  <label class="fw-bold">Số điện thoại</label>
                  <Field name="SoDienThoai" class="form-control" />
                  <span class="text-danger small">{{ errors.SoDienThoai }}</span>
                </div>
              </div>

              <div class="text-end mt-4">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Hủy</button>
                <button class="btn btn-primary">{{ isEditing ? "Cập nhật" : "Thêm mới" }}</button>
              </div>
            </Form>

          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";   
import api from "@/api/api";
import * as yup from "yup";
import { Form, Field } from "vee-validate";

const list = ref([]);
const keyword = ref("");
const formKey = ref(0);
const isEditing = ref(false);
let editingId = null;
const formRef = ref(null); 


const schema = yup.object({
  MSNV: yup.string().required("Bắt buộc").min(3),
  HoTenNV: yup.string().required("Bắt buộc"),
  ChucVu: yup.string().required("Bắt buộc"),
  DiaChi: yup.string().required("Bắt buộc"),
  SoDienThoai: yup.string().required("Bắt buộc").matches(/^[0-9]+$/, "Chỉ số").min(9),
  Password: yup.string().when([], {
    is: () => !isEditing.value,
    then: s => s.required("Bắt buộc khi thêm mới").min(4),
    otherwise: s => s.optional(),
  }),
});


const fetchList = async () => {
  const res = await api.get("/admin/nhanvien", { params: { keyword: keyword.value } });
  list.value = res.data;
};


const showModal = () => new bootstrap.Modal(document.getElementById("nvModal")).show();
const hideModal = () => bootstrap.Modal.getInstance(document.getElementById("nvModal")).hide();

const openAddModal = () => {
  isEditing.value = false;
  editingId = null;
  formKey.value++;
  showModal();
};


const openEditModal = async (nv) => {
  isEditing.value = true;
  editingId = nv._id;
  formKey.value++;

  await nextTick(); 

  formRef.value?.setValues({
    MSNV: nv.MSNV,
    HoTenNV: nv.HoTenNV,
    ChucVu: nv.ChucVu || "",
    DiaChi: nv.DiaChi || "",
    SoDienThoai: nv.SoDienThoai || "",
    Password: "",
  });

  showModal();
};

const handleSave = async (values) => {
  try {

    if (isEditing.value && !values.Password) {
      delete values.Password;
    }

    if (isEditing.value) {
      await api.put(`/admin/nhanvien/${editingId}`, values);
    } else {
      await api.post("/admin/nhanvien", values);
    }

    hideModal();
    fetchList();
    alert("Lưu thành công!");
  } catch (err) {
    alert(err.response?.data?.message || "Lỗi lưu nhân viên");
  }
};


const remove = async (id) => {
  if (confirm("Xóa nhân viên này?")) {
    await api.delete(`/admin/nhanvien/${id}`);
    fetchList();
  }
};

onMounted(fetchList);
</script>