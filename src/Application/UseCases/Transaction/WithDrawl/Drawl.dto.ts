import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@InputType()
export class DrawlDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @Field(() => Number)
  @IsNumber()
  @Min(1)
  value: number;
}
