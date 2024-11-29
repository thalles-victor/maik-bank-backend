import { ObjectType } from '@nestjs/graphql';
import { ApiResponseObjectType } from './ApiResponse.object-type';
import { UserModel } from '#models';

@ObjectType()
export class UserObjectTypeResponse extends ApiResponseObjectType(UserModel) {}
