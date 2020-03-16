import 'reflect-metadata';

import { EngineClient } from '@neoskop/pulumi-utils-grpc';

import { makeServer } from './make-server';
import { Configuration, ConfigurationImpl } from './provider/configuration';
import { PluginInfoResolver, PluginInfoResolverImpl } from './provider/plugin-info.resolver';
import { ProviderResolver, ProviderResolverImpl } from './provider/provider.resolver';
import { RootProvider } from './provider/root-provider';
import { NAME, PLUGIN_INFO, PROVIDERS, SCHEMA } from './provider/tokens';
import { SchemaResolver, SchemaResolverImpl } from './provider/schema.resolver';

class TestProvider {}

class CustomPluginInfoResolver {}
class CustomSchemaResolver {}
class CustomProviderResolver {}
class CustomConfiguration {}

describe('makeServer', () => {
    it('should return provider factory and injector', () => {
        const factory = makeServer('test', '1.2.3', [TestProvider] as any[]);

        expect(factory).toBeInstanceOf(Function);
        expect(factory.injector).toBeDefined();
    });

    it('should use default values', () => {
        const factory = makeServer('test', '1.2.3', [TestProvider] as any[]);
        const host = {} as any;

        factory(host);

        expect(Array.isArray(factory.injector.get(PROVIDERS))).toBeTruthy();
        expect(factory.injector.get(PROVIDERS).length).toBe(1);
        expect(factory.injector.get(PROVIDERS)[0]).toBeInstanceOf(TestProvider);
        expect(factory.injector.get(PLUGIN_INFO)).toEqual({ version: '1.2.3' });
        expect(factory.injector.get(NAME)).toBe('test');
        expect(factory.injector.get(PluginInfoResolver)).toBeInstanceOf(PluginInfoResolverImpl);
        expect(factory.injector.get(ProviderResolver)).toBeInstanceOf(ProviderResolverImpl);
        expect(factory.injector.get(Configuration)).toBeInstanceOf(ConfigurationImpl);
        expect(factory.injector.get(RootProvider)).toBeInstanceOf(RootProvider);
        expect(factory.injector.get(SCHEMA, null)).toBeNull();
        expect(factory.injector.get(SchemaResolver, null)).toBeNull();
        expect(factory.injector.get(EngineClient)).toBe(host);
    });

    it('should use default values with schema', () => {
        const factory = makeServer('test', '1.2.3', [TestProvider] as any[], { schema: '$SCHEMA$' });
        const host = {} as any;

        factory(host);

        expect(Array.isArray(factory.injector.get(PROVIDERS))).toBeTruthy();
        expect(factory.injector.get(PROVIDERS).length).toBe(1);
        expect(factory.injector.get(PROVIDERS)[0]).toBeInstanceOf(TestProvider);
        expect(factory.injector.get(PLUGIN_INFO)).toEqual({ version: '1.2.3' });
        expect(factory.injector.get(NAME)).toBe('test');
        expect(factory.injector.get(PluginInfoResolver)).toBeInstanceOf(PluginInfoResolverImpl);
        expect(factory.injector.get(ProviderResolver)).toBeInstanceOf(ProviderResolverImpl);
        expect(factory.injector.get(Configuration)).toBeInstanceOf(ConfigurationImpl);
        expect(factory.injector.get(RootProvider)).toBeInstanceOf(RootProvider);
        expect(factory.injector.get(SCHEMA)).toEqual({ schema: '$SCHEMA$' });
        expect(factory.injector.get(SchemaResolver)).toBeInstanceOf(SchemaResolverImpl);
        expect(factory.injector.get(EngineClient)).toBe(host);
    });

    it('should use custom providers', () => {
        const factory = makeServer('test', '1.2.3', [TestProvider] as any[], {
            Configuration: CustomConfiguration as any,
            PluginInfoResolver: CustomPluginInfoResolver as any,
            SchemaResolver: CustomSchemaResolver as any,
            ProviderResolver: CustomProviderResolver as any
        });
        const host = {} as any;

        factory(host);

        expect(Array.isArray(factory.injector.get(PROVIDERS))).toBeTruthy();
        expect(factory.injector.get(PROVIDERS).length).toBe(1);
        expect(factory.injector.get(PROVIDERS)[0]).toBeInstanceOf(TestProvider);
        expect(factory.injector.get(PLUGIN_INFO)).toEqual({ version: '1.2.3' });
        expect(factory.injector.get(NAME)).toBe('test');
        expect(factory.injector.get(PluginInfoResolver)).toBeInstanceOf(CustomPluginInfoResolver);
        expect(factory.injector.get(ProviderResolver)).toBeInstanceOf(CustomProviderResolver);
        expect(factory.injector.get(Configuration)).toBeInstanceOf(CustomConfiguration);
        expect(factory.injector.get(RootProvider)).toBeInstanceOf(RootProvider);
        expect(factory.injector.get(EngineClient)).toBe(host);
    });
});
