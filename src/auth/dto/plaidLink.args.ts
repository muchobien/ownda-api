import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class PlaidLinkArgs {
  /**
   * Android package name, Required to initialize Link on Android.
   */
  packageName?: string;
}
