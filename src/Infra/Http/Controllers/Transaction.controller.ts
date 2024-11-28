import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PayloadType } from '@types';
import { Payload } from 'src/@shared/@decorators/payload.decorator';
import { JwtAuthGuard } from 'src/@shared/@guards/jwt-auth.guard';
import { TransferDto } from 'src/Application/UseCases/Transaction/Transfer/Transfer.dto';
import {
  TransferUseCase,
  TransferUseCaseResult,
} from 'src/Application/UseCases/Transaction/Transfer/Transfer.usecase';

@Controller({ path: 'movimentacoes', version: '1' })
export class TransactionController {
  constructor(private readonly transferUseCase: TransferUseCase) {}

  @Post('transferencia')
  @UseGuards(JwtAuthGuard)
  transfer(
    @Payload() payload: PayloadType,
    @Body() transferDto: TransferDto,
  ): Promise<TransferUseCaseResult> {
    const result = this.transferUseCase.execute(payload, transferDto);

    return result;
  }
}
