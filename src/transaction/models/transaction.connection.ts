import { ObjectType } from '@nestjs/graphql';
import { Connection } from 'src/common/relay.connection';
import { Transaction } from './transaction.model';

@ObjectType()
export class TransactionConnection extends Connection(Transaction) {}
