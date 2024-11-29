import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

@InputType()
export class AuthSignInDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  password: string;
}
