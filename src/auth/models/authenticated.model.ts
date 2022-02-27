import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model';
import { Credential } from './credential.model';

@ObjectType()
export class Authenticated {
  @Field(() => User)
  user: User;

  @Field(() => Credential)
  credential: Credential;
}
