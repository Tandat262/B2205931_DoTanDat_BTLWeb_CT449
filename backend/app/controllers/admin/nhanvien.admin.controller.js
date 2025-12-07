const NhanVienService = require("../../services/nhanvien.service");
const MongoDB = require("../../utils/mongodb.util");
const ApiError = require("../../api-error");

exports.findAll = async (req, res, next) => {
  try {
    const service = new NhanVienService(MongoDB.client);

    let filter = {};
    const keyword = req.query.keyword;

    // Tìm kiếm theo tên hoặc MSNV
    if (keyword) {
      filter = {
        $or: [
          { HoTenNV: { $regex: keyword, $options: "i" } },
          { MSNV: { $regex: keyword, $options: "i" } }
        ]
      };
    }

    const result = await service.find(filter);
    res.send(result);

  } catch (err) {
    next(new ApiError(500, "Lỗi truy xuất nhân viên"));
  }
};


exports.findOne = async (req, res, next) => {
  try {
    const service = new NhanVienService(MongoDB.client);
    const nv = await service.findById(req.params.id);
    
    if (!nv) return next(new ApiError(404, "Không tìm thấy nhân viên"));

    res.send(nv);

  } catch (err) {
    next(new ApiError(500, "Lỗi truy xuất nhân viên"));
  }
};


exports.create = async (req, res, next) => {
  try {
    const service = new NhanVienService(MongoDB.client);
    const created = await service.create(req.body);
    res.send(created);

  } catch (err) {
    next(new ApiError(500, "Lỗi tạo nhân viên"));
  }
};


exports.update = async (req, res, next) => {
  try {
    const service = new NhanVienService(MongoDB.client);
    const updated = await service.update(req.params.id, req.body);

    if (!updated)
      return next(new ApiError(404, "Không tìm thấy nhân viên"));

    res.send(updated);

  } catch (err) {
    next(new ApiError(500, "Lỗi cập nhật nhân viên"));
  }
};


exports.delete = async (req, res, next) => {
  try {
    const service = new NhanVienService(MongoDB.client);
    const deleted = await service.delete(req.params.id);

    if (!deleted)
      return next(new ApiError(404, "Không tìm thấy nhân viên"));

    res.send({ message: "Đã xóa nhân viên" });

  } catch (err) {
    next(new ApiError(500, "Lỗi xóa nhân viên"));
  }
};
