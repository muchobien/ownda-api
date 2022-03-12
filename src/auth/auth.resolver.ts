import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { AuthInput } from './dto/auth.input';
import { Authenticated } from './models/authenticated.model';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/models/user.model';
import { CurrentUser } from './current-user.decorator';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql.guard';
import { RefreshTokenHeader } from './refresh-token-header.decorator';
import { Credential } from './models/credential.model';
import { PlaidService } from 'src/plaid/plaid.service';
import { PlaidLinkArgs } from './dto/plaidLink.args';

@Resolver()
export class AuthResolver {
  private logger = new Logger(AuthResolver.name);
  constructor(
    private prisma: PrismaService,
    private auth: AuthService,
    private plaid: PlaidService,
  ) {}

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
      user: {
        ...user,
        hasPlaidConnection: false,
      },
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

  @Mutation(() => Boolean, {
    description:
      'Exchange a public_token from [Plaid Link](https://plaid.com/docs/api/#creating-items-with-plaid-link) for a Plaid access_token',
  })
  @UseGuards(GqlAuthGuard)
  async plaidLink(
    @CurrentUser() user: User,
    @Args('publicToken') publicToken: string,
  ): Promise<boolean> {
    const {
      data: { access_token },
    } = await this.plaid.itemPublicTokenExchange({
      public_token: publicToken,
    });

    await this.prisma.identity.upsert({
      where: {
        provider_userId: {
          provider: 'PLAID',
          userId: user.id,
        },
      },
      update: {
        hash: access_token,
      },
      create: {
        userId: user.id,
        provider: 'PLAID',
        hash: access_token,
      },
    });

    return true;
  }

  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  async linkToken(
    @CurrentUser() user: User,
    @Args({ type: () => PlaidLinkArgs }) { packageName }: PlaidLinkArgs,
  ): Promise<string> {
    const { data } = await this.plaid.linkTokenCreate(
      this.plaid.createTokenLinkRequest(user.id, packageName),
    );

    return data.link_token;
  }
}
