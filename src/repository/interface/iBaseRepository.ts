export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  deleteById(id: string): Promise<T | null>;
  findByIds(ids: string[]): Promise<T[]>;
  deleteByIds(ids: string[]): Promise<void>;
}
