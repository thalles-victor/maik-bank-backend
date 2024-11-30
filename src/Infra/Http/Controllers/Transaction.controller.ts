import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
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
import { JwtAuthGuard } from 'src/@shared/@guards/jwt-auth.guard';
import { GetVoucherUseCase } from 'src/Application/UseCases/Transaction/GetVoucher/GetVoucher.usecase';
import { SelfDepositDto } from 'src/Application/UseCases/Transaction/SelfDeposit/SelfDeposit.dto';
import { SelfDepositUseCase } from 'src/Application/UseCases/Transaction/SelfDeposit/SelfDeposit.usecase';
import { TransferDto } from 'src/Application/UseCases/Transaction/Transfer/Transfer.dto';
import { TransferUseCase } from 'src/Application/UseCases/Transaction/Transfer/Transfer.usecase';
import { DrawlDto } from 'src/Application/UseCases/Transaction/WithDrawl/Drawl.dto';
import { WithdrawalUseCase } from 'src/Application/UseCases/Transaction/WithDrawl/Drawl.usecase';
import { TransactionModule } from 'src/Modules/Transaction.module';

@Controller({ path: 'transaction', version: '1' })
export class TransactionController {
  constructor(
    private readonly transferUseCase: TransferUseCase,
    private readonly getVoucherUseCase: GetVoucherUseCase,
    private readonly selfDepositUseCase: SelfDepositUseCase,
    private readonly drawlUseCase: WithdrawalUseCase,
  ) {}

  @Post('transferencia')
  @UseGuards(JwtAuthGuard)
  transfer(
    @Payload() payload: PayloadType,
    @Body() transferDto: TransferDto,
  ): Promise<TransactionUseCaseResult> {
    const result = this.transferUseCase.execute(payload, transferDto);

    return result;
  }

  @Get('voucher/:id')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  selfDeposit(
    @Payload() payload: PayloadType,
    @Body() depositDto: SelfDepositDto,
  ) {
    return this.selfDepositUseCase.execute(payload, depositDto);
  }

  @Post('/drawl')
  @UseGuards(JwtAuthGuard)
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
}
