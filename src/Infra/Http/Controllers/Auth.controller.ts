import { Body, Controller, Post } from '@nestjs/common';
import { AuthSignUpDto } from 'src/Application/UseCases/Auth/sign-up/SignUp.dto';
import { AuthSignUpUseCase } from 'src/Application/UseCases/Auth/sign-up/SignUp.usecase';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly signUpUseCase: AuthSignUpUseCase) {}

  @Post('/clientes')
  signUp(@Body() userDto: AuthSignUpDto) {
    return this.signUpUseCase.execute(userDto);
  }
}
