import { ObjectType } from '@nestjs/graphql';
import { Connection } from 'src/common/relay.connection';
import { Category } from './category.model';

@ObjectType()
export class CategoryConnection extends Connection(Category) {}
