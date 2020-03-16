import 'reflect-metadata';
import { PluginInfoResolverImpl, PluginInfoResolver } from './plugin-info.resolver';

describe('provider / plugin-info.resolver', () => {
    describe('PluginInfoResolverImpl', () => {
        it('should be instance of PluginInfoResolver', () => {
            expect(new PluginInfoResolverImpl(null!)).toBeInstanceOf(PluginInfoResolver);
        });

        it('should return provided plugin-info', () => {
            const info = { version: '1.2.3' };
            const resolver = new PluginInfoResolverImpl(info);

            expect(resolver.getPluginInfo()).toEqual(info);
        });
    });
});
