import { EngineClient, GetSchemaResponse, PluginInfo } from '@pulumi-utils/grpc';
import { Injector, Provider, ReflectiveInjector } from 'injection-js';

import { PluginInfoResolver, PluginInfoResolverImpl } from './provider/plugin-info.resolver';
import { IProvider } from './provider/provider.interface';
import { ProviderResolver, ProviderResolverImpl } from './provider/provider.resolver';
import { RootProvider } from './provider/root-provider';
import { SchemaResolver, SchemaResolverImpl } from './provider/schema.resolver';
import { NAME, PLUGIN_INFO, PROVIDERS, SCHEMA, ACCEPT_SECRETS } from './provider/tokens';
import { ResourceProviderFactory } from './serve';
import { Constructor, ensure } from './types';
import { Configuration, ConfigurationImpl } from './provider/configuration';

export interface MakeServerOptions {
    schema?: string;
    acceptSecrets?: boolean;

    PluginInfoResolver?: Constructor<PluginInfoResolver>;
    SchemaResolver?: Constructor<SchemaResolver>;
    ProviderResolver?: Constructor<ProviderResolver>;
    Configuration?: Constructor<Configuration>;
    RootProvider?: Constructor<RootProvider>;
    providers?: Provider[];
    injector?: Injector;
}

export function makeServer(
    name: string,
    version: string,
    resourceProviders: Constructor<IProvider>[],
    {
        schema,
        acceptSecrets = true,
        PluginInfoResolver: PluginInfoResolver_ = PluginInfoResolverImpl,
        SchemaResolver: SchemaResolver_ = SchemaResolverImpl,
        ProviderResolver: ProviderResolver_ = ProviderResolverImpl,
        Configuration: Configuration_ = ConfigurationImpl,
        RootProvider: RootProvider_ = RootProvider,
        providers = [],
        injector: parentInjector
    }: MakeServerOptions = {}
): ResourceProviderFactory & { injector: Injector } {
    let _host: EngineClient | undefined;
    function hostFactory() {
        return _host;
    }

    const injector = ReflectiveInjector.resolveAndCreate(
        [
            ...resourceProviders.map(provider => ({ provide: PROVIDERS, useClass: provider, multi: true })),
            { provide: PLUGIN_INFO, useValue: ensure<PluginInfo.AsObject>({ version }) },
            { provide: NAME, useValue: name },
            { provide: ACCEPT_SECRETS, useValue: acceptSecrets },
            PluginInfoResolver_,
            ProviderResolver_,
            Configuration_,
            RootProvider_,
            { provide: PluginInfoResolver, useExisting: PluginInfoResolver_ },
            { provide: ProviderResolver, useExisting: ProviderResolver_ },
            { provide: Configuration, useExisting: Configuration_ },
            { provide: RootProvider, useExisting: RootProvider_ },
            ...(schema ? [{ provide: SCHEMA, useValue: ensure<GetSchemaResponse.AsObject>({ schema }) }] : []),
            ...(schema || SchemaResolver_ !== SchemaResolverImpl ? [{ provide: SchemaResolver, useClass: SchemaResolver_ }] : []),
            ...providers,
            { provide: EngineClient, useFactory: hostFactory, deps: [] }
        ],
        parentInjector
    );

    return Object.assign(
        (host: EngineClient) => {
            _host = host;
            return injector.get(RootProvider);
        },
        { injector }
    );
}
