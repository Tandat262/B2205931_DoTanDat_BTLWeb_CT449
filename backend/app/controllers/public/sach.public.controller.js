const SachService = require("../../services/sach.service");
const MongoDB = require("../../utils/mongodb.util");
const ApiError = require("../../api-error");

exports.findAll = async (req, res, next) => {
  try {
    const service = new SachService(MongoDB.client);

    const keyword = req.query.search;

    const filter = keyword
      ? {
          $or: [
            { TenSach: { $regex: keyword, $options: "i" } },
            { NguonGocTacGia: { $regex: keyword, $options: "i" } }
          ]
        }
      : {};

    const docs = await service.find(filter);
    res.json(docs);

  } catch (err) {
    next(new ApiError(500, "Lỗi lấy danh sách sách"));
  }
};



exports.findOne = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.findById(req.params.id);
    if (!document) return next(new ApiError(404, "Không tìm thấy sách"));
    res.send(document);
  } catch (error) {
    next(new ApiError(500, "Lỗi server"));
  }
};