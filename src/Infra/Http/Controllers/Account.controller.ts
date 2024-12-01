import { ROLE } from '@metadata';
import {
  Body,
  Controller,
  Delete,
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
import {
  GetAccountInformationUseCase,
  GetAccountInformationUseCaseResult,
} from 'src/Application/UseCases/Account/Informations/Informations.usecase';
import { SoftDeleteAccountUseCase } from 'src/Application/UseCases/Account/SoftDelete/SoftDeleteAccount.usecase';
import { UpdateAccountDto } from 'src/Application/UseCases/Account/UpdateStatus/UpdateAccount.dto';
import { UpdateAccountUseCase } from 'src/Application/UseCases/Account/UpdateStatus/UpdateAccount.usecase';
import { AccountModel } from 'src/Domain/Entities/Account.entity';

@Controller({ path: 'account', version: '1' })
export class AccountController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly getManyAccount: GetManyAccountUseCase,
    private readonly getAccountInformation: GetAccountInformationUseCase,
    private readonly updateAccountUseCase: UpdateAccountUseCase,
    private readonly softDeleteAccountUseCase: SoftDeleteAccountUseCase,
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
  async getMany(
    @Query() pagination: PaginationDto,
  ): Promise<ApiResponse<AccountModel[]>> {
    const { data, metadata } = await this.getManyAccount.execute(pagination);

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
  async getInformation(
    @Payload() payload: PayloadType,
    @Param('id') id: string,
    @Query() transactionPagination: PaginationDto,
  ): Promise<ApiResponse<GetAccountInformationUseCaseResult>> {
    const result = await this.getAccountInformation.execute(payload, {
      accountId: id,
      transactionPagination,
    });

    return {
      data: result,
      message: 'search successfully',
      statusCode: 200,
    };
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

  @Delete('admin/soft-delete/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN)
  async softDeleteAccount(
    @Payload() payload: PayloadType,
    @Param('id') id: string,
  ): Promise<ApiResponse<AccountModel>> {
    const result = await this.softDeleteAccountUseCase.execute(payload, id);

    return {
      data: result,
      message: 'successfully deleted',
      statusCode: 200,
    };
  }
}
