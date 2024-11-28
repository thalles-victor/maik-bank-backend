import { InjectModel } from '@nestjs/sequelize';
import { InternalServerErrorException } from '@nestjs/common';

import { PaginationProps, GetWithPaginationResult } from '@types';
import {
  TransactionAggregate,
  TransactionAggregateUnqRef,
  TransactionUpdateAggregate,
} from 'src/Domain/Aggregates/Transactions.aggregate';
import { ITransactionRepositoryContract } from 'src/Domain/Interfaces/Repositories/ITransaction.repository-contract';
import { splitKeyAndValue } from 'src/@shared/@utils/tools';

export class TransactionSequelizeRepository
  implements ITransactionRepositoryContract
{
  constructor(
    @InjectModel(TransactionAggregate)
    private readonly transactionModel: typeof TransactionAggregate,
  ) {}

  async create(
    model: Partial<TransactionAggregate>,
  ): Promise<TransactionAggregate> {
    return this.transactionModel.create(model);
  }

  async getBy(
    unqRef: TransactionAggregateUnqRef,
  ): Promise<TransactionAggregate> {
    const [key, value] = splitKeyAndValue(unqRef);

    return this.transactionModel.findOne({
      where: {
        [key]: value,
      },
    });
  }

  async update(
    unqRef: TransactionAggregateUnqRef,
    updModel: TransactionUpdateAggregate,
  ): Promise<TransactionAggregate> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      await this.transactionModel.update(updModel, { where: { [key]: value } });

      return this.transactionModel.findOne({ where: { [key]: value } });
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException();
    }
  }

  async delete(
    unqRef: TransactionAggregateUnqRef,
  ): Promise<'success' | 'fail'> {
    const [key, value] = splitKeyAndValue(unqRef);

    try {
      const transaction = await this.transactionModel.findOne({
        where: { [key]: value },
      });

      if (transaction) {
        await transaction.destroy();
        return 'success';
      }

      return 'fail';
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException();
    }
  }

  async softDelete(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unqRef: TransactionAggregateUnqRef,
  ): Promise<'success' | 'fail'> {
    // try {
    //   await this.update(unqRef, { isDeleted: true });
    //   return 'success';
    // } catch (error) {
    //   console.error(error);
    //   throw new InternalServerErrorException();
    // }
    throw new Error('Method not implemented');
  }

  getAll(): Promise<TransactionAggregate[]> {
    return this.transactionModel.findAll();
  }

  async getMany(
    pagination: PaginationProps,
  ): Promise<GetWithPaginationResult<TransactionAggregate[]>> {
    const { rows, count } = await this.transactionModel.findAndCountAll({
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
