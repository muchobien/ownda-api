import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { AuthInput } from './dto/auth.input';
import { Authenticated } from './models/authenticated.model';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/models/user.model';
import { CurrentUser } from './current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql.guard';
import { RefreshTokenHeader } from './refresh-token-header.decorator';
import { Credential } from './models/credential.model';

@Resolver()
export class AuthResolver {
  constructor(private prisma: PrismaService, private auth: AuthService) {}

  @Mutation(() => Authenticated)
  async register(@Args('input') input: AuthInput): Promise<Authenticated> {
    if (input.provider === 'LOCAL') {
      const salt = await bcrypt.genSalt();
      input.hash = await bcrypt.hash(input.hash, salt);
    }

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        identities: {
          create: {
            provider: input.provider,
            hash: input.hash,
          },
        },
      },
    });

    const credential = await this.auth.generateTokens(user.id);

    return {
      user,
      credential,
    };
  }

  @Mutation(() => Authenticated)
  async login(@Args('input') input: AuthInput): Promise<Authenticated> {
    const user = await this.auth.validateUser(input);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const credential = await this.auth.generateTokens(user.id);

    return {
      user,
      credential,
    };
  }

  @Mutation(() => Credential)
  async refreshToken(
    @RefreshTokenHeader() header?: string,
  ): Promise<Credential> {
    return this.auth.regenerateTokens(header);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }
}
