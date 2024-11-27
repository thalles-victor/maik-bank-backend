import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class AuthSignUpDto {
  @IsString()
  @IsNotEmpty()
  @Min(5)
  @Max(70)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Min(5)
  @Max(70)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Min(6)
  @Max(30)
  @Matches(/^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{8,100}$/, {
    message:
      'A senha deve ter 8 carecteres, um especial um maúsculo e um número no mínimo',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/,
    {
      message:
        'O cpf ou cnpj deve estar nesse formato, cpf: 999.999.999-99, cnpj: 99.999.999/9999-99',
    },
  )
  cpfCnpj: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/, {
    message:
      'A data de nascimento deve estar no formato da data deve ser dd/mm/aaaa',
  })
  dateBirth: string;
}
