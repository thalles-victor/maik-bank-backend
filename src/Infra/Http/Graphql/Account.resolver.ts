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
import { GetSelfAccountsUseCase } from 'src/Application/UseCases/Account/GetSelfAccounts/GetSelfAccounts.usecase';
import { GetAccountInformationUseCase } from 'src/Application/UseCases/Account/Informations/Informations.usecase';
import { UpdateAccountDto } from 'src/Application/UseCases/Account/UpdateStatus/UpdateAccount.dto';
import { UpdateAccountUseCase } from 'src/Application/UseCases/Account/UpdateStatus/UpdateAccount.usecase';

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
    private readonly updateAccountUseCase: UpdateAccountUseCase,
    private readonly getAccountInformation: GetAccountInformationUseCase,
    private readonly getSelfAccountsUseCase: GetSelfAccountsUseCase,
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
  @RolesDecorator(ROLE.ADMIN)
  async getManyAccountAsAdmin(
    @Args('paginationDto') pagination: PaginationDto,
  ): Promise<AccountListObjectTypeResponse> {
    const { data, metadata } =
      await this.getManyAccountByCurrent.execute(pagination);

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

  @Mutation(() => AccountObjectTypeResponse)
  async updateSelfBankAccount(
    @Payload() payload: PayloadType,
    @Args('accountId') accountId: string,
    @Args('accountDto') accountDto: UpdateAccountDto,
  ): Promise<AccountObjectTypeResponse> {
    if (accountId.length <= 0) {
      throw new BadRequestException('require account id');
    }

    const result = await this.updateAccountUseCase.execute(
      payload,
      accountDto,
      accountId,
    );

    return {
      data: result,
      message: 'update successfully',
      statusCode: 200,
    };
  }

  @Query(() => AccountListObjectTypeResponse)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  async getSelfAccounts(
    @Payload() payload: PayloadType,
    @Args('pagination') paginationDto: PaginationDto,
  ): Promise<AccountListObjectTypeResponse> {
    const { data, metadata } = await this.getSelfAccountsUseCase.execute(
      payload,
      paginationDto,
    );

    return {
      data: data,
      message: 'success',
      statusCode: 200,
      meta: metadata,
    };
  }
}
