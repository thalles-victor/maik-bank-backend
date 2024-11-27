import { Body, Controller, Post } from '@nestjs/common';
import { AuthSignInDto } from 'src/Application/UseCases/Auth/Sign-in/SignIn.dto';
import { AuthSignInUseCase } from 'src/Application/UseCases/Auth/Sign-in/SignIn.usecase';
import { AuthSignUpDto } from 'src/Application/UseCases/Auth/sign-up/SignUp.dto';
import { AuthSignUpUseCase } from 'src/Application/UseCases/Auth/sign-up/SignUp.usecase';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly signUpUseCase: AuthSignUpUseCase,
    private readonly signInUseCase: AuthSignInUseCase,
  ) {}

  @Post('/clientes')
  signUp(@Body() userDto: AuthSignUpDto) {
    return this.signUpUseCase.execute(userDto);
  }

  @Post('/signIn')
  signIn(@Body() authDto: AuthSignInDto) {
    return this.signInUseCase.execute(authDto);
  }
}
