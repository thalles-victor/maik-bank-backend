import { UserModel } from '#models';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiResponseObjectType } from './ApiResponse.object-type';

@ObjectType()
class AuthObjectType {
  @Field(() => UserModel)
  user: UserModel;

  @Field(() => String)
  access_token: string;
}

@ObjectType()
export class AuthObjectTypeResponse extends ApiResponseObjectType(
  AuthObjectType,
) {}
