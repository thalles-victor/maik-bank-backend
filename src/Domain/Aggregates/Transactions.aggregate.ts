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
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
@Table({ tableName: 'Transactions' })
export class TransactionAggregate extends Model {
  @Field(() => String)
  @Column({ primaryKey: true })
  id: string;

  @Field(() => String)
  @Column({
    type: DataType.STRING(15),
    allowNull: false,
    validate: {
      len: [1, 15],
    },
  })
  type: TypeOfTransaction;

  @Field(() => String)
  @Column({
    type: DataType.NUMBER(),
    allowNull: false,
  })
  value: number;

  @Field(() => String)
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  })
  @ForeignKey(() => AccountModel)
  accountTargetId: string;

  @Field(() => String, { nullable: true })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    validate: {
      len: [1, 50],
    },
  })
  @ForeignKey(() => AccountModel)
  accountSenderId: string | null;

  @Field(() => String, { nullable: true })
  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    validate: {
      len: [1, 20],
    },
    defaultValue: null,
  })
  description: string | null;

  @Field(() => String)
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Field(() => String)
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Field(() => String)
  @Column({
    type: DataType.STRING(15),
    allowNull: true,
    validate: {
      len: [1, 15],
    },
    defaultValue: null,
  })
  status: TransactionStatus;

  @HideField()
  @BelongsTo(() => AccountModel)
  accountTarget: AccountModel;

  @HideField()
  @BelongsTo(() => AccountModel)
  accountSender: AccountModel;
}

export type TransactionUpdateAggregate =
  | Pick<TransactionAggregate, 'status'>
  | Pick<TransactionAggregate, 'updatedAt'>;

export type TransactionAggregateUnqRef = Pick<TransactionAggregate, 'id'>;

export class TransactionWhereCondition {
  @Expose()
  id: string;
  @Expose()
  type: TypeOfTransaction;
  @Expose()
  value: number;
  @Expose()
  accountTargetId: string;
  @Expose()
  accountSenderId: string;
  @Expose()
  description: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
  @Expose()
  status: TransactionStatus;
  @Expose()
  accountTarget: AccountModel;
  @Expose()
  accountSender: AccountModel;
}
