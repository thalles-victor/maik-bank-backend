import {
  AccountModel,
  AccountModelUniqRef,
  AccountUpdateModel,
} from 'src/Domain/Entities/Account.entity';
import { PaginationProps, GetWithPaginationResult } from '@types';
import { IAccountRepositoryContact } from 'src/Domain/Interfaces/Repositories/IAccount.repository-contract';
import { InjectModel } from '@nestjs/sequelize';
import { splitKeyAndValue } from 'src/@shared/@utils/tools';
import { InternalServerErrorException } from '@nestjs/common';

export class AccountSequelizeRepository implements IAccountRepositoryContact {
  constructor(
    @InjectModel(AccountModel)
    private readonly accountModel: typeof AccountModel,
  ) {}

  async create(model: Partial<AccountModel>): Promise<AccountModel> {
    return this.accountModel.create(model);
  }

  async getBy(unqRef: AccountModelUniqRef): Promise<AccountModel> {
    const [key, value] = splitKeyAndValue(unqRef);

    return this.accountModel.findOne({
      where: {
        [key]: value,
      },
    });
  }

  async update(
    unqRef: AccountModelUniqRef,
    updModel: AccountUpdateModel,
  ): Promise<AccountModel> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.accountModel.update(updModel, { where: { [key]: value } });

      return this.accountModel.findOne({ where: { [key]: value } });
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: AccountModelUniqRef): Promise<'success' | 'fail'> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const account = await this.accountModel.findOne({
        where: { [key]: value },
      });

      if (account) {
        await account.destroy();
        return 'success';
      }

      return 'fail';
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }

  async softDelete(unqRef: AccountModelUniqRef): Promise<'success' | 'fail'> {
    try {
      await this.update(unqRef, { isDeleted: true });

      return 'success';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  getAll(): Promise<AccountModel[]> {
    return this.accountModel.findAll();
  }

  async getMany(
    pagination: PaginationProps,
  ): Promise<GetWithPaginationResult<AccountModel[]>> {
    const { rows, count } = await this.accountModel.findAndCountAll({
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      order: [['createdAt', pagination.order ?? 'DESC']],
    });

    return {
      data: rows,
      metadata: {
        limit: pagination.limit,
        page: pagination.page,
        total: count,
        order: pagination.order,
      },
    };
  }
}
