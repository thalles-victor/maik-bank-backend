import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class SelfDepositDto {
  @Field(() => Number)
  @IsNumber()
  @IsPositive()
  @Min(1)
  // @Max(10000)
  value: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  // @Length(0, 15)
  accountId: string;
}
