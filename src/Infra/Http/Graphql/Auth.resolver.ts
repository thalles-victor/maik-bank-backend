import { UserModel } from '#models';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PayloadType } from '@types';
import { plainToInstance } from 'class-transformer';
import { env } from 'process';
import { Payload } from 'src/@shared/@decorators/payload.decorator';
import { GqlJwtAuthGuard } from 'src/@shared/@guards/jwt-graphql.guard';
import { AuthCurrent } from 'src/Application/UseCases/Auth/Current/Current.usecase';
import { AuthSignInDto } from 'src/Application/UseCases/Auth/Sign-in/SignIn.dto';
import { AuthSignInUseCase } from 'src/Application/UseCases/Auth/Sign-in/SignIn.usecase';
import { AuthSignUpDto } from 'src/Application/UseCases/Auth/sign-up/SignUp.dto';
import { AuthSignUpUseCase } from 'src/Application/UseCases/Auth/sign-up/SignUp.usecase';
import { AuthObjectTypeResponse } from 'src/Domain/ObjectTypes/Auth.object-type';
import { UserObjectTypeResponse } from 'src/Domain/ObjectTypes/User.object-type';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly signUpUseCase: AuthSignUpUseCase,
    private readonly signInUseCase: AuthSignInUseCase,
    private readonly currentUseCase: AuthCurrent,
  ) {}

  @Mutation(() => AuthObjectTypeResponse)
  async signUp(
    @Args('authDto') authDto: AuthSignUpDto,
  ): Promise<AuthObjectTypeResponse> {
    const result = await this.signUpUseCase.execute(authDto);

    const sanitizedUser = plainToInstance(UserModel, result.user.dataValues, {
      exposeUnsetFields: false,
    });

    return {
      data: {
        user: sanitizedUser,
        access_token: result.access_token,
      },
      message: 'success',
      statusCode: 201,
      href: env.BACKEND_BASE_URL + env.BACKEND_PORT + '/v1/auth/current',
      meta: null,
    };
  }

  @Mutation(() => AuthObjectTypeResponse)
  async signIn(
    @Args('signInDto') signInDto: AuthSignInDto,
  ): Promise<AuthObjectTypeResponse> {
    const result = await this.signInUseCase.execute(signInDto);

    const sanitizedUser = plainToInstance(UserModel, result.user.dataValues, {
      exposeUnsetFields: false,
    });

    return {
      data: {
        user: sanitizedUser,
        access_token: result.access_token,
      },
      message: 'success',
      statusCode: 200,
      href: env.BACKEND_BASE_URL + env.BACKEND_PORT + '/v1/auth/current',
      meta: null,
    };
  }

  @Query(() => UserObjectTypeResponse)
  @UseGuards(GqlJwtAuthGuard)
  async current(
    @Payload() payload: PayloadType,
  ): Promise<UserObjectTypeResponse> {
    const result = await this.currentUseCase.execute(payload);

    const sanitizedUser = plainToInstance(UserModel, result.dataValues, {
      exposeUnsetFields: false,
    });

    return {
      message: 'success',
      statusCode: 200,
      data: sanitizedUser,
      href: env.BACKEND_BASE_URL + env.BACKEND_PORT + '/v1/auth/current',
      meta: null,
    };
  }
}
