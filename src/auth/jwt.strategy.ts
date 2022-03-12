import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: { sub: string }): Promise<User> {
    const { identities, ...user } = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      include: {
        identities: {
          where: {
            provider: 'PLAID',
          },
        },
      },
      rejectOnNotFound: true,
    });

    return {
      ...user,
      hasPlaidConnection: identities.length === 1,
      plaidAccessToken: identities[0].hash,
    };
  }
}
