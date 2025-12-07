const NhaXuatBanService = require("../../services/nhaxuatban.service");
const MongoDB = require("../../utils/mongodb.util");
const ApiError = require("../../api-error");

exports.create = async (req, res, next) => {
  try {
    const service = new NhaXuatBanService(MongoDB.client);
    const doc = await service.create(req.body);
    res.status(201).json({
      message: "Thêm nhà xuất bản thành công",
      data: doc
    });
  } catch (err) {
    next(new ApiError(500, "Lỗi tạo nhà xuất bản"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const service = new NhaXuatBanService(MongoDB.client);
    const docs = await service.find({});
    res.json(docs);
  } catch (err) {
    next(new ApiError(500, "Lỗi lấy danh sách nhà xuất bản"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const service = new NhaXuatBanService(MongoDB.client);
    const doc = await service.findById(req.params.id);

    if (!doc) return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));

    res.json(doc);
  } catch (err) {
    next(new ApiError(500, "Lỗi lấy nhà xuất bản"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const service = new NhaXuatBanService(MongoDB.client);
    const doc = await service.update(req.params.id, req.body);

    if (!doc) return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));

    res.json({ message: "Cập nhật nhà xuất bản thành công", data: doc });
  } catch (err) {
    next(new ApiError(500, "Lỗi cập nhật nhà xuất bản"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const service = new NhaXuatBanService(MongoDB.client);
    const result = await service.delete(req.params.id);

    if (!result)
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản để xóa"));

    res.json({ message: "Xóa nhà xuất bản thành công" });
  } catch (err) {
    next(new ApiError(500, "Lỗi xóa nhà xuất bản"));
  }
};
