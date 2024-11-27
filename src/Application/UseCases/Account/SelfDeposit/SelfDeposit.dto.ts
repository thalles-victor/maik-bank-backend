import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  Max,
  Length,
} from 'class-validator';

export class SelfDepositDto {
  @IsNumber()
  @IsPositive()
  @Min(5)
  @Max(10000)
  amount: number;

  @IsString()
  @IsNotEmpty()
  @Length(0, 15)
  accountId: string;
}
