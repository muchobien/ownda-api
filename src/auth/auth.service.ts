import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Credential } from './models/credential.model';
import { AuthInput } from './dto/auth.input';
import { User } from 'src/user/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser({
    email,
    hash,
    provider,
  }: AuthInput): Promise<User | null> {
    const result = await this.prisma.user.findUnique({
      where: { email },
      include: {
        identities: {
          where: {
            provider: {
              in: [provider, 'PLAID'],
            },
          },
        },
      },
    });

    if (!result) return null;

    const { identities, ...user } = result;
    if (provider === 'LOCAL') {
      const isValid = await bcrypt.compare(hash, identities[0].hash);
      return isValid
        ? {
            ...user,
            hasPlaidConnection: !!identities.find(
              (identity) => identity.provider === 'PLAID',
            ),
          }
        : null;
    }

    return null;
  }

  async generateTokens(sub: string): Promise<Credential> {
    const payload = { sub };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        expiresIn: '4weeks',
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenKind: 'Bearer',
    };
  }

  async regenerateTokens(refreshToken?: string): Promise<Credential> {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
    });

    return this.generateTokens(payload.sub);
  }
}
