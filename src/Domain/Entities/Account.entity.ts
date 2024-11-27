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

@Table({ tableName: 'Accounts' })
export class AccountModel extends Model {
  @Column({ primaryKey: true })
  id: string;

  @Column({
    type: DataType.STRING(70),
    allowNull: false,
    validate: {
      len: [1, 70],
    },
  })
  name: string;

  @Column({
    type: DataType.NUMBER(),
    defaultValue: 0,
  })
  balance: number;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    validate: {
      len: [1, 10],
    },
    defaultValue: ACCOUNT_STATUS.ACTIVE,
  })
  status: ACCOUNT_STATUS;

  @ForeignKey(() => UserModel)
  userId: string;

  @BelongsTo(() => UserModel)
  user: UserModel;
}
