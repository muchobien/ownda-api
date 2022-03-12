import { Field, ID, ObjectType, HideField } from '@nestjs/graphql';
import { Account as AccountModel } from '@prisma/client';

@ObjectType()
export class Account implements AccountModel {
  @Field(() => ID)
  id: string;
  name: string;
  color: string;
  @HideField()
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  @HideField()
  plaidId: string | null;
}
