export type PaginationProps = {
  page: number;
  limit: number;
  order?: 'ASC' | 'DESC';
};

export type GetWithPaginationResult<D> = {
  data: D;
  metadata: PaginationProps & { total: number };
};

export type ThrowErrorMessage = {
  ptBr: string;
  enUs: string;
};
