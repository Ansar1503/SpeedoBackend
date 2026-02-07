import mongoose, { Model, Document } from "mongoose";
import { IBaseRepository } from "../interface/iBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  find(filter?: Partial<T> | undefined): Promise<T[]> {
    return this.model.find();
  }
  findOne(filter: Partial<T>): Promise<T | null> {
    return this.model.findOne();
  }
  updateById(id: string, update: mongoose.UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
