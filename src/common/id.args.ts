import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class IdArgs {
  @Field(() => ID)
  id: string;
}
