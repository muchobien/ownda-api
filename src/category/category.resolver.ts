import { Resolver, Args, Query, Mutation, Info } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConnectionArgs } from 'src/common/connection.args';
import { Category } from './models/category.model';
import { IdArgs } from 'src/common/id.args';
import { CategoryInput } from './dto/category.input';
import { CategoryConnection } from './models/category.connection';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver()
export class CategoryResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => Category)
  async category(
    @Args({ type: () => IdArgs }) { id }: IdArgs,
  ): Promise<Category> {
    return this.prisma.category.findUnique({
      where: { id },
      rejectOnNotFound: true,
    });
  }

  @Query(() => CategoryConnection)
  async categories(
    @Info() resolveInfo: GraphQLResolveInfo,
    @Args({ type: () => ConnectionArgs }) connectionArgs: ConnectionArgs,
  ): Promise<CategoryConnection> {
    console.log(resolveInfo);
    return this.prisma.findManyCursorConnection(
      (args) => this.prisma.category.findMany(args),
      () => this.prisma.category.count(),
      connectionArgs,
      { resolveInfo },
    );
  }

  @Mutation(() => Category)
  async createCategory(@Args('input') data: CategoryInput): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }
}
