import { Column, Table, Model, DataType } from 'sequelize-typescript';

@Table
export class UserModel extends Model {
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
    type: DataType.STRING(70),
    allowNull: false,
    validate: {
      len: [1, 70],
    },
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255],
    },
  })
  password: string;

  @Column({
    type: DataType.STRING(70),
    allowNull: true,
    validate: {
      len: [1, 255],
    },
    defaultValue: null,
  })
  avatar?: string;

  @Column({
    type: DataType.STRING(11),
    allowNull: true,
    validate: {
      len: [1, 10],
    },
    defaultValue: null,
  })
  dateBirth?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isBanned: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isDeleted: boolean;
}

export type UserUpdateModel =
  | Pick<UserModel, 'name'>
  | Pick<UserModel, 'avatar'>
  | Pick<UserModel, 'password'>
  | Pick<UserModel, 'isBanned'>
  | Pick<UserModel, 'isDeleted'>;

export type UserModelUniqRef = Pick<UserModel, 'id'> | Pick<UserModel, 'email'>;
