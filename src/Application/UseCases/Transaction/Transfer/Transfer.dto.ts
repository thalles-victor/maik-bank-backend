import {
  IsNumber,
  Min,
  Max,
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
} from 'class-validator';

export class TransferDto {
  @IsNumber()
  @Min(1)
  @Max(1000000000)
  value: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  targetId: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  senderId: string;

  @IsString()
  @IsOptional()
  @Length(0, 20)
  description?: string;
}
