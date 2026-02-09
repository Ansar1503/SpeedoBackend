import mongoose, { Model, Types } from "mongoose";
import { IBaseRepository } from "../interface/iBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(new Types.ObjectId(id)).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id).exec();
  }
  async findByIds(ids: string[]): Promise<T[]> {
    const objectIdIds = ids.map((id) => new Types.ObjectId(id));
    return await this.model.find({ _id: { $in: objectIdIds } }).exec();
  }
  async deleteByIds(ids: string[]): Promise<void> {
    const objectIdIds = ids.map((id) => new Types.ObjectId(id));
    await this.model.deleteMany({ _id: { $in: objectIdIds } }).exec();
  }
}
