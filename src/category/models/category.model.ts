import { Field, ID, ObjectType, HideField } from '@nestjs/graphql';
import { Category as CategoryModel } from '@prisma/client';

@ObjectType()
export class Category implements CategoryModel {
  @Field(() => ID)
  id: string;
  name: string;
  @HideField()
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
