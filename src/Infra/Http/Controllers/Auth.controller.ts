import { UserModel } from '#models';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, AuthResponse, PayloadType } from '@types';
import { env } from '@utils';
import { plainToInstance } from 'class-transformer';
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
  @HttpCode(201)
  async signUp(
    @Body() userDto: AuthSignUpDto,
  ): Promise<ApiResponse<AuthResponse>> {
    const result = await this.signUpUseCase.execute(userDto);

    const user = plainToInstance(UserModel, result.user.dataValues, {
      exposeUnsetFields: false,
    });

    return {
      data: { user: user, access_token: result.access_token },
      message: 'success',
      statusCode: 201,
      href: env.BACKEND_BASE_URL + env.BACKEND_PORT + '/v1/auth/current',
    };
  }

  @Post('/signIn')
  @HttpCode(200)
  async signIn(
    @Body() authDto: AuthSignInDto,
  ): Promise<ApiResponse<AuthResponse>> {
    const result = await this.signInUseCase.execute(authDto);

    const user = plainToInstance(UserModel, result.user.dataValues, {
      exposeUnsetFields: false,
    });

    return {
      data: {
        user: user,
        access_token: result.access_token,
      },
      message: 'success',
      statusCode: 200,
      href: env.BACKEND_BASE_URL + env.BACKEND_PORT + '/v1/auth/current',
    };
  }

  @Get('/current')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async current(
    @Payload() payload: PayloadType,
  ): Promise<ApiResponse<UserModel>> {
    const result = await this.currentUseCase.execute(payload);

    const user = plainToInstance(UserModel, result.dataValues, {
      exposeUnsetFields: false,
    });

    return {
      data: user,
      message: 'success',
      statusCode: 200,
    };
  }
}
