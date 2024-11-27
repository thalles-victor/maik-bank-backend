import { KEY_OF_INJECTION } from '@metadata';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepositoryContract } from 'src/Domain/Interfaces/Repositories/IUser.repository-contract';
import { AuthSignUpDto } from './SignUp.dto';
import { ThrowErrorMessage } from '@types';
import { UserModel } from '#models';
import { idGenerator } from '@utils';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthSignUpUseCase {
  constructor(
    @Inject(KEY_OF_INJECTION.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryContract,
  ) {}

  async execute(userDto: AuthSignUpDto) {
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

    const newUser = Object.assign(new UserModel(), {
      id: idGenerator.shortOly,
      name: userDto.name,
      email: userDto.email,
      password: hashedPassword,
      avatar: '    ',
      isBanned: false,
      isDeleted: false,
      dateBirth: userDto.dateBirth,
    } as UserModel);

    console.log('Hei', newUser);

    // const userCreated = await this.userRepository.create(newUser);

    return newUser;
  }
}
