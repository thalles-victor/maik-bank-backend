import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  @Length(1, 70)
  name: string;
}
