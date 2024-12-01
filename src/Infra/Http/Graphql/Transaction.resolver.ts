import { ROLE } from '@metadata';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PayloadType } from '@types';
import { Payload } from 'src/@shared/@decorators/payload.decorator';
import { RolesDecorator } from 'src/@shared/@decorators/role.decorator';
import { GqlJwtAuthGuard } from 'src/@shared/@guards/jwt-graphql.guard';
import { RoleGuard } from 'src/@shared/@guards/role.guard';
import { PaginationDto } from 'src/@shared/@Pagination';
import { SelfDepositDto } from 'src/Application/UseCases/Transaction/SelfDeposit/SelfDeposit.dto';
import { SelfDepositUseCase } from 'src/Application/UseCases/Transaction/SelfDeposit/SelfDeposit.usecase';
import { TransferDto } from 'src/Application/UseCases/Transaction/Transfer/Transfer.dto';
import { TransferUseCase } from 'src/Application/UseCases/Transaction/Transfer/Transfer.usecase';
import { DrawlDto } from 'src/Application/UseCases/Transaction/WithDrawl/Drawl.dto';
import { WithdrawalUseCase } from 'src/Application/UseCases/Transaction/WithDrawl/Drawl.usecase';
import {
  TransactionObjectTypeResponse,
  TransactionsObjectTypeResponse,
} from 'src/Domain/ObjectTypes/Transaction.object-type';
import { TransferObjectTypeResponse } from 'src/Domain/ObjectTypes/Transfer.object-type';
import { TransactionService } from 'src/Domain/Services/Transaction.service';

@Resolver()
export class TransactionResolver {
  constructor(
    private readonly transferUseCase: TransferUseCase,
    private readonly selfDepositUseCase: SelfDepositUseCase,
    private readonly drawlUseCase: WithdrawalUseCase,
    private readonly transactionService: TransactionService,
  ) {}

  @Mutation(() => TransferObjectTypeResponse)
  @UseGuards(GqlJwtAuthGuard)
  async transferToOtherAccount(
    @Payload() payload: PayloadType,
    @Args('transferDto') transferDto: TransferDto,
  ): Promise<TransferObjectTypeResponse> {
    const { transaction, pdfVoucherUrl } = await this.transferUseCase.execute(
      payload,
      transferDto,
    );

    return {
      data: transaction,
      message: 'success',
      statusCode: 200,
      href: pdfVoucherUrl,
    };
  }

  @Mutation(() => TransferObjectTypeResponse)
  @UseGuards(GqlJwtAuthGuard)
  async selfDeposit(
    @Payload() payload: PayloadType,
    @Args('depositDto') depositDto: SelfDepositDto,
  ): Promise<TransferObjectTypeResponse> {
    const { transaction, pdfVoucherUrl } =
      await this.selfDepositUseCase.execute(payload, depositDto);

    return {
      data: transaction,
      href: pdfVoucherUrl,
      message: 'success',
      statusCode: 200,
    };
  }

  @Mutation(() => TransactionObjectTypeResponse)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  async drawl(
    @Payload() payload: PayloadType,
    @Args('drawlDto') drawlDto: DrawlDto,
  ): Promise<TransactionObjectTypeResponse> {
    const { transaction, pdfVoucherUrl } = await this.drawlUseCase.execute(
      payload,
      drawlDto,
    );

    return {
      data: transaction,
      href: pdfVoucherUrl,
      message: 'success',
      statusCode: 200,
    };
  }

  @Query(() => TransactionsObjectTypeResponse)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN)
  async adminGetManyTransactions(
    @Args('pagination') paginationDto: PaginationDto,
  ): Promise<TransactionsObjectTypeResponse> {
    const { data, metadata } =
      await this.transactionService.getMany(paginationDto);

    return {
      message: 'success',
      statusCode: 200,
      data: data,
      meta: metadata,
    };
  }
}
