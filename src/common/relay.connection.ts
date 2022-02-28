import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

export interface RelayConnection<T> {
  edges: Array<RelayEdge<T>>;
  pageInfo: PageInfo;
}

/**
 * A type designed to be exposed as a `Edge` over GraphQL.
 */
export interface RelayEdge<T> {
  node: T;
  cursor: string;
}

/**
 * A type designed to be exposed as `PageInfo` over GraphQL.
 */
export interface RelayPageInfo {
  startCursor?: string;
  endCursor?: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@ObjectType({ isAbstract: true })
class PageInfo implements RelayPageInfo {
  @Field(() => String, { nullable: true })
  startCursor?: string;
  @Field(() => String, { nullable: true })
  endCursor?: string;
  @Field(() => Boolean)
  hasPreviousPage: boolean;
  @Field(() => Boolean)
  hasNextPage: boolean;
}

export function Connection<T>(classRef: Type<T>) {
  @ObjectType(`${classRef.name}Edge`)
  abstract class Edge<T> implements RelayEdge<T> {
    @Field(() => classRef)
    node: T;

    @Field(() => String)
    cursor: string;
  }

  @ObjectType({ isAbstract: true })
  class IConnection implements RelayConnection<T> {
    @Field(() => [Edge])
    edges: Array<RelayEdge<T>>;

    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field(() => Number)
    totalCount: number;
  }

  return IConnection as Type<RelayConnection<T>>;
}
