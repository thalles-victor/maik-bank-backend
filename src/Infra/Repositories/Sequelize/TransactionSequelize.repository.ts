import { InjectModel } from '@nestjs/sequelize';
import { InternalServerErrorException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

import { PaginationProps, GetWithPaginationResult } from '@types';
import {
  TransactionAggregate,
  TransactionAggregateUnqRef,
  TransactionUpdateAggregate,
} from 'src/Domain/Aggregates/Transactions.aggregate';
import {
  ITransactionRepositoryContract,
  TransferProps,
} from 'src/Domain/Interfaces/Repositories/ITransaction.repository-contract';
import { splitKeyAndValue } from 'src/@shared/@utils/tools';
import { AccountModel } from 'src/Domain/Entities/Account.entity';
import { AccountModule } from 'src/Modules/Account.module';
import { env } from '@utils';
import { UserModel } from '#models';
import { TransactionStatus } from '@metadata';

export class TransactionSequelizeRepository
  implements ITransactionRepositoryContract
{
  private readonly sequelize: Sequelize;

  constructor(
    @InjectModel(TransactionAggregate)
    private readonly transactionModel: typeof TransactionAggregate,
    @InjectModel(AccountModel)
    private readonly accountModel: typeof AccountModule,
  ) {
    this.sequelize = new Sequelize({
      dialect: 'postgres',
      host: env.POSTGRES_HOST,
      port: env.POSTGRES_PORT,
      username: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      database: env.POSTGRES_DB,
      models: [AccountModel, UserModel, transactionModel],
    });
  }

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

  async transfer(data: TransferProps): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      const senderAccount = await AccountModel.findOne({
        where: { id: data.senderId },
        transaction,
      });

      const receiverAccount = await AccountModel.findOne({
        where: { id: data.targetId },
        transaction,
      });

      if (!senderAccount || !receiverAccount) {
        throw new Error('Conta remetente ou destinatária não encontrada');
      }

      if (senderAccount.balance < data.value) {
        throw new Error('Saldo insuficiente na conta remetente');
      }

      senderAccount.balance -= data.value;
      receiverAccount.balance += data.value;

      await senderAccount.save({ transaction });
      await receiverAccount.save({ transaction });

      const bankTransaction = await this.getBy({
        id: data.transactionId,
      });

      const bankTransactionUpdated = await bankTransaction.update(
        {
          status: TransactionStatus.COMPLETED,
          updateAt: new Date(),
        },
        {
          transaction,
        },
      );

      await transaction.commit();
      return bankTransactionUpdated;
    } catch (error) {
      console.error(error);
      await transaction.rollback();
    }
  }
}
