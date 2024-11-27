import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PayloadType } from '@types';
import { Payload } from 'src/@shared/@decorators/payload.decorator';
import { JwtAuthGuard } from 'src/@shared/@guards/jwt-auth.guard';
import { CreateAccountDto } from 'src/Application/UseCases/Account/Create/CreateAccount.dto';
import { CreateAccountUseCase } from 'src/Application/UseCases/Account/Create/CreateAccount.usecase';
import { SelfDepositDto } from 'src/Application/UseCases/Account/SelfDeposit/SelfDeposit.dto';
import { SelfDepositUseCase } from 'src/Application/UseCases/Account/SelfDeposit/SelfDeposit.usecase';

@Controller({ path: 'account', version: '1' })
export class AccountController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly selfDepositUseCase: SelfDepositUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Payload() payload: PayloadType,
    @Body() accountDto: CreateAccountDto,
  ) {
    return this.createAccountUseCase.execute(payload, accountDto);
  }

  @Post('/self-deposit')
  @UseGuards(JwtAuthGuard)
  selfDeposit(
    @Payload() payload: PayloadType,
    @Body() depositDto: SelfDepositDto,
  ) {
    return this.selfDepositUseCase.execute(payload, depositDto);
  }
}
