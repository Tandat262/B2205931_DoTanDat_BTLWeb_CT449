const jwt = require("jsonwebtoken");
const DocGiaAuthService = require("../../services/docgia.auth.service");
const MongoDB = require("../../utils/mongodb.util");
const ApiError = require("../../api-error");

exports.register = async (req, res, next) => {
  try {
    const service = new DocGiaAuthService(MongoDB.client);

    const exist = await service.findByPhone(req.body.DienThoai);
    if (exist) return next(new ApiError(400, "Số điện thoại đã tồn tại"));

    const user = await service.createUser(req.body);

    res.status(201).json({
      message: "Đăng ký thành công",
      user
    });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};
exports.checkPhone = async (req, res, next) => {
  try {
    const phone = req.params.phone;
    const service = new DocGiaAuthService(MongoDB.client);

    const exist = await service.findByPhone(phone);

    res.json({ exists: !!exist });
  } catch (err) {
    next(new ApiError(500, "Lỗi server"));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { DienThoai, Password } = req.body;

    const service = new DocGiaAuthService(MongoDB.client);
    const user = await service.findByPhone(DienThoai);

    if (!user) return next(new ApiError(403, "Số điện thoại không tồn tại"));

    const valid = await service.validatePassword(Password, user.Password);
    if (!valid) return next(new ApiError(403, "Sai mật khẩu"));

    const token = jwt.sign(
      { id: user._id, madocgia: user.MaDocGia },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
    token,
    user: {
    MaDocGia: user.MaDocGia,
    HoLot: user.HoLot,
    Ten: user.Ten,
    DienThoai: user.DienThoai,
    NgaySinh: user.NgaySinh,
    Phai: user.Phai,
    DiaChi: user.DiaChi
  }
});

  } catch (err) {
    next(new ApiError(500, "Lỗi server"));
  }
};
exports.updateProfile = async (req, res, next) => {
  try {
    const { MaDocGia } = req.params;

    const service = new DocGiaAuthService(MongoDB.client);

    const user = await service.collection.findOne({ MaDocGia });
    if (!user) return next(new ApiError(404, "Không tìm thấy độc giả"));

    delete req.body.MaDocGia;
    delete req.body.Password;

    await service.collection.updateOne(
      { MaDocGia },
      { $set: req.body }
    );

    res.json({ message: "Cập nhật thông tin thành công" });
  } catch (err) {
    next(new ApiError(500, "Lỗi cập nhật thông tin"));
  }
};
exports.getProfile = async (req, res, next) => {
  try {
    const service = new DocGiaAuthService(MongoDB.client);

    const user = await service.findByMaDocGia(req.params.MaDocGia);

    if (!user) return next(new ApiError(404, "Không tìm thấy độc giả"));

    res.json(user);

  } catch (err) {
    next(new ApiError(500, "Lỗi server"));
  }
};
