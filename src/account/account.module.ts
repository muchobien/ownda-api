import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountResolver } from './account.resolver';

@Module({
  providers: [PrismaService, AccountResolver],
})
export class AccountModule {}
