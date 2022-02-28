import { ObjectType } from '@nestjs/graphql';
import { Connection } from 'src/common/relay.connection';
import { Account } from './account.model';

@ObjectType()
export class AccountConnection extends Connection(Account) {}
