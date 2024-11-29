import { Field, InputType } from '@nestjs/graphql';
import {
  IsObject,
  IsOptional,
  IsString,
  Min,
  IsInt,
  IsIn,
} from 'class-validator';
import { PaginationProps } from '@types';
import { Transform } from 'class-transformer';

@InputType()
export class PaginationDto implements PaginationProps {
  @Field(() => Number, { defaultValue: 1 })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'The page must be at least 1' })
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  page?: number = 1;

  @Field(() => Number, { defaultValue: 100 })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'The limit must be at least 1.' })
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @Field(() => Number)
  limit?: number = 100;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;

  @Field(() => String, { defaultValue: 'DESC' })
  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: 'Order must be ASC or DESC' })
  order?: 'ASC' | 'DESC';
}
