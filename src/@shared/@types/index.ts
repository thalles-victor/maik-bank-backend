import { UserModel } from '#models';
import { TransactionAggregate } from 'src/Domain/Aggregates/Transactions.aggregate';

export type PaginationProps = {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, any>;
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
  meta?: PaginationProps;
  href?: string;
}

export type AuthResponse = {
  user: UserModel;
  access_token: string;
};

export interface TransactionUseCaseResult {
  transaction: TransactionAggregate;
  pdfVoucherUrl: string;
}
