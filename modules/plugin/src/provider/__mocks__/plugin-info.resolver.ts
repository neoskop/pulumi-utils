import { PluginInfoResolver } from '../plugin-info.resolver';

export class PluginInfoResolverMock implements PluginInfoResolver {
    getPluginInfo = jest.fn();
}

export const PluginInfoResolverImpl = jest.fn().mockImplementation(function() {
    return new PluginInfoResolverMock();
});
