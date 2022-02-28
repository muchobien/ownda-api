import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User as UserModel } from '@prisma/client';

@ObjectType()
export class User implements UserModel {
  @Field(() => ID)
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
