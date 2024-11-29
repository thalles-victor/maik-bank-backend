import { UserModel } from '#models';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { env } from 'process';
import { AuthCurrent } from 'src/Application/UseCases/Auth/Current/Current.usecase';
import { AuthSignInUseCase } from 'src/Application/UseCases/Auth/Sign-in/SignIn.usecase';
import { AuthSignUpDto } from 'src/Application/UseCases/Auth/sign-up/SignUp.dto';
import { AuthSignUpUseCase } from 'src/Application/UseCases/Auth/sign-up/SignUp.usecase';
import { AuthObjectTypeResponse } from 'src/Domain/ObjectTypes/Auth.object-type';

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
}
