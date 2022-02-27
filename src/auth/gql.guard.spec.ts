import { GqlAuthGuard } from './gql.guard';

describe('GqlGuard', () => {
  it('should be defined', () => {
    expect(new GqlAuthGuard()).toBeDefined();
  });
});
