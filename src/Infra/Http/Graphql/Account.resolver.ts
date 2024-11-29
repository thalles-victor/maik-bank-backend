import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PayloadType } from '@types';
import { Payload } from 'src/@shared/@decorators/payload.decorator';
import { GqlJwtAuthGuard } from 'src/@shared/@guards/jwt-graphql.guard';
import { PaginationDto } from 'src/@shared/@Pagination';
import { CreateAccountDto } from 'src/Application/UseCases/Account/Create/CreateAccount.dto';
import { CreateAccountUseCase } from 'src/Application/UseCases/Account/Create/CreateAccount.usecase';
import { GetManyAccountUseCase } from 'src/Application/UseCases/Account/GetMany/GetManyAccount.usecase';
import {
  AccountListObjectTypeResponse,
  AccountObjectTypeResponse,
} from 'src/Domain/ObjectTypes/Account.object-type';

@Resolver()
export class AccountResolver {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly getManyAccountByCurrent: GetManyAccountUseCase,
  ) {}

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

  @Query(() => AccountListObjectTypeResponse)
  @UseGuards(GqlJwtAuthGuard)
  async getManyByCurrent(
    @Payload() payload: PayloadType,
    @Args('paginationDto') pagination: PaginationDto,
  ): Promise<AccountListObjectTypeResponse> {
    const { data, metadata } = await this.getManyAccountByCurrent.execute(
      payload,
      pagination,
    );

    return {
      data: data,
      message: 'success',
      statusCode: 200,
      meta: {
        ...metadata,
      },
    };
  }
}
