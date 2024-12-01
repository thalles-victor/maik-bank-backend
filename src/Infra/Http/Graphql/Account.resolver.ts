import { ROLE } from '@metadata';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PayloadType } from '@types';
import { Payload } from 'src/@shared/@decorators/payload.decorator';
import { RolesDecorator } from 'src/@shared/@decorators/role.decorator';
import { GqlJwtAuthGuard } from 'src/@shared/@guards/jwt-graphql.guard';
import { RoleGuard } from 'src/@shared/@guards/role.guard';
import { PaginationDto } from 'src/@shared/@Pagination';
import { CreateAccountDto } from 'src/Application/UseCases/Account/Create/CreateAccount.dto';
import { CreateAccountUseCase } from 'src/Application/UseCases/Account/Create/CreateAccount.usecase';
import { GetManyAccountUseCase } from 'src/Application/UseCases/Account/GetMany/GetManyAccount.usecase';
import { GetAccountInformationUseCase } from 'src/Application/UseCases/Account/Informations/Informations.usecase';
import {
  AccountInformationObjectTypeResponse,
  AccountListObjectTypeResponse,
  AccountObjectTypeResponse,
} from 'src/Domain/ObjectTypes/Account.object-type';

@Resolver()
export class AccountResolver {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly getManyAccountByCurrent: GetManyAccountUseCase,
    private readonly getAccountInformation: GetAccountInformationUseCase,
  ) {}

  @Mutation(() => AccountObjectTypeResponse)
  @UseGuards(GqlJwtAuthGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  async createBankAccount(
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
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  async getManyAccountByCurrentAuth(
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

  @Query(() => AccountInformationObjectTypeResponse)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  async getAccountInformationWithTransaction(
    @Payload() payload: PayloadType,
    @Args('accountId') accountId: string,
    @Args('transactionPaginationDto')
    transactionPaginationDto: PaginationDto,
  ): Promise<AccountInformationObjectTypeResponse> {
    if (accountId.length === 0) {
      throw new BadRequestException('require accountId');
    }
    console.log(transactionPaginationDto.filters);

    const { account, transactions } = await this.getAccountInformation.execute(
      payload,
      {
        accountId,
        transactionPagination: transactionPaginationDto,
      },
    );

    return {
      data: {
        account,
        transactions: {
          data: transactions.data,
          metadata: transactions.metadata,
        },
      },
      message: 'success',
      statusCode: 200,
    };
  }
}
