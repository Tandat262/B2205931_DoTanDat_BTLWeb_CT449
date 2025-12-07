const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class NhanVienService {
  constructor(client) {
    this.NhanVien = client.db().collection("NhanVien");
  }


  extractData(payload) {
    const data = {
      MSNV: payload.MSNV,
      HoTenNV: payload.HoTenNV,
      ChucVu: payload.ChucVu || "Thủ thư",
      DiaChi: payload.DiaChi,
      SoDienThoai: payload.SoDienThoai,
      Password: payload.Password, 
    };

    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    return data;
  }

  
  async create(payload) {
    const data = this.extractData(payload);


    const salt = await bcrypt.genSalt(10);
    data.Password = await bcrypt.hash(data.Password, salt);

    const result = await this.NhanVien.insertOne(data);

    return { _id: result.insertedId, ...data, Password: "[hidden]" };
  }

  async findByMSNV(msnv) {
    return await this.NhanVien.findOne({ MSNV: msnv });
  }

  async validatePassword(raw, hashed) {
    return await bcrypt.compare(raw, hashed);
  }

  async find(filter = {}) {
    const cursor = await this.NhanVien.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.NhanVien.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };

    const updateData = this.extractData(payload);


    if (payload.Password) {
      const salt = await bcrypt.genSalt(10);
      updateData.Password = await bcrypt.hash(payload.Password, salt);
    }

    const result = await this.NhanVien.findOneAndUpdate(
      filter,
      { $set: updateData },
      { returnDocument: "after" }
    );

    return result;
  }

  async delete(id) {
    return await this.NhanVien.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
}

module.exports = NhanVienService;
