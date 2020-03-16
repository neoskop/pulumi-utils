import { GetSchemaResponse, PluginInfo } from '@neoskop/pulumi-utils-grpc';
import { InjectionToken } from 'injection-js';

import { IProvider } from './provider.interface';
import { ConfigurationValidator } from './configuration';

export const SCHEMA = new InjectionToken<GetSchemaResponse.AsObject>('Schema');
export const PLUGIN_INFO = new InjectionToken<PluginInfo.AsObject>('PluginInfo');
export const PROVIDERS = new InjectionToken<IProvider[]>('Providers');
export const NAME = new InjectionToken<string>('Name');
export const ACCEPT_SECRETS = new InjectionToken<string>('Accepts Secrets');
export const CONFIGURATION_VALIDATOR = new InjectionToken<ConfigurationValidator>('Configuration Validator');
