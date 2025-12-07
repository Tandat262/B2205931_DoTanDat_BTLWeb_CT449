<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold" style="color: var(--primary)">
        <i class="bi bi-buildings me-2"></i> Quản lý Nhà Xuất Bản
      </h2>
      <button class="btn btn-primary fw-bold" @click="openAddModal">
        <i class="bi bi-plus-lg me-2"></i> Thêm NXB
      </button>
    </div>


    <div class="card p-3 mb-4 shadow-sm">
      <input
        v-model="keyword"
        @input="fetchList"
        class="form-control form-control-lg"
        placeholder="Tìm theo tên hoặc mã NXB..."
      />
    </div>

 
    <div class="card shadow-sm">
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Mã NXB</th>
              <th>Tên NXB</th>
              <th>Địa chỉ</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(nxb, index) in list" :key="nxb._id">
              <td>{{ index + 1 }}</td>
              <td>{{ nxb.MaNXB }}</td>
              <td>{{ nxb.TenNXB }}</td>
              <td>{{ nxb.DiaChi }}</td>

              <td class="text-end">
                <button class="btn btn-warning btn-sm me-2" @click="openEditModal(nxb)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-danger btn-sm" @click="remove(nxb._id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>

            <tr v-if="list.length === 0">
              <td colspan="5" class="text-center text-muted py-4">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="nxbModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content" style="border-radius: 16px">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">{{ isEditing ? "Sửa" : "Thêm" }} NXB</h5>
            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">

            <Form :validation-schema="schema" @submit="handleSave" v-slot="{ errors, setValues }">

              <div>
                <label class="fw-bold">Mã NXB</label>
                <Field name="MaNXB" class="form-control mb-1" :disabled="isEditing" />
                <span class="text-danger small">{{ errors.MaNXB }}</span>
              </div>

              <div class="mt-3">
                <label class="fw-bold">Tên NXB</label>
                <Field name="TenNXB" class="form-control mb-1" />
                <span class="text-danger small">{{ errors.TenNXB }}</span>
              </div>

              <div class="mt-3">
                <label class="fw-bold">Địa chỉ</label>
                <Field name="DiaChi" class="form-control mb-1" />
                <span class="text-danger small">{{ errors.DiaChi }}</span>
              </div>

              <button class="btn btn-primary w-100 fw-bold mt-3">
                {{ isEditing ? "Cập nhật" : "Thêm mới" }}
              </button>

            </Form>

          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/api";
import { Form, Field } from "vee-validate";
import * as yup from "yup";

const list = ref([]);
const keyword = ref("");

const isEditing = ref(false);
let editingId = null;


const schema = yup.object({
  MaNXB: yup.string()
    .required("Không được bỏ trống")
    .min(3, "Ít nhất 3 ký tự"),

  TenNXB: yup.string()
    .required("Không được bỏ trống"),

  DiaChi: yup.string()
    .nullable()
    .min(5, "Địa chỉ phải ít nhất 5 ký tự"),
});

const fetchList = async () => {
  const res = await api.get("/admin/nxb", { params: { keyword: keyword.value } });
  list.value = res.data;
};


const showModal = () => new bootstrap.Modal(document.getElementById("nxbModal")).show();
const hideModal = () => bootstrap.Modal.getInstance(document.getElementById("nxbModal")).hide();


const openAddModal = () => {
  isEditing.value = false;
  editingId = null;
  showModal();
};


const openEditModal = (nxb) => {
  isEditing.value = true;
  editingId = nxb._id;

  setTimeout(() => {
    const event = new CustomEvent("set-nxb-values", { detail: nxb });
    window.dispatchEvent(event);
  }, 50);

  showModal();
};

const handleSave = async (values) => {
  if (isEditing.value) {
    await api.put(`/admin/nxb/${editingId}`, values);
  } else {
    await api.post(`/admin/nxb`, values);
  }
  hideModal();
  fetchList();
};


const remove = async (id) => {
  if (confirm("Bạn có chắc muốn xóa NXB này?")) {
    await api.delete(`/admin/nxb/${id}`);
    fetchList();
  }
};

onMounted(() => {
  fetchList();

 
  window.addEventListener("set-nxb-values", (e) => {
    const form = document.querySelector("form");
    if (!form) return;

    Object.entries(e.detail).forEach(([key, val]) => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) input.value = val;
    });
  });
});
</script>
