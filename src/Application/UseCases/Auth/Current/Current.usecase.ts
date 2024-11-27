import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PayloadType, ThrowErrorMessage } from '@types';
import { UserService } from 'src/Domain/Services/User.service';

@Injectable()
export class AuthCurrent {
  constructor(private readonly userService: UserService) {}

  async execute(payload: PayloadType) {
    const user = await this.userService.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException({
        ptBr: 'usuário não cadastrado',
        enUs: 'user no registered',
      } as ThrowErrorMessage);
    }

    return {
      user: user,
    };
  }
}
