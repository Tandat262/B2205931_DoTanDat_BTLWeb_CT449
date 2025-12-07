const { ObjectId } = require("mongodb");

class SachService {
  constructor(client) {
    this.Sach = client.db().collection("SACH");
  }

  extractSachData(payload) {
    const sach = {
      MaSach: payload.MaSach,
      TenSach: payload.TenSach,
      DonGia: payload.DonGia ? Number(payload.DonGia) : 0,
      SoQuyen: payload.SoQuyen ? Number(payload.SoQuyen) : 0,
      NamXuatBan: payload.NamXuatBan ? Number(payload.NamXuatBan) : null,
      MaNXB: payload.MaNXB,
      NguonGocTacGia: payload.NguonGocTacGia,
      Img: payload.Img || null
    };
    Object.keys(sach).forEach(key => sach[key] === undefined && delete sach[key]);
    return sach;
  }

  async create(payload) {
    const sach = this.extractSachData(payload);
    const result = await this.Sach.insertOne(sach);
    return { _id: result.insertedId, ...sach };
  }

  async find(filter = {}) {
  return await this.Sach
    .find(filter)
    .collation({ locale: "vi", strength: 1 })
    .toArray();
}


  async findById(id) {
    return await this.Sach.findOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : null });
  }

  async update(id, payload) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
    const update = this.extractSachData(payload);
    const result = await this.Sach.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Sach.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    });
    return result;
  }
}

module.exports = SachService;