import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PayloadType } from '@types';
import { Payload } from 'src/@shared/@decorators/payload.decorator';
import { GqlJwtAuthGuard } from 'src/@shared/@guards/jwt-graphql.guard';
import { CreateAccountDto } from 'src/Application/UseCases/Account/Create/CreateAccount.dto';
import { CreateAccountUseCase } from 'src/Application/UseCases/Account/Create/CreateAccount.usecase';
import { AccountObjectTypeResponse } from 'src/Domain/ObjectTypes/Account.object-type';

@Resolver()
export class AccountResolver {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase) {}

  @Mutation(() => AccountObjectTypeResponse)
  @UseGuards(GqlJwtAuthGuard)
  async createAccount(
    @Payload() payload: PayloadType,
    @Args('accountDto') accountDto: CreateAccountDto,
  ): Promise<AccountObjectTypeResponse> {
    const result = await this.createAccountUseCase.execute(payload, accountDto);

    return {
      message: 'success',
      statusCode: 201,
      data: result,
      href: 'LEMBRAR DE IMPLEMENTAR',
      meta: null,
    };
  }

  CRIAR MÉTODO PARA PEGAR OS DADOS DA CONTA
}
