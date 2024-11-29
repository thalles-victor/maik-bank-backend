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

@ObjectType()
@Table({ tableName: 'Accounts' })
export class AccountModel extends Model {
  @Column({ primaryKey: true })
  @Field(() => String)
  id: string;

  @Column({
    type: DataType.STRING(70),
    allowNull: false,
    validate: {
      len: [1, 70],
    },
  })
  @Field(() => String)
  name: string;

  @Column({
    type: DataType.NUMBER(),
    defaultValue: 0,
  })
  @Field(() => Number)
  balance: number;

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

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  @Field(() => Boolean)
  isDeleted: boolean;

  @Column({ type: DataType.DATE })
  @Field(() => String)
  createdAt: Date;

  @Column({ type: DataType.DATE })
  @Field(() => String)
  updatedAt: Date;

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
  | Pick<AccountModel, 'isDeleted'>;

export type AccountModelUniqRef = Pick<AccountModel, 'id'>;
