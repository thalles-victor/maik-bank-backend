import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/Domain/Services/User.service';
import { AuthSignInDto } from './SignIn.dto';
import { PayloadType, ThrowErrorMessage } from '@types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthSignInUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(userDto: AuthSignInDto) {
    const user = await this.userService.getBy({ email: userDto.email });

    if (!user) {
      throw new UnauthorizedException({
        ptBr: 'usuário não cadastrado',
        enUs: 'user not registered',
      } as ThrowErrorMessage);
    }

    const passwordMatch = await bcrypt.compare(userDto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException({
        ptBr: 'a senha está incorreta',
        enUs: 'incorrect password',
      } as ThrowErrorMessage);
    }

    const payload: PayloadType = {
      sub: user.id,
      isBanned: user.isBanned,
      isDeleted: user.isDeleted,
      roles: [user.role],
    };

    const token = await this.jwtService.sign(payload);

    return {
      user: user,
      access_token: token,
    };
  }
}
