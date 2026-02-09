"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const mongoose_1 = require("mongoose");
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return await this.model.create(data);
    }
    async findById(id) {
        return await this.model.findById(new mongoose_1.Types.ObjectId(id)).exec();
    }
    async deleteById(id) {
        return await this.model.findByIdAndDelete(id).exec();
    }
    async findByIds(ids) {
        const objectIdIds = ids.map((id) => new mongoose_1.Types.ObjectId(id));
        return await this.model.find({ _id: { $in: objectIdIds } }).exec();
    }
    async deleteByIds(ids) {
        const objectIdIds = ids.map((id) => new mongoose_1.Types.ObjectId(id));
        await this.model.deleteMany({ _id: { $in: objectIdIds } }).exec();
    }
}
exports.BaseRepository = BaseRepository;
