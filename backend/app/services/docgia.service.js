const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
class DocGiaService {
  constructor(client) {
    this.DocGia = client.db().collection("DOCGIA");
  }

  extractData(payload) {
    const docgia = {
      MaDocGia: payload.MaDocGia,
      HoLot: payload.HoLot,
      Ten: payload.Ten,
      NgaySinh: payload.NgaySinh ? new Date(payload.NgaySinh) : null,
      Phai: payload.Phai,
      DiaChi: payload.DiaChi,
      DienThoai: payload.DienThoai
    };
    if (payload.Password) {
      docgia.Password = bcrypt.hashSync(payload.Password, 10);
    }
    Object.keys(docgia).forEach(k => docgia[k] === undefined && delete docgia[k]);
    return docgia;
  }

  async create(payload) {
    const dg = this.extractData(payload);
    const result = await this.DocGia.insertOne(dg);
    return { _id: result.insertedId, ...dg, Password: undefined};
  }

  async find(filter) {
    const cursor = await this.DocGia.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
  const filter = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { _id: id };    
  return await this.DocGia.findOne(filter);
}

  async update(id, payload) {
  const filter = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { _id: id };

  const result = await this.DocGia.findOneAndUpdate(
    filter,
    { $set: this.extractData(payload) },
    { returnDocument: "after" }
  );
  if (result) delete result.Password;
  return result;
}


  async delete(id) {
  return await this.DocGia.findOneAndDelete({
    _id: ObjectId.isValid(id) ? new ObjectId(id) : null
  });
}

async isPhoneExists(DienThoai, excludeId = null) {
  const filter = { DienThoai };
  if (excludeId) {
    filter._id = { $ne: ObjectId.isValid(excludeId) ? new ObjectId(excludeId) : excludeId };
  }
  const exists = await this.DocGia.findOne(filter);
  return !!exists;
}

}
module.exports = DocGiaService;