<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold" style="color: var(--primary);">
        <i class="bi bi-book me-2"></i> Quản lý Sách
      </h2>
      <button class="btn btn-primary fw-bold" @click="openAddModal">
        <i class="bi bi-plus-lg me-2"></i> Thêm Sách
      </button>
    </div>


    <div class="card p-3 mb-4 shadow-sm" style="border-radius: 14px;">
      <div class="row g-3">
        <div class="col-md-4">
          <input
  v-model="keyword"
  @input="fetchBooks"
  @keyup.enter="fetchBooks"
  class="form-control form-control-lg"
  placeholder="Tìm theo tên sách..."
/>

        </div>
      </div>
    </div>

    <div class="card shadow-sm" style="border-radius: 14px;">
      <div class="table-responsive">
        <table class="table table-striped table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Ảnh</th>
              <th>Mã sách</th>
              <th>Tên sách</th>
              <th>Đơn giá</th>
              <th>Số quyển</th>
              <th>Năm XB</th>
              <th>Mã NXB</th>
              <th>Nguồn gốc tác giả</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(book, index) in books" :key="book._id">
              <td>{{ index + 1 }}</td>
              <td><img :src="book.Img || '/no-image.png'" 
              style="width: 60px; height: 80px; object-fit: cover; border-radius: 6px;">
              </td>
              <td>{{ book.MaSach }}</td>
              <td>{{ book.TenSach }}</td>
              <td>{{ book.DonGia }}</td>
              <td>{{ book.SoQuyen }}</td>
              <td>{{ book.NamXuatBan }}</td>
              <td>{{ book.MaNXB }}</td>
              <td>{{ book.NguonGocTacGia }}</td>

              <td class="text-end">
                <button class="btn btn-warning btn-sm me-2" @click="openEditModal(book)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteBook(book._id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>

            <tr v-if="books.length === 0">
              <td colspan="9" class="text-center py-4 text-muted">
                Không có dữ liệu
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="bookModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" style="border-radius: 16px;">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title fw-bold">{{ isEditing ? "Sửa Sách" : "Thêm Sách" }}</h5>
            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
           <Form
  :validation-schema="schema"
  @submit="saveBook"
  ref="bookForm"
>
  <div class="row g-3">
      <div class="col-md-12">
  <label class="fw-bold">Link ảnh sách</label>
  <Field name="Img" class="form-control" placeholder="https://link-anh..." />

  <ErrorMessage name="Img" class="text-danger small" />


  <img 
    v-if="bookForm?.values?.Img" 
    :src="bookForm.values.Img" 
    class="mt-2"
    style="width:120px; height:160px; object-fit:cover; border-radius:8px; box-shadow: var(--shadow);"
  >
</div>

    <div class="col-md-6">
      <label class="fw-bold">Mã sách</label>
      <Field name="MaSach" class="form-control" />
      <ErrorMessage name="MaSach" class="text-danger small" />
    </div>

    <div class="col-md-6">
      <label class="fw-bold">Tên sách</label>
      <Field name="TenSach" class="form-control" />
      <ErrorMessage name="TenSach" class="text-danger small" />
    </div>

    <div class="col-md-6">
      <label class="fw-bold">Đơn giá</label>
      <Field type="number" name="DonGia" class="form-control" />
      <ErrorMessage name="DonGia" class="text-danger small" />
    </div>

    <div class="col-md-6">
      <label class="fw-bold">Số quyển</label>
      <Field type="number" name="SoQuyen" class="form-control" />
      <ErrorMessage name="SoQuyen" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="fw-bold">Năm xuất bản</label>
      <Field type="number" name="NamXuatBan" class="form-control" />
      <ErrorMessage name="NamXuatBan" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="fw-bold">Nhà xuất bản</label>
      <Field as="select" name="MaNXB" class="form-control">
        <option value="">-- Chọn Nhà xuất bản --</option>
        <option v-for="n in nxbList" :key="n._id" :value="n.MaNXB">
          {{ n.TenNXB }} ({{ n.MaNXB }})
        </option>
      </Field>
      <ErrorMessage name="MaNXB" class="text-danger small" />
    </div>

    <div class="col-md-4">
      <label class="fw-bold">Nguồn gốc tác giả</label>
      <Field name="NguonGocTacGia" class="form-control" />
      <ErrorMessage name="NguonGocTacGia" class="text-danger small" />
    </div>

  </div>

  <div class="text-end mt-4">
    <button class="btn btn-primary">
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
import { ref, onMounted } from "vue";
import api from "@/api/api";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

const books = ref([]);
const keyword = ref("");
const nxbList = ref([]);

const isEditing = ref(false);
let editingId = null;

const bookForm = ref(null);


const schema = yup.object({
  MaSach: yup.string().required("Mã sách không được bỏ trống"),
  TenSach: yup.string().required("Tên sách không được bỏ trống"),
  DonGia: yup.number().typeError("Phải là số").positive().required(),
  SoQuyen: yup.number().typeError("Phải là số").min(1).required(),
  NamXuatBan: yup.number().nullable().typeError("không bỏ trống").max(2025, "Năm không hợp lệ"),
  MaNXB: yup.string().required("Vui lòng chọn NXB"),
  NguonGocTacGia: yup.string().required("Vui lòng nhập nguồn gốc"),
  Img: yup.string().nullable(),
});

const fetchBooks = async () => {
  const res = await api.get("/admin/sach", { params: { keyword: keyword.value } });
  books.value = res.data;
};

const fetchNXB = async () => {
  const res = await api.get("/admin/nxb");
  nxbList.value = res.data;
};


const openAddModal = () => {
  isEditing.value = false;
  editingId = null;

  bookForm.value.resetForm({
    values: {
      MaSach: "",
      TenSach: "",
      DonGia: "",
      SoQuyen: "",
      NamXuatBan: "",
      MaNXB: "",
      NguonGocTacGia: "",
      Img: "",
    }
  });

  showModal();
};


const openEditModal = (book) => {
  isEditing.value = true;
  editingId = book._id;

  bookForm.value.setValues({
    MaSach: book.MaSach,
    TenSach: book.TenSach,
    DonGia: book.DonGia,
    SoQuyen: book.SoQuyen,
    NamXuatBan: book.NamXuatBan,
    MaNXB: book.MaNXB,
    NguonGocTacGia: book.NguonGocTacGia,
    Img: book.Img,

  });

  showModal();
};


const saveBook = async (values) => {
  if (isEditing.value)
    await api.put(`/admin/sach/${editingId}`, values);
  else
    await api.post("/admin/sach", values);

  hideModal();
  fetchBooks();
};


const deleteBook = async (id) => {
  if (confirm("Bạn có chắc muốn xóa?")) {
    await api.delete(`/admin/sach/${id}`);
    fetchBooks();
  }
};


const showModal = () =>
  new bootstrap.Modal(document.getElementById("bookModal")).show();

const hideModal = () =>
  bootstrap.Modal.getInstance(document.getElementById("bookModal")).hide();

onMounted(() => {
  fetchBooks();
  fetchNXB();
});
</script>




