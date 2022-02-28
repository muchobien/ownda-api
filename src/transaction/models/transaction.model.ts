import { Field, ID, ObjectType, HideField } from '@nestjs/graphql';
import {
  Transaction as TransactionModel,
  TransactionKind,
} from '@prisma/client';

@ObjectType()
export class Transaction implements TransactionModel {
  @Field(() => ID)
  id: string;
  name: string;
  amount: number;
  @Field(() => TransactionKind)
  kind: TransactionKind;
  @HideField()
  accountId: string;
  categoryId: string;
  @HideField()
  toAccountId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
