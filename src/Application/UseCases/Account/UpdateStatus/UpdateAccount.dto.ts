import { ACCOUNT_STATUS } from '@metadata';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateAccountDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(1, 70)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(ACCOUNT_STATUS)
  status: ACCOUNT_STATUS;
}
