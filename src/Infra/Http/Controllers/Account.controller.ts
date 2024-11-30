import { ROLE } from '@metadata';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, PayloadType } from '@types';
import { Payload } from 'src/@shared/@decorators/payload.decorator';
import { RolesDecorator } from 'src/@shared/@decorators/role.decorator';
import { JwtAuthGuard } from 'src/@shared/@guards/jwt-auth.guard';
import { RoleGuard } from 'src/@shared/@guards/role.guard';
import { PaginationDto } from 'src/@shared/@Pagination';
import { CreateAccountDto } from 'src/Application/UseCases/Account/Create/CreateAccount.dto';
import { CreateAccountUseCase } from 'src/Application/UseCases/Account/Create/CreateAccount.usecase';
import { GetManyAccountUseCase } from 'src/Application/UseCases/Account/GetMany/GetManyAccount.usecase';
import { GetAccountInformationUseCase } from 'src/Application/UseCases/Account/Informations/Informations.usecase';
import { UpdateAccountDto } from 'src/Application/UseCases/Account/UpdateStatus/UpdateAccount.dto';
import { UpdateAccountUseCase } from 'src/Application/UseCases/Account/UpdateStatus/UpdateAccount.usecase';
import { AccountModel } from 'src/Domain/Entities/Account.entity';

@Controller({ path: 'account', version: '1' })
export class AccountController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly getManyAccountByCurrent: GetManyAccountUseCase,
    private readonly getAccountInformation: GetAccountInformationUseCase,
    private readonly updateAccountUseCase: UpdateAccountUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  create(
    @Payload() payload: PayloadType,
    @Body() accountDto: CreateAccountDto,
  ) {
    return this.createAccountUseCase.execute(payload, accountDto);
  }

  @Get('admin/many')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN)
  async getManyByCurrent(
    @Payload() payload: PayloadType,
    @Query() pagination: PaginationDto,
  ): Promise<ApiResponse<AccountModel[]>> {
    const { data, metadata } = await this.getManyAccountByCurrent.execute(
      payload,
      pagination,
    );

    return {
      data: data,
      message: 'success',
      statusCode: 200,
      meta: {
        page: metadata.page,
        limit: metadata.limit,
        order: metadata.order,
      },
    };
  }
  @Get('/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  getInformation(
    @Payload() payload: PayloadType,
    @Param('id') id: string,
    @Query() transactionPagination: PaginationDto,
  ) {
    return this.getAccountInformation.execute(payload, {
      accountId: id,
      transactionPagination,
    });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN, ROLE.USER)
  async updateAccount(
    @Payload() payload: PayloadType,
    @Body() accountDto: UpdateAccountDto,
    @Param('id') id: string,
  ): Promise<ApiResponse<AccountModel>> {
    const result = await this.updateAccountUseCase.execute(
      payload,
      accountDto,
      id,
    );

    return {
      data: result,
      message: 'updated successfully',
      statusCode: 200,
    };
  }
}
