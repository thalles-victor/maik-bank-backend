import { UserModel } from '#models';

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

export type PayloadType = {
  sub: string;
  roles: string[];
  isDeleted: boolean;
  isBanned: boolean;
};

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    order: 'ASC' | 'DESC';
  };
  href?: string;
}

export type AuthResponse = {
  user: UserModel;
  access_token: string;
};
