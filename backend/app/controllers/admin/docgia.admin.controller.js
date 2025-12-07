const DocGiaService = require("../../services/docgia.service");
const MongoDB = require("../../utils/mongodb.util");
const ApiError = require("../../api-error");

exports.create = async (req, res, next) => {
  try {
    const service = new DocGiaService(MongoDB.client);

    const phoneExists = await service.isPhoneExists(req.body.DienThoai);
    if (phoneExists) {
      return next(new ApiError(400, "Số điện thoại đã tồn tại"));
    }

    const doc = await service.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    next(new ApiError(500, "Lỗi tạo độc giả"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const keyword = req.query.keyword || "";
    const service = new DocGiaService(MongoDB.client);

    let filter = {};

    if (keyword) {
      filter = {
        $or: [
          { MaDocGia: { $regex: keyword, $options: "i" } },
          { HoLot: { $regex: keyword, $options: "i" } },
          { Ten: { $regex: keyword, $options: "i" } },
          { DiaChi: { $regex: keyword, $options: "i" } },
          { DienThoai: { $regex: keyword, $options: "i" } }
        ]
      };
    }

    const docs = await service.find(filter);
    res.json(docs);
  } catch (err) {
    next(new ApiError(500, "Lỗi lấy danh sách độc giả"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const service = new DocGiaService(MongoDB.client);
    const doc = await service.findById(req.params.id);

    if (!doc) return next(new ApiError(404, "Không tìm thấy độc giả"));

    res.json(doc);
  } catch (err) {
    next(new ApiError(500, "Lỗi server"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const service = new DocGiaService(MongoDB.client);

    if (req.body.DienThoai) {
      const phoneExists = await service.isPhoneExists(req.body.DienThoai, req.params.id);
      if (phoneExists) {
        return next(new ApiError(400, "Số điện thoại đã được sử dụng bởi độc giả khác"));
      }
    }

    const doc = await service.update(req.params.id, req.body);
    if (!doc) return next(new ApiError(404, "Không tìm thấy độc giả"));

    res.json({ message: "Cập nhật thành công", data: doc });
  } catch (err) {
    next(new ApiError(500, "Lỗi cập nhật độc giả"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const service = new DocGiaService(MongoDB.client);
    const doc = await service.delete(req.params.id);

    if (!doc) return next(new ApiError(404, "Không tìm thấy độc giả"));

    res.json({ message: "Xóa độc giả thành công" });
  } catch (err) {
    next(new ApiError(500, "Lỗi xóa độc giả"));
  }
};
