const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");

class TheoDoiMuonSachService {
  constructor(client) {
    this.collection = client.db().collection("THEODOIMUONSACH");
    this.sachCollection = client.db().collection("SACH");
  }

  async muonSach(payload) {
    const { MaDocGia, MaSach } = payload;

    const sach = await this.sachCollection.findOne({ MaSach });
    if (!sach) throw new ApiError(404, "Không tìm thấy sách");
    if (sach.SoQuyen <= 0) throw new ApiError(400, "Sách đã hết");

    const daMuon = await this.collection.findOne({
      MaDocGia,
      MaSach,
      NgayTra: null
    });
    if (daMuon) throw new ApiError(400, "Độc giả đã mượn quyển này");

    await this.sachCollection.updateOne(
      { MaSach },
      { $inc: { SoQuyen: -1 } }
    );

    const phieu = {
      MaDocGia,
      MaSach,
      NgayMuon: new Date(),
      NgayTra: null
    };

    const result = await this.collection.insertOne(phieu);
    return { _id: result.insertedId, ...phieu };
  }

  async traSach(id) {
    const phieu = await this.collection.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
      NgayTra: null
    });
    if (!phieu) throw new ApiError(400, "Phiếu không tồn tại hoặc đã trả");

    await this.collection.updateOne(
      { _id: phieu._id },
      { $set: { NgayTra: new Date() } }
    );

    await this.sachCollection.updateOne(
      { MaSach: phieu.MaSach },
      { $inc: { SoQuyen: 1 } }
    );

    return { message: "Trả sách thành công" };
  }

  async find(filter = {}) {
    const cursor = await this.collection.find(filter).sort({ NgayMuon: -1 });
    return await cursor.toArray();
  }

  async findFull() {
  const result = await this.collection.aggregate([
    {
      $lookup: {
        from: "DOCGIA",
        localField: "MaDocGia",
        foreignField: "MaDocGia",
        as: "DocGia"
      }
    },
    { $unwind: "$DocGia" },

    {
      $lookup: {
        from: "SACH",
        localField: "MaSach",
        foreignField: "MaSach",
        as: "Sach"
      }
    },
    { $unwind: "$Sach" },

    { $sort: { NgayMuon: -1 } }
  ]).toArray();

  return result;
}


  async findQuaHan(soNgay = 14) {
  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() - soNgay);

  const result = await this.collection.aggregate([
    {
      $match: {
        $or: [
          { NgayTra: null },
          { NgayMuon: { $lt: limitDate } }
        ]
      }
    },
    {
      $lookup: {
        from: "DOCGIA",
        localField: "MaDocGia",
        foreignField: "MaDocGia",
        as: "DocGia"
      }
    },
    { $unwind: "$DocGia" },
    {
      $lookup: {
        from: "SACH",
        localField: "MaSach",
        foreignField: "MaSach",
        as: "Sach"
      }
    },
    { $unwind: "$Sach" },
    { $sort: { NgayMuon: -1 } }
  ]).toArray();

  return result;
}


}

module.exports = TheoDoiMuonSachService;