import { Field, InputType } from '@nestjs/graphql';
import {
  IsNumber,
  Min,
  Max,
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
} from 'class-validator';

@InputType()
export class TransferDto {
  @Field(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000000000)
  value: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  targetId: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  senderId: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Length(0, 20)
  description?: string;
}
