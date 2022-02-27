import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Credential {
  accessToken: string;
  refreshToken: string;
  tokenKind: string;
}
