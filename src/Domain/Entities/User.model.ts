import { Column, Table, Model, DataType, HasMany } from 'sequelize-typescript';
import { ROLE } from '@metadata';
import { AccountModel } from './Account.entity';
import { Exclude } from 'class-transformer';
import { Field, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Table({ tableName: 'Users' })
export class UserModel extends Model {
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
    type: DataType.STRING(70),
    allowNull: false,
    validate: {
      len: [1, 70],
    },
  })
  @Field(() => String)
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255],
    },
  })
  @Exclude()
  @HideField()
  password: string;

  @Column({
    type: DataType.STRING(70),
    allowNull: true,
    validate: {
      len: [1, 255],
    },
    defaultValue: null,
  })
  @Field(() => String, { nullable: true })
  avatar?: string;

  @Column({
    type: DataType.STRING(11),
    allowNull: false,
    validate: {
      len: [1, 10],
    },
  })
  @Field(() => String)
  dateBirth: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    validate: {
      len: [1, 10],
    },
    defaultValue: ROLE.USER,
  })
  @Field(() => String)
  role: ROLE;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  @Field(() => Boolean)
  isBanned: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  @Field(() => Boolean)
  isDeleted: boolean;

  @Column({ type: DataType.DATE })
  @Field(() => String)
  createdAt: string;

  @Column({ type: DataType.DATE })
  @Field(() => String)
  updatedAt: string;

  @HasMany(() => AccountModel)
  accounts: AccountModel[];
}

export type UserUpdateModel =
  | Pick<UserModel, 'name'>
  | Pick<UserModel, 'avatar'>
  | Pick<UserModel, 'password'>
  | Pick<UserModel, 'isBanned'>
  | Pick<UserModel, 'isDeleted'>;

export type UserModelUniqRef = Pick<UserModel, 'id'> | Pick<UserModel, 'email'>;
