import { InputType, registerEnumType, Field } from '@nestjs/graphql';
import { Provider } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

registerEnumType(Provider, {
  name: 'Provider',
});

@InputType()
export class AuthInput {
  @IsEmail()
  email: string;

  hash: string;

  @IsEnum(Provider)
  @Field(() => Provider)
  provider: Provider;
}
