import {
  UserModel,
  UserModelUniqRef,
  UserUpdateModel,
} from 'src/Domain/Entities';
import { GetWithPaginationResult, PaginationProps } from '@types';
import { IUserRepositoryContract } from 'src/Domain/Interfaces/Repositories/IUser.repository-contract';

export class UserSequelizeRepository implements IUserRepositoryContract {
  constructor() {}

  create(model: UserModel): Promise<UserModel> {
    throw new Error('Method not implemented.');
  }

  getBy(unqRef: UserModelUniqRef): Promise<UserModel> {
    throw new Error('Method not implemented.');
  }

  update(updModel: UserUpdateModel): Promise<UserModel> {
    throw new Error('Method not implemented.');
  }

  delete(unqRef: UserModelUniqRef): Promise<'success' | 'fail'> {
    throw new Error('Method not implemented.');
  }

  softDelete(unqRef: UserModelUniqRef): Promise<'success' | 'fail'> {
    throw new Error('Method not implemented.');
  }

  getAll(): Promise<UserModel[]> {
    throw new Error('Method not implemented.');
  }

  getMany(
    pagination: PaginationProps,
  ): Promise<GetWithPaginationResult<UserModel[]>> {
    throw new Error('Method not implemented.');
  }
}
