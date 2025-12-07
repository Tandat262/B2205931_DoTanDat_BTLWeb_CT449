const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const jwt = require("jsonwebtoken");
const ApiError = require("../api-error"); 

exports.login = async (req, res, next) => {
  try {
    const { MSNV, Password } = req.body;
    const service = new NhanVienService(MongoDB.client);
    const nv = await service.findByMSNV(MSNV);
    if (!nv) return next(new ApiError(403, "Sai MSNV"));

    const valid = await service.validatePassword(Password, nv.Password);
    if (!valid) return next(new ApiError(403, "Sai mật khẩu"));
console.log("SECRET =", process.env.JWT_SECRET);

    const token = jwt.sign({ id: nv._id, msnv: nv.MSNV }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { MSNV: nv.MSNV, HoTenNV: nv.HoTenNV } });
  } catch (err) {
    next(new ApiError(500, "Lỗi server"));
  }
};