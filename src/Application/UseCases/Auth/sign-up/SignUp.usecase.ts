import { Injectable } from '@nestjs/common';
import { AuthSignUpDto } from './SignUp.dto';
import { UserService } from 'src/Domain/Services/User.service';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse, PayloadType } from '@types';

@Injectable()
export class AuthSignUpUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(userDto: AuthSignUpDto): Promise<AuthResponse> {
    const userCreated = await this.userService.create(userDto);

    //send email

    //generate token
    const token = await this.generateJwtToken({
      sub: userCreated.id,
      roles: [userCreated.role],
      isBanned: userCreated.isBanned,
      isDeleted: userCreated.isDeleted,
    });

    return {
      user: userCreated,
      access_token: token,
    };
  }

  private async generateJwtToken(payload: PayloadType) {
    return this.jwtService.sign(payload);
  }
}
