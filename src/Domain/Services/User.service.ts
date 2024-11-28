import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ThrowErrorMessage } from '@types';
import { UserModel, UserModelUniqRef } from '#models';
import { uuid } from '@utils';
import * as bcrypt from 'bcrypt';
import { KEY_OF_INJECTION } from '@metadata';
import { IUserRepositoryContract } from '../Interfaces/Repositories/IUser.repository-contract';
import { AuthSignUpDto } from 'src/Application/UseCases/Auth/sign-up/SignUp.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(KEY_OF_INJECTION.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryContract,
  ) {}

  async create(userDto: AuthSignUpDto) {
    const userExist = await this.userRepository.getBy({ email: userDto.email });

    if (userExist) {
      throw new UnauthorizedException({
        ptBr: 'esse email em uso',
        enUs: 'this email in used',
      } as ThrowErrorMessage);
    }

    const hashedPassword = await bcrypt.hash(
      userDto.password,
      await bcrypt.genSalt(12),
    );

    const newUser = Object.assign(new UserModel().dataValues, {
      id: uuid('v4'),
      name: userDto.name,
      email: userDto.email,
      password: hashedPassword,
      avatar: '    ',
      isBanned: false,
      isDeleted: false,
      dateBirth: userDto.dateBirth,
    } as UserModel);

    const userCreated = await this.userRepository.create(newUser);

    return userCreated;
  }

  async getBy(userUnqRef: UserModelUniqRef) {
    const user = await this.userRepository.getBy(userUnqRef);

    return user ?? null;
  }
}
