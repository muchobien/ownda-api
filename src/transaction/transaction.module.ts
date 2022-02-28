import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionResolver } from './transaction.resolver';

@Module({
  providers: [PrismaService, TransactionResolver],
})
export class TransactionModule {}
