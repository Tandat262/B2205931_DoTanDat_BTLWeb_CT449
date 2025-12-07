const MongoDB = require("../../utils/mongodb.util");
const ApiError = require("../../api-error");

exports.getStatistics = async (req, res, next) => {
  try {
    const db = MongoDB.client.db();

    const SACH = db.collection("SACH");
    const DOCGIA = db.collection("DOCGIA");
    const NHANVIEN = db.collection("NhanVien");
    const MUONTRA = db.collection("THEODOIMUONSACH");


    const totalBooks = await SACH.countDocuments();


    const totalReaders = await DOCGIA.countDocuments();

    const totalStaff = await NHANVIEN.countDocuments();


    const borrowing = await MUONTRA.countDocuments({ NgayTra: null });

    res.json({
      totalBooks,
      totalReaders,
      totalStaff,
      borrowing
    });

  } catch (err) {
    next(new ApiError(500, "Lỗi lấy thống kê"));
  }
};
