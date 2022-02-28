import { UseGuards } from '@nestjs/common';
import {
  Args,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import type { GraphQLResolveInfo } from 'graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql.guard';
import { ConnectionArgs } from 'src/common/connection.args';
import { IdArgs } from 'src/common/id.args';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionConnection } from 'src/transaction/models/transaction.connection';
import { User } from 'src/user/models/user.model';
import { AccountInput } from './dto/account.input';
import { AccountConnection } from './models/account.connection';
import { Account } from './models/account.model';

@Resolver(() => Account)
@UseGuards(GqlAuthGuard)
export class AccountResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => Account)
  async account(
    @Args({ type: () => IdArgs }) { id }: IdArgs,
  ): Promise<Account> {
    return this.prisma.account.findUnique({
      where: { id },
      rejectOnNotFound: true,
    });
  }

  @Query(() => AccountConnection)
  async accounts(
    @Info() resolveInfo: GraphQLResolveInfo,
    @Args({ type: () => ConnectionArgs }) connectionArgs: ConnectionArgs,
  ): Promise<AccountConnection> {
    return this.prisma.findManyCursorConnection(
      (args) => this.prisma.account.findMany(args),
      () => this.prisma.account.count(),
      connectionArgs,
      { resolveInfo },
    );
  }

  @Mutation(() => Account)
  async createAccount(
    @CurrentUser() user: User,
    @Args('input') input: AccountInput,
  ): Promise<Account> {
    return this.prisma.account.create({
      data: {
        userId: user.id,
        ...input,
      },
    });
  }

  @ResolveField('transactions', () => TransactionConnection)
  async transactions(
    @Parent() { id }: Account,
    @Info() resolveInfo: GraphQLResolveInfo,
    @Args({ type: () => ConnectionArgs }) connectionArgs: ConnectionArgs,
  ): Promise<TransactionConnection> {
    return this.prisma.findManyCursorConnection(
      (args) =>
        this.prisma.transaction.findMany({ where: { accountId: id }, ...args }),
      () => this.prisma.transaction.count(),
      connectionArgs,
      { resolveInfo },
    );
  }
}
