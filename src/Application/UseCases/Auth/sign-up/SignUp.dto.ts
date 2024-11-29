import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

@InputType()
export class AuthSignUpDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 70)
  @Field(() => String)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 70)
  @Field(() => String)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  @Matches(/^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{8,100}$/, {
    message:
      'A senha deve ter 8 carecteres, um especial um maúsculo e um número no mínimo',
  })
  @Field(() => String)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 40)
  @Matches(
    /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/,
    {
      message:
        'O cpf ou cnpj deve estar nesse formato, cpf: 999.999.999-99, cnpj: 99.999.999/9999-99',
    },
  )
  @Field(() => String)
  cpfCnpj: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message:
      'A data de nascimento deve estar no formato da data deve ser dd/mm/aaaa',
  })
  @Field(() => String)
  dateBirth: string;
}
