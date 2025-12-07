const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");


const sachCtrl = require("../controllers/admin/sach.admin.controller");
const docgiaCtrl = require("../controllers/admin/docgia.admin.controller");
const theodoiCtrl = require("../controllers/admin/theodoi.admin.controller");
const nhanvienCtrl = require("../controllers/admin/nhanvien.admin.controller");
const nxbCtrl = require("../controllers/admin/nxb.admin.controller");
const thongke = require("../controllers/admin/thongke.admin.controller");
// Sách 
router.route("/sach")
  .get(auth, sachCtrl.findAll)
  .post(auth, sachCtrl.create);

router.route("/sach/:id")
  .get(auth, sachCtrl.findOne)
  .put(auth, sachCtrl.update)
  .delete(auth, sachCtrl.delete);

// Độc giả 
router.route("/docgia")
  .get(auth, docgiaCtrl.findAll)
  .post(auth, docgiaCtrl.create);

router.route("/docgia/:id")
  .get(auth, docgiaCtrl.findOne)
  .put(auth, docgiaCtrl.update)
  .delete(auth, docgiaCtrl.delete);  

  // Nhân viên
router.route("/nhanvien")
  .get(auth, nhanvienCtrl.findAll)
  .post(auth, nhanvienCtrl.create);

router.route("/nhanvien/:id")
  .get(auth, nhanvienCtrl.findOne)
  .put(auth, nhanvienCtrl.update)
  .delete(auth, nhanvienCtrl.delete);

// Nhà xuất bản
router.route("/nxb")
  .get(auth, nxbCtrl.findAll)
  .post(auth, nxbCtrl.create);

router.route("/nxb/:id")
  .get(auth, nxbCtrl.findOne)
  .put(auth, nxbCtrl.update)
  .delete(auth, nxbCtrl.delete);


// Mượn trả 
router.route("/muon")
  .post(auth, theodoiCtrl.muonSach);

router.route("/tra/:id")
  .post(auth, theodoiCtrl.traSach);


router.get("/muontra", auth, theodoiCtrl.findAllFull);

router.get("/thongke", thongke.getStatistics);
router.get("/thongke/quahan", auth, theodoiCtrl.quaHan);

module.exports = router;