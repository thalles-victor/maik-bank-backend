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
import { PayloadType, ThrowErrorMessage } from '@types';
import { Response } from 'express';
import { Payload } from 'src/@shared/@decorators/payload.decorator';
import { JwtAuthGuard } from 'src/@shared/@guards/jwt-auth.guard';
import { GetVoucherUseCase } from 'src/Application/UseCases/Transaction/GetVoucher/GetVoucher.usecase';
import { TransferDto } from 'src/Application/UseCases/Transaction/Transfer/Transfer.dto';
import {
  TransferUseCase,
  TransferUseCaseResult,
} from 'src/Application/UseCases/Transaction/Transfer/Transfer.usecase';

@Controller({ path: 'movimentacoes', version: '1' })
export class TransactionController {
  constructor(
    private readonly transferUseCase: TransferUseCase,
    private readonly getVoucherUseCase: GetVoucherUseCase,
  ) {}

  @Post('transferencia')
  @UseGuards(JwtAuthGuard)
  transfer(
    @Payload() payload: PayloadType,
    @Body() transferDto: TransferDto,
  ): Promise<TransferUseCaseResult> {
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
}
