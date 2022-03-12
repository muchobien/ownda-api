import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { CategoryModule } from './category/category.module';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { PlaidService } from './plaid/plaid.service';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    AccountModule,
    TransactionModule,
    WebhookModule,
  ],
  providers: [PrismaService, PlaidService],
})
export class AppModule {}
