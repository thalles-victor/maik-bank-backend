import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PayloadType } from '@types';
import { Payload } from 'src/@shared/@decorators/payload.decorator';
import { JwtAuthGuard } from 'src/@shared/@guards/jwt-auth.guard';
import { AuthCurrent } from 'src/Application/UseCases/Auth/Current/Current.usecase';
import { AuthSignInDto } from 'src/Application/UseCases/Auth/Sign-in/SignIn.dto';
import { AuthSignInUseCase } from 'src/Application/UseCases/Auth/Sign-in/SignIn.usecase';
import { AuthSignUpDto } from 'src/Application/UseCases/Auth/sign-up/SignUp.dto';
import { AuthSignUpUseCase } from 'src/Application/UseCases/Auth/sign-up/SignUp.usecase';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly signUpUseCase: AuthSignUpUseCase,
    private readonly signInUseCase: AuthSignInUseCase,
    private readonly currentUseCase: AuthCurrent,
  ) {}

  @Post('/clientes')
  signUp(@Body() userDto: AuthSignUpDto) {
    return this.signUpUseCase.execute(userDto);
  }

  @Post('/signIn')
  signIn(@Body() authDto: AuthSignInDto) {
    return this.signInUseCase.execute(authDto);
  }

  @Get('/current')
  @UseGuards(JwtAuthGuard)
  current(@Payload() payload: PayloadType) {
    return this.currentUseCase.execute(payload);
  }
}
