const TheoDoiService = require("../../services/theodoimuonsach.service");
const MongoDB = require("../../utils/mongodb.util");
const ApiError = require("../../api-error");


exports.muonSach = async (req, res, next) => {
  try {
    const { MaDocGia, MaSach } = req.body;

    if (!MaDocGia || !MaSach)
      return next(new ApiError(400, "Thiếu thông tin mượn sách"));

    const service = new TheoDoiService(MongoDB.client);
    const phieu = await service.muonSach({ MaDocGia, MaSach });

    res.status(201).json({
      message: "Mượn sách thành công",
      phieu,
    });
  } catch (err) {
    next(new ApiError(400, err.message || "Không thể mượn sách"));
  }
};


exports.lichSuMuon = async (req, res, next) => {
  try {
    const { MaDocGia } = req.params;

    const service = new TheoDoiService(MongoDB.client);
    const list = await service.find({ MaDocGia });

    res.json(list);
  } catch (err) {
    next(new ApiError(500, "Không lấy được lịch sử mượn"));
  }
};


exports.lichSuMuonFull = async (req, res, next) => {
  try {
    const { MaDocGia } = req.params;

    const service = new TheoDoiService(MongoDB.client);
    const full = await service.findFull();

    res.json(full.filter((x) => x.MaDocGia === MaDocGia));
  } catch (err) {
    next(new ApiError(500, "Không lấy được dữ liệu mượn FULL"));
  }
};
