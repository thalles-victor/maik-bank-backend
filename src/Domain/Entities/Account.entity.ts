import {
  BelongsTo,
  Column,
  DataType,
  Table,
  Model,
  ForeignKey,
} from 'sequelize-typescript';
import { ACCOUNT_STATUS } from '@metadata';
import { UserModel } from './User.model';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
@Table({ tableName: 'Accounts' })
export class AccountModel extends Model {
  @Expose()
  @Column({ primaryKey: true })
  @Field(() => String)
  id: string;

  @Expose()
  @Column({
    type: DataType.STRING(70),
    allowNull: false,
    validate: {
      len: [1, 70],
    },
  })
  @Field(() => String)
  name: string;

  @Expose()
  @Column({
    type: DataType.NUMBER(),
    defaultValue: 0,
  })
  @Field(() => Number)
  balance: number;

  @Expose()
  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    validate: {
      len: [1, 10],
    },
    defaultValue: ACCOUNT_STATUS.ACTIVE,
  })
  @Field(() => String)
  status: ACCOUNT_STATUS;

  @Expose()
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  @Field(() => Boolean)
  isDeleted: boolean;

  @Expose()
  @Column({ type: DataType.DATE })
  @Field(() => String)
  createdAt: Date;

  @Expose()
  @Column({ type: DataType.DATE })
  @Field(() => String)
  updatedAt: Date;

  @Expose()
  @ForeignKey(() => UserModel)
  @Field(() => String)
  userId: string;

  @BelongsTo(() => UserModel)
  @HideField()
  user: UserModel;
}

export type AccountUpdateModel =
  | Pick<AccountModel, 'name'>
  | Pick<AccountModel, 'balance'>
  | Pick<AccountModel, 'status'>
  | Pick<AccountModel, 'updatedAt'>
  | Pick<AccountModel, 'isDeleted'>;

export type AccountModelUniqRef = Pick<AccountModel, 'id'>;

export class AccountModelWhereConditions {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  balance: number;
  @Expose()
  status: ACCOUNT_STATUS;
  @Expose()
  isDeleted: boolean;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
  @Expose()
  userId: string;
}
