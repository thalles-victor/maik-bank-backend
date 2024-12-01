import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class IdDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  id: string;
}
