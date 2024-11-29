import { Type } from '@nestjs/common';
import { Field, ObjectType, Int } from '@nestjs/graphql';

export type ApiResponseOptions = {
  isArray: boolean;
};

@ObjectType()
class MetaType {
  @Field(() => Int, { nullable: true })
  total?: number;

  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  per_page?: number;

  @Field(() => String, { nullable: true })
  order?: 'ASC' | 'DESC';
}

export function ApiResponseObjectType<T>(
  classRef: Type<T>,
  options: ApiResponseOptions = {
    isArray: false,
  },
) {
  @ObjectType({ isAbstract: true })
  abstract class ApiResponseObjectTypeClass {
    @Field(() => Int)
    statusCode: number;

    @Field()
    message: string;

    @Field(() => (options.isArray ? [classRef] : classRef), { nullable: true })
    data?: T | T[];

    @Field(() => MetaType, { nullable: true })
    meta?: MetaType;

    @Field({ nullable: true })
    href?: string;
  }
  return ApiResponseObjectTypeClass;
}

// @ObjectType()
// class ExampleData {
//   @Field()
//   id: string;

//   @Field()
//   name: string;
// }

// @ObjectType()
// export class ExampleResponse extends ApiResponseObjectType(ExampleData) {}
