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
import { GraphQLResolveInfo } from 'graphql';
import { GqlAuthGuard } from 'src/auth/gql.guard';
import { Category } from 'src/category/models/category.model';
import { ConnectionArgs } from 'src/common/connection.args';
import { IdArgs } from 'src/common/id.args';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionInput } from './dto/transaction.input';
import { TransactionConnection } from './models/transaction.connection';
import { Transaction } from './models/transaction.model';

@Resolver(() => Transaction)
@UseGuards(GqlAuthGuard)
export class TransactionResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => Transaction)
  async transaction(
    @Args({ type: () => IdArgs }) { id }: IdArgs,
  ): Promise<Transaction> {
    return this.prisma.transaction.findUnique({
      where: { id },
      rejectOnNotFound: true,
    });
  }

  @Query(() => TransactionConnection)
  async transactions(
    @Info() resolveInfo: GraphQLResolveInfo,
    @Args({ type: () => ConnectionArgs }) connectionArgs: ConnectionArgs,
  ): Promise<TransactionConnection> {
    return this.prisma.findManyCursorConnection(
      (args) => this.prisma.transaction.findMany(args),
      () => this.prisma.transaction.count(),
      connectionArgs,
      { resolveInfo },
    );
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Args('input') data: TransactionInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data,
    });
  }

  @ResolveField('category', () => Category)
  async category(@Parent() { categoryId }: Transaction): Promise<Category> {
    return this.prisma.category.findUnique({
      where: { id: categoryId },
      rejectOnNotFound: true,
    });
  }
}
