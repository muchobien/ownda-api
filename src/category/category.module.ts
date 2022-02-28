import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryResolver } from './category.resolver';

@Module({
  providers: [PrismaService, CategoryResolver],
})
export class CategoryModule {}
