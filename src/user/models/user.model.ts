import { Field, ID, ObjectType, HideField } from '@nestjs/graphql';
import { User as UserModel } from '@prisma/client';

@ObjectType()
export class User implements UserModel {
  @Field(() => ID)
  id: string;
  email: string;
  hasPlaidConnection: boolean;
  @HideField()
  plaidAccessToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
