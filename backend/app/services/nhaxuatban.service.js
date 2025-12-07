const { ObjectId } = require("mongodb");

class NhaXuatBanService {
  constructor(client) {
    this.NXB = client.db().collection("NHAXUATBAN");
  }

  extractData(payload) {
    const data = {
      MaNXB: payload.MaNXB,
      TenNXB: payload.TenNXB,
      DiaChi: payload.DiaChi
    };

    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
    return data;
  }


  async create(payload) {
    const data = this.extractData(payload);
    const result = await this.NXB.insertOne(data);
    return { _id: result.insertedId, ...data };
  }


  async find(filter = {}) {
    const cursor = await this.NXB.find(filter);
    return await cursor.toArray();
  }


  async findById(id) {
    const filter = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { _id: id };

    return await this.NXB.findOne(filter);
  }


  async update(id, payload) {
    const filter = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { _id: id };

    const updateData = this.extractData(payload);

    const result = await this.NXB.findOneAndUpdate(
      filter,
      { $set: updateData },
      { returnDocument: "after" }
    );

    return result;
  }


  async delete(id) {
    const filter = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { _id: id };

    return await this.NXB.findOneAndDelete(filter);
  }
}

module.exports = NhaXuatBanService;
