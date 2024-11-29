import { Type } from '@nestjs/common';
import { Field, ObjectType, Int } from '@nestjs/graphql';

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

export function ApiResponseObjectType<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class ApiResponseObjectTypeClass {
    @Field(() => Int)
    statusCode: number;

    @Field()
    message: string;

    @Field(() => classRef, { nullable: true })
    data?: T;

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
