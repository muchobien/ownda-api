import { ArgsType } from '@nestjs/graphql';
import type { ConnectionArguments } from '@devoxa/prisma-relay-cursor-connection';
import { ConnectionArgsConstraint } from './connection.decorator';

@ArgsType()
export class ConnectionArgs implements ConnectionArguments {
  @ConnectionArgsConstraint()
  after?: string;
  first?: number;
  before?: string;
  last?: number;
}
