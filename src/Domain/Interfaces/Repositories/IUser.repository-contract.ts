import { UserModel, UserModelUniqRef, UserUpdateModel } from '#models';
import { IBaseRepositoryContract } from './IBase.repository-contract';

export type IUserRepositoryContract = IBaseRepositoryContract<
  UserModel,
  UserUpdateModel,
  UserModelUniqRef
>;
