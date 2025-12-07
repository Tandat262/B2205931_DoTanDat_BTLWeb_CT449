const express = require("express");
const router = express.Router();

const sachPublic = require("../controllers/public/sach.public.controller");
const userAuth = require("../controllers/public/user.auth.controller");
const theoDoiPublic = require("../controllers/public/theodoi.public.controller");

router.get("/sach", sachPublic.findAll);
router.get("/sach/:id", sachPublic.findOne);

router.post("/register", userAuth.register);
router.post("/login", userAuth.login);


router.post("/muon", theoDoiPublic.muonSach);

router.get("/muon/:MaDocGia", theoDoiPublic.lichSuMuon);

router.get("/muon/full/:MaDocGia", theoDoiPublic.lichSuMuonFull);
router.get("/check-phone/:phone", userAuth.checkPhone);
router.get("/profile/:MaDocGia", userAuth.getProfile);
router.put("/profile/:MaDocGia", userAuth.updateProfile);

module.exports = router;
