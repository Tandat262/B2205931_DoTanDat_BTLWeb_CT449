<template>
  <div>
  
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold" style="color: var(--primary)">
        Quản lý Độc giả
      </h2>
      <button class="btn btn-primary fw-bold" @click="openAddModal">
        Thêm Độc giả
      </button>
    </div>

    
    <div class="card p-3 mb-4 shadow-sm" style="border-radius: 14px;">
      <input
        v-model="keyword"
        @input="fetchDocGia"
        class="form-control form-control-lg"
        placeholder="Tìm độc giả theo tên, mã, địa chỉ, SĐT..."
      />
    </div>

   
    <div class="card shadow-sm" style="border-radius: 14px;">
      <div class="table-responsive">
        <table class="table table-striped table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Mã DG</th>
              <th>Họ lót</th>
              <th>Tên</th>
              <th>Ngày sinh</th>
              <th>Phái</th>
              <th>Địa chỉ</th>
              <th>SĐT</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dg, index) in dsDocGia" :key="dg._id">
              <td>{{ index + 1 }}</td>
              <td>{{ dg.MaDocGia }}</td>
              <td>{{ dg.HoLot }}</td>
              <td>{{ dg.Ten }}</td>
              <td>{{ formatDate(dg.NgaySinh) }}</td>
              <td>{{ dg.Phai }}</td>
              <td>{{ dg.DiaChi }}</td>
              <td>{{ dg.DienThoai }}</td>
              <td class="text-end">
                <button class="btn btn-warning btn-sm me-2" @click="openEditModal(dg)">
                  Sửa
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteDocGia(dg._id)">
                  Xóa
                </button>
              </td>
            </tr>
            <tr v-if="dsDocGia.length === 0">
              <td colspan="9" class="text-center py-4 text-muted">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <div class="modal fade" id="docGiaModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" style="border-radius: 14px;">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title fw-bold">
              {{ isEditing ? "Sửa Độc giả" : "Thêm Độc giả" }}
            </h5>
            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <Form
              :key="formKey"
              :validation-schema="schema"
              @submit="handleSave"
              ref="formRef"
              v-slot="{ errors, setErrors }"
            >
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="fw-bold">Mã độc giả</label>
                  <Field name="MaDocGia" class="form-control" :disabled="isEditing" />
                  <span class="text-danger small">{{ errors.MaDocGia }}</span>
                </div>
                <div class="col-md-4">
                  <label class="fw-bold">Họ lót</label>
                  <Field name="HoLot" class="form-control" />
                  <span class="text-danger small">{{ errors.HoLot }}</span>
                </div>
                <div class="col-md-4">
                  <label class="fw-bold">Tên</label>
                  <Field name="Ten" class="form-control" />
                  <span class="text-danger small">{{ errors.Ten }}</span>
                </div>

                <div class="col-md-4">
                  <label class="fw-bold">Ngày sinh</label>
                  <Field type="date" name="NgaySinh" class="form-control" />
                  <span class="text-danger small">{{ errors.NgaySinh }}</span>
                </div>

                <div class="col-md-4">
                  <label class="fw-bold">Phái</label>
                  <Field as="select" name="Phai" class="form-select">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </Field>
                  <span class="text-danger small">{{ errors.Phai }}</span>
                </div>

                <div class="col-md-4">
                  <label class="fw-bold">SĐT</label>
                  <Field name="DienThoai" class="form-control" />
                  <span class="text-danger small">{{ errors.DienThoai }}</span>
                </div>
                <div class="col-md-6">
                <label class="fw-bold">Mật khẩu</label>
                <Field name="Password" type="password"
                  class="form-control"
                  :placeholder="isEditing ? 'Để trống nếu không đổi' : 'Nhập mật khẩu'"/>
                  <span class="text-danger small">{{ errors.Password }}</span>
                  </div>
                <div class="col-md-12">
                  <label class="fw-bold">Địa chỉ</label>
                  <Field name="DiaChi" class="form-control" />
                  <span class="text-danger small">{{ errors.DiaChi }}</span>
                </div>
              </div>

              <div class="text-end mt-4">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">
                  Hủy
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ isEditing ? "Cập nhật" : "Thêm mới" }}
                </button>
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
import { Form, Field } from "vee-validate";
import * as yup from "yup";

const dsDocGia = ref([]);
const keyword = ref("");
const formKey = ref(0);       
const isEditing = ref(false);
let editingId = null;
const formRef = ref(null);   

const schema = yup.object({
  MaDocGia: yup.string().required("Bắt buộc"),
  HoLot: yup.string().required("Bắt buộc"),
  Ten: yup.string().required("Bắt buộc"),
  NgaySinh: yup.date().max(new Date(), "Không được lớn hơn hôm nay").nullable(),
  Phai: yup.string().oneOf(["Nam", "Nữ"]).required("Bắt buộc"),
  DiaChi: yup.string().required("Bắt buộc"),
  DienThoai: yup.string().matches(/^0\d{9}$/, "Phải là 10 số, bắt đầu bằng 0").required("Bắt buộc"),
  Password: yup.string().when([], {
    is: () => !isEditing.value,
    then: (s) => s.required("Mật khẩu bắt buộc khi thêm mới").min(4, "Tối thiểu 4 ký tự"),
    otherwise: (s) => s.optional(),
  }),
});


const fetchDocGia = async () => {
  const res = await api.get("/admin/docgia", { params: { keyword: keyword.value } });
  dsDocGia.value = res.data;
};

const formatDate = (val) => (val ? new Date(val).toLocaleDateString("vi-VN") : "");


const showModal = () => new bootstrap.Modal(document.getElementById("docGiaModal")).show();
const hideModal = () => bootstrap.Modal.getInstance(document.getElementById("docGiaModal")).hide();


const openAddModal = () => {
  isEditing.value = false;
  editingId = null;
  formKey.value++;
  showModal();
};


const openEditModal = async (dg) => {
  isEditing.value = true;
  editingId = dg._id;
  formKey.value++; 

  await nextTick();

  formRef.value?.setValues({
    MaDocGia: dg.MaDocGia,
    HoLot: dg.HoLot,
    Ten: dg.Ten,
    NgaySinh: dg.NgaySinh ? dg.NgaySinh.substring(0, 10) : "",
    Phai: dg.Phai,
    DiaChi: dg.DiaChi,
    DienThoai: dg.DienThoai,
  });

  showModal();
};


const handleSave = async (values, { setErrors }) => {
  try {
    if (isEditing.value) {
      await api.put(`/admin/docgia/${editingId}`, values);
    } else {
      await api.post("/admin/docgia", values);
    }
    hideModal();
    fetchDocGia();
  } catch (err) {
   
    if (err.response?.status === 400 && err.response?.data?.message.includes("điện thoại")) {
      setErrors({ DienThoai: err.response.data.message });
    } else {
      alert("Lỗi: " + (err.response?.data?.message || "Không thể lưu"));
    }
  }
};


const deleteDocGia = async (id) => {
  if (confirm("Xóa độc giả này?")) {
    await api.delete(`/admin/docgia/${id}`);
    fetchDocGia();
  }
};

onMounted(fetchDocGia);
</script>

<style scoped>
.table td,
.table th {
  vertical-align: middle;
}
</style>