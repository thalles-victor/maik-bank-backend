import {
  AccountModel,
  AccountModelUniqRef,
  AccountUpdateModel,
} from 'src/Domain/Entities/Account.entity';
import { IBaseRepositoryContract } from './IBase.repository-contract';

export type IAccountRepositoryContact = IBaseRepositoryContract<
  AccountModel,
  AccountUpdateModel,
  AccountModelUniqRef
>;
