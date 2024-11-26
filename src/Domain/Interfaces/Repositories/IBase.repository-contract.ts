import { GetWithPaginationResult, PaginationProps } from '@types';

export interface IBaseRepositoryContract<Model, UpdateModel, ModelUniqueRefs> {
  create(model: Model): Promise<Model>;
  getBy(unqRef: ModelUniqueRefs): Promise<Model | null>;
  update(updModel: UpdateModel): Promise<Model>;
  delete(unqRef: ModelUniqueRefs): Promise<'success' | 'fail'>;
  softDelete(unqRef: ModelUniqueRefs): Promise<'success' | 'fail'>;
  getAll(): Promise<Model[]>;
  getMany(
    pagination: PaginationProps,
  ): Promise<GetWithPaginationResult<Model[]>>;
}
