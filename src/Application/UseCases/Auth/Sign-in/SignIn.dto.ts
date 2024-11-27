import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class AuthSignInDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
