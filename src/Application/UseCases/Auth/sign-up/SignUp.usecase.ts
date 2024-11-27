import { Injectable } from '@nestjs/common';
import { AuthSignUpDto } from './SignUp.dto';
import { UserService } from 'src/Domain/Services/User.service';

@Injectable()
export class AuthSignUpUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(userDto: AuthSignUpDto) {
    const userCreated = this.userService.create(userDto);

    return userCreated;
  }
}
