import { ROLE } from '@metadata';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiResponse,
  PayloadType,
  ThrowErrorMessage,
  TransactionUseCaseResult,
} from '@types';
import { Response } from 'express';
import { Payload } from 'src/@shared/@decorators/payload.decorator';
import { RolesDecorator } from 'src/@shared/@decorators/role.decorator';
import { JwtAuthGuard } from 'src/@shared/@guards/jwt-auth.guard';
import { RoleGuard } from 'src/@shared/@guards/role.guard';
import { PaginationDto } from 'src/@shared/@Pagination';
import { GetVoucherUseCase } from 'src/Application/UseCases/Transaction/GetVoucher/GetVoucher.usecase';
import { SelfDepositDto } from 'src/Application/UseCases/Transaction/SelfDeposit/SelfDeposit.dto';
import { SelfDepositUseCase } from 'src/Application/UseCases/Transaction/SelfDeposit/SelfDeposit.usecase';
import { TransferDto } from 'src/Application/UseCases/Transaction/Transfer/Transfer.dto';
import { TransferUseCase } from 'src/Application/UseCases/Transaction/Transfer/Transfer.usecase';
import { DrawlDto } from 'src/Application/UseCases/Transaction/WithDrawl/Drawl.dto';
import { WithdrawalUseCase } from 'src/Application/UseCases/Transaction/WithDrawl/Drawl.usecase';
import { TransactionService } from 'src/Domain/Services/Transaction.service';
import { TransactionModule } from 'src/Modules/Transaction.module';

@Controller({ path: 'transaction', version: '1' })
export class TransactionController {
  constructor(
    // Services
    private readonly transactionsService: TransactionService,

    //Use Cases
    private readonly transferUseCase: TransferUseCase,
    private readonly getVoucherUseCase: GetVoucherUseCase,
    private readonly selfDepositUseCase: SelfDepositUseCase,
    private readonly drawlUseCase: WithdrawalUseCase,
  ) {}

  @Post('transfer')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  transfer(
    @Payload() payload: PayloadType,
    @Body() transferDto: TransferDto,
  ): Promise<TransactionUseCaseResult> {
    const result = this.transferUseCase.execute(payload, transferDto);

    return result;
  }

  @Get('voucher/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  async getVoucher(
    @Payload() payload: PayloadType,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const pdfStream = await this.getVoucherUseCase.execute(payload, id);

    return pdfStream.pipe(response).on('error', () => {
      throw new InternalServerErrorException({
        ptBr: 'erro interno no servidor',
        enUs: 'internal server error',
      } as ThrowErrorMessage);
    });
  }

  @Post('/self-deposit')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  selfDeposit(
    @Payload() payload: PayloadType,
    @Body() depositDto: SelfDepositDto,
  ) {
    return this.selfDepositUseCase.execute(payload, depositDto);
  }

  @Post('/drawl')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.USER, ROLE.ADMIN)
  async drawl(
    @Payload() payload: PayloadType,
    @Body() drawlDto: DrawlDto,
  ): Promise<ApiResponse<TransactionModule>> {
    const { transaction, pdfVoucherUrl } = await this.drawlUseCase.execute(
      payload,
      drawlDto,
    );

    return {
      data: transaction,
      message: 'success',
      statusCode: 200,
      href: pdfVoucherUrl,
    };
  }

  @Get('admin/many')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN)
  async getManyTransactions(@Query() pagination: PaginationDto) {
    const transactions = await this.transactionsService.getMany(pagination);

    return transactions;
  }
}
