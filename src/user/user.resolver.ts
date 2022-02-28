import { Args, Info, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import type { GraphQLResolveInfo } from 'graphql';
import { AccountConnection } from 'src/account/models/account.connection';
import { ConnectionArgs } from 'src/common/connection.args';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './models/user.model';

@Resolver(() => User)
export class UserResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField('accounts', () => AccountConnection)
  async accounts(
    @Parent() { id }: User,
    @Info() resolveInfo: GraphQLResolveInfo,
    @Args({ type: () => ConnectionArgs }) connectionArgs: ConnectionArgs,
  ): Promise<AccountConnection> {
    return this.prisma.findManyCursorConnection(
      (args) => this.prisma.user.findUnique({ where: { id } }).accounts(args),
      () => this.prisma.account.count(),
      connectionArgs,
      { resolveInfo },
    );
  }
}
