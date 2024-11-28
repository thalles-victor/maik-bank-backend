import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AccountModel } from '../Entities/Account.entity';
import { TransactionStatus, TypeOfTransaction } from '@metadata';

@Table({ tableName: 'Transactions' })
export class TransactionAggregate extends Model {
  @Column({ primaryKey: true })
  id: string;

  @Column({
    type: DataType.STRING(15),
    allowNull: false,
    validate: {
      len: [1, 15],
    },
  })
  type: TypeOfTransaction;

  @Column({
    type: DataType.NUMBER(),
    allowNull: false,
  })
  value: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  })
  @ForeignKey(() => AccountModel)
  accountTargetId: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  })
  @ForeignKey(() => AccountModel)
  accountSenderId: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    validate: {
      len: [1, 20],
    },
    defaultValue: null,
  })
  description: string | null;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Column({
    type: DataType.STRING(15),
    allowNull: true,
    validate: {
      len: [1, 15],
    },
    defaultValue: null,
  })
  status: TransactionStatus;

  @BelongsTo(() => AccountModel)
  accountTarget: AccountModel;

  @BelongsTo(() => AccountModel)
  accountSender: AccountModel;
}

export type TransactionUpdateAggregate = Pick<TransactionAggregate, 'status'>;

export type TransactionAggregateUnqRef = Pick<TransactionAggregate, 'id'>;
