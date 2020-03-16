import { ProviderResolver } from '../provider.resolver';

export class ProviderResolverMock implements ProviderResolver {
    resolve = jest.fn();
}

export const ProviderResolverImpl = jest.fn().mockImplementation(function() {
    return new ProviderResolverMock();
});
