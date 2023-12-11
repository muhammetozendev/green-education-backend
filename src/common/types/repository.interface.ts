export interface IRepository<T> {
  findOne(id: any): Promise<T>;
  findWithPagination(limit: number, page: number): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: any, data: Partial<T>): Promise<T>;
  delete(id: any): Promise<void>;
}
