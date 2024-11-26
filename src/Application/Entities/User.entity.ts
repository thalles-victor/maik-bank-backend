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
    type: DataType.STRING(40),
    allowNull: false,
    validate: {
      len: [1, 40],
    },
  })
  username: string;

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

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isBanned: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isDeleted: boolean;
}

export class UserUpdateModel {
  name: Pick<UserModel, 'name'>;
  avatar: Pick<UserModel, 'avatar'>;
  password: Pick<UserModel, 'password'>;
  isBanned: Pick<UserModel, 'isBanned'>;
  isDeleted: Pick<UserModel, 'isDeleted'>;
}

export type UserModelUniqRef =
  | Pick<UserModel, 'id'>
  | Pick<UserModel, 'username'>
  | Pick<UserModel, 'email'>;
