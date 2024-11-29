import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PayloadType } from '@types';
import { Payload } from 'src/@shared/@decorators/payload.decorator';
import { GqlJwtAuthGuard } from 'src/@shared/@guards/jwt-graphql.guard';
import { GetVoucherUseCase } from 'src/Application/UseCases/Transaction/GetVoucher/GetVoucher.usecase';
import { SelfDepositDto } from 'src/Application/UseCases/Transaction/SelfDeposit/SelfDeposit.dto';
import { SelfDepositUseCase } from 'src/Application/UseCases/Transaction/SelfDeposit/SelfDeposit.usecase';
import { TransferDto } from 'src/Application/UseCases/Transaction/Transfer/Transfer.dto';
import { TransferUseCase } from 'src/Application/UseCases/Transaction/Transfer/Transfer.usecase';
import { TransferObjectTypeResponse } from 'src/Domain/ObjectTypes/Transfer.object-type';

@Resolver()
export class TransactionResolver {
  constructor(
    private readonly transferUseCase: TransferUseCase,
    private readonly getVoucherUseCase: GetVoucherUseCase,
    private readonly selfDepositUseCase: SelfDepositUseCase,
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
}
