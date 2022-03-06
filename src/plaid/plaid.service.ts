import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlaidApi, Configuration, PlaidEnvironments } from 'plaid';

@Injectable()
export class PlaidService extends PlaidApi {
  constructor(configService: ConfigService) {
    const configuration = new Configuration({
      basePath: PlaidEnvironments.development,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': configService.get<string>('PLAID_CLIENT_ID'),
          'PLAID-SECRET': configService.get<string>('PLAID_SECRET'),
        },
      },
    });
    super(configuration);
  }
}
