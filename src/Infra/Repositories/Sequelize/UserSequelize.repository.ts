import {
  UserModel,
  UserModelUniqRef,
  UserUpdateModel,
} from 'src/Domain/Entities';
import { GetWithPaginationResult, PaginationProps } from '@types';
import { IUserRepositoryContract } from 'src/Domain/Interfaces/Repositories/IUser.repository-contract';
import { InjectModel } from '@nestjs/sequelize';
import { splitKeyAndValue } from 'src/@shared/@utils/tools';
import { InternalServerErrorException } from '@nestjs/common';

export class UserSequelizeRepository implements IUserRepositoryContract {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
  ) {}

  async create(model: Partial<UserModel>): Promise<UserModel> {
    return this.userModel.create(model);
  }

  async getBy(unqRef: UserModelUniqRef): Promise<UserModel> {
    const [key, value] = splitKeyAndValue(unqRef);

    return this.userModel.findOne({
      where: {
        [key]: value,
      },
    });
  }

  async update(
    unqRef: UserModelUniqRef,
    updModel: UserUpdateModel,
  ): Promise<UserModel> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.userModel.update(updModel, { where: { [key]: value } });

      return this.userModel.findOne({ [key]: value });
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }

  async delete(unqRef: UserModelUniqRef): Promise<'success' | 'fail'> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const user = await this.userModel.findOne({ [key]: value });

      user.destroy();

      return 'success';
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }

  async softDelete(unqRef: UserModelUniqRef): Promise<'success' | 'fail'> {
    try {
      await this.update(unqRef, { isDeleted: true });

      return 'success';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  getAll(): Promise<UserModel[]> {
    return this.userModel.findAll();
  }

  async getMany(
    pagination: PaginationProps,
  ): Promise<GetWithPaginationResult<UserModel[]>> {
    const { rows, count } = await this.userModel.findAndCountAll({
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
