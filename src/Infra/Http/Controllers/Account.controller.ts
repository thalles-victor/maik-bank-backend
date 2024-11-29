import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PayloadType } from '@types';
import { Payload } from 'src/@shared/@decorators/payload.decorator';
import { JwtAuthGuard } from 'src/@shared/@guards/jwt-auth.guard';
import { CreateAccountDto } from 'src/Application/UseCases/Account/Create/CreateAccount.dto';
import { CreateAccountUseCase } from 'src/Application/UseCases/Account/Create/CreateAccount.usecase';

@Controller({ path: 'account', version: '1' })
export class AccountController {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Payload() payload: PayloadType,
    @Body() accountDto: CreateAccountDto,
  ) {
    return this.createAccountUseCase.execute(payload, accountDto);
  }
}
