const TheoDoiService = require("../../services/theodoimuonsach.service");
const MongoDB = require("../../utils/mongodb.util");
const ApiError = require("../../api-error");

exports.muonSach = async (req, res, next) => {
  try {
    const service = new TheoDoiService(MongoDB.client);
    const phieu = await service.muonSach(req.body);
    res.status(201).json({ message: "Mượn sách thành công", phieu });
  } catch (err) {
    next(new ApiError(400, err.message || "Không thể mượn sách"));
  }
};

exports.traSach = async (req, res, next) => {
  try {
    const service = new TheoDoiService(MongoDB.client);
    const result = await service.traSach(req.params.id);
    res.json(result);
  } catch (err) {
    next(new ApiError(400, err.message || "Không thể trả sách"));
  }
};


exports.quaHan = async (req, res, next) => {
  try {
    const service = new TheoDoiService(MongoDB.client);
    const danhSach = await service.findQuaHan(14); 
    res.json({ 
      quaHan: danhSach.length, 
      danhSach 
    });
  } catch (err) {
    next(new ApiError(500, "Lỗi lấy báo cáo quá hạn"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const service = new TheoDoiService(MongoDB.client);
    const list = await service.find(); 
    res.json(list);
  } catch (err) {
    next(new ApiError(500, "Lỗi lấy danh sách mượn trả"));
  }
};

exports.findAllFull = async (req, res, next) => {
  try {
    const service = new TheoDoiService(MongoDB.client);
    const list = await service.findFull();
    res.json(list);
  } catch (err) {
    next(new ApiError(500, "Lỗi lấy danh sách mượn trả"));
  }
};
