import { GetWithPaginationResult, PaginationProps } from '@types';

export interface IBaseRepositoryContract<Model, UpdateModel, ModelUniqueRefs> {
  create(model: Model): Promise<Model>;
  getBy(unqRef: ModelUniqueRefs): Promise<Model | null>;
  update(unqRef: ModelUniqueRefs, updModel: UpdateModel): Promise<Model>;
  delete(unqRef: ModelUniqueRefs): Promise<'success' | 'fail'>;
  softDelete(unqRef: ModelUniqueRefs): Promise<'success' | 'fail'>;
  getAll(where?: Partial<Model>): Promise<Model[]>;
  getMany(
    pagination: PaginationProps,
    where?: Partial<Model>,
  ): Promise<GetWithPaginationResult<Model[]>>;
}
