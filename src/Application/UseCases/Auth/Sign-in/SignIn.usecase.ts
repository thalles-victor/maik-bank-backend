import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/Domain/Services/User.service';
import { AuthSignInDto } from './SignIn.dto';
import { AuthResponse, PayloadType, ThrowErrorMessage } from '@types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { checkAdminCredentials, isAdmin } from '@utils';
import { ROLE } from '@metadata';

@Injectable()
export class AuthSignInUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(userDto: AuthSignInDto): Promise<AuthResponse> {
    const user = await this.userService.getBy({ email: userDto.email });

    if (!user) {
      throw new UnauthorizedException({
        ptBr: 'usuário não cadastrado',
        enUs: 'user not registered',
      } as ThrowErrorMessage);
    }
    const admin = isAdmin(userDto.email);

    if (!admin) {
      const passwordMatch = await bcrypt.compare(
        userDto.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new UnauthorizedException({
          ptBr: 'a senha está incorreta',
          enUs: 'incorrect password',
        } as ThrowErrorMessage);
      }
    }

    if (admin) {
      const checkCredentials = checkAdminCredentials(
        userDto.email,
        userDto.password,
      );

      if (!checkCredentials) {
        // Manda uma menssagem fake para enganar se tentar fazer um ataque
        throw new UnauthorizedException({
          ptBr: 'usuário não encontrado',
          enUs: 'user not found',
          'PROPOSITAL!!!!':
            'Manda uma menssagem fake de erro para enganar um atacante. Isso se chama error obfuscation',
        } as ThrowErrorMessage);
      }
    }

    const payload: PayloadType = {
      sub: user.id,
      isBanned: user.isBanned,
      isDeleted: user.isDeleted,
      roles: admin ? [ROLE.ADMIN] : [user.role],
    };

    const token = await this.jwtService.sign(payload);

    return {
      user: user,
      access_token: token,
    };
  }
}
