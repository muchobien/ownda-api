import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User as PrismaUser } from '@prisma/client';

@ObjectType()
export class User implements PrismaUser {
  @Field(() => ID)
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
