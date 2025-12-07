const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");

class DocGiaAuthService {
  constructor(client) {
    this.collection = client.db().collection("DOCGIA");
  }

  async generateMaDocGia() {
    const last = await this.collection
      .find()
      .sort({ MaDocGia: -1 })
      .limit(1)
      .toArray();

    if (last.length === 0) return "DG001";

    const lastCode = last[0].MaDocGia; 
    const number = parseInt(lastCode.slice(2)) + 1;
    return "DG" + number.toString().padStart(3, "0");
  }

  async findByPhone(DienThoai) {
    return await this.collection.findOne({ DienThoai });
  }
  async findByMaDocGia(MaDocGia) {
  return await this.collection.findOne({ MaDocGia });
}

  async createUser(payload) {
    const autoCode = await this.generateMaDocGia();
    const hashed = await bcrypt.hash(payload.Password, 10);

    const docgia = {
      MaDocGia: autoCode,
      HoLot: payload.HoLot,
      Ten: payload.Ten,
      Password: hashed,
      NgaySinh: payload.NgaySinh ? new Date(payload.NgaySinh) : null,
      Phai: payload.Phai,
      DiaChi: payload.DiaChi,
      DienThoai: payload.DienThoai
    };

    const result = await this.collection.insertOne(docgia);
    return { _id: result.insertedId, ...docgia };
  }

  async validatePassword(pass, hash) {
    return await bcrypt.compare(pass, hash);
  }
  
}

module.exports = DocGiaAuthService;
