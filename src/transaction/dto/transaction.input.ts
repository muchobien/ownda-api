import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { TransactionKind } from '@prisma/client';

registerEnumType(TransactionKind, {
  name: 'TransactionKind',
});

@InputType()
export class TransactionInput {
  name: string;
  amount: number;
  @Field(() => TransactionKind)
  kind: TransactionKind;
  accountId: string;
  categoryId: string;
}
