import { Mutation, Resolver } from '@nestjs/graphql';
import { AuthCurrent } from 'src/Application/UseCases/Auth/Current/Current.usecase';
import { AuthSignInUseCase } from 'src/Application/UseCases/Auth/Sign-in/SignIn.usecase';
import { AuthSignUpUseCase } from 'src/Application/UseCases/Auth/sign-up/SignUp.usecase';
import { ExampleResponse } from 'src/Domain/ObjectTypes/ApiResponse.object-type';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly signUpUseCase: AuthSignUpUseCase,
    private readonly signInUseCase: AuthSignInUseCase,
    private readonly currentUseCase: AuthCurrent,
  ) {}

  @Mutation(() => ExampleResponse)
  async signUp(): Promise<ExampleResponse> {
    return {
      message: 'hello',
      statusCode: 200,
      data: {
        id: 'asdfsdf',
        name: 'teste',
      },

      href: 'teste',
      meta: {
        order: 'DESC',
        page: 0,
        per_page: 10,
        total: 100,
      },
    };
  }
}
