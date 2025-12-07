const SachService = require("../../services/sach.service");
const MongoDB = require("../../utils/mongodb.util");
const ApiError = require("../../api-error");

exports.create = async (req, res, next) => {
  try {
    const service = new SachService(MongoDB.client);
    const doc = await service.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    next(new ApiError(500, err.message || "Lỗi tạo sách"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const service = new SachService(MongoDB.client);

    const keyword = req.query.keyword?.trim() || "";

    let filter = {};

    if (keyword !== "") {
      const regex = { $regex: keyword, $options: "i" };

      filter = {
        $or: [
          { MaSach: regex },
          { TenSach: regex },
          { MaNXB: regex },
          { NguonGocTacGia: regex },
          { NamXuatBan: !isNaN(keyword) ? Number(keyword) : -99999 },
          { SoQuyen: !isNaN(keyword) ? Number(keyword) : -99999 },
          { DonGia: !isNaN(keyword) ? Number(keyword) : -99999 }
        ]
      };
    }

    console.log("Filter search:", filter);

    const docs = await service.find(filter);
    res.json(docs);
  } catch (err) {
    next(new ApiError(500, "Lỗi lấy danh sách sách"));
  }
};



exports.findOne = async (req, res, next) => {
  try {
    const service = new SachService(MongoDB.client);
    const doc = await service.findById(req.params.id);
    if (!doc) return next(new ApiError(404, "Không tìm thấy sách"));
    res.json(doc);
  } catch (err) {
    next(new ApiError(500, "Lỗi server"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const service = new SachService(MongoDB.client);
    const doc = await service.update(req.params.id, req.body);
    if (!doc) return next(new ApiError(404, "Không tìm thấy sách"));
    res.json({ message: "Cập nhật sách thành công", data: doc });
  } catch (err) {
    next(new ApiError(500, "Lỗi cập nhật"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const service = new SachService(MongoDB.client);
    const doc = await service.delete(req.params.id);
    if (!doc) return next(new ApiError(404, "Không tìm thấy sách"));
    res.json({ message: "Xóa sách thành công" });
  } catch (err) {
    next(new ApiError(500, "Lỗi xóa"));
  }
};