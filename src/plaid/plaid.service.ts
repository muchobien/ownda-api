import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PlaidApi,
  Configuration,
  PlaidEnvironments,
  LinkTokenCreateRequest,
  CountryCode,
  Products,
} from 'plaid';

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

  createTokenLinkRequest(
    id: string,
    android_package_name?: string,
  ): LinkTokenCreateRequest {
    return {
      client_name: 'ownda',
      user: {
        client_user_id: id,
      },
      products: [Products.Auth, Products.Transactions],
      language: 'es',
      country_codes: [CountryCode.Es],
      android_package_name,
    };
  }
}
