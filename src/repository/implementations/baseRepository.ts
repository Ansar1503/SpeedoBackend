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

  async find(filter?: Partial<T> | undefined): Promise<T[]> {
    return await this.model.find();
  }
  async findOne(filter: Partial<T>): Promise<T | null> {
    return await this.model.findOne();
  }
  async updateById(
    id: string,
    update: mongoose.UpdateQuery<T>,
  ): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
