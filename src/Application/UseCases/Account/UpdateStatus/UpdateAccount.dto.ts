import { ACCOUNT_STATUS } from '@metadata';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

@InputType()
export class UpdateAccountDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(1, 70)
  name: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(ACCOUNT_STATUS)
  status: ACCOUNT_STATUS;
}
