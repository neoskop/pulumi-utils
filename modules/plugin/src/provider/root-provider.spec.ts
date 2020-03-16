import 'reflect-metadata';

import {
    CheckRequest,
    CheckResponse,
    ConfigureRequest,
    ConfigureResponse,
    DiffRequest,
    DiffResponse,
    GetSchemaRequest,
    GetSchemaResponse,
    PluginInfo
} from '@neoskop/pulumi-utils-grpc';
import { mockServerUnaryCall } from '@neoskop/pulumi-utils-grpc/src/testing';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { status } from 'grpc';

import { ServiceError } from '../errors';
import { ProviderMockImpl } from './__mocks__/provider';
import { Configuration, ConfigurationImpl } from './configuration';
import { PluginInfoResolver, PluginInfoResolverImpl } from './plugin-info.resolver';
import { IProvider } from './provider.interface';
import { ProviderResolver, ProviderResolverImpl } from './provider.resolver';
import { RootProvider } from './root-provider';
import { SchemaResolver, SchemaResolverImpl } from './schema.resolver';

jest.mock('./provider.resolver');
jest.mock('./plugin-info.resolver');
jest.mock('./schema.resolver');
jest.mock('./configuration');

describe('provider / root-provider', () => {
    describe('RootProvider', () => {
        let root: RootProvider;
        let providers: (typeof ProviderMockImpl & IProvider)[];
        let providerResolver: jest.Mocked<ProviderResolver>;
        let pluginInfoResolver: jest.Mocked<PluginInfoResolver>;
        let schemaResolver: jest.Mocked<SchemaResolver>;
        let configuration: jest.Mocked<Configuration>;

        beforeEach(() => {
            root = new RootProvider(
                (providers = [new ProviderMockImpl(), new ProviderMockImpl()]),
                (providerResolver = new ProviderResolverImpl(providers) as any),
                (pluginInfoResolver = new PluginInfoResolverImpl({} as any) as any),
                (configuration = new ConfigurationImpl('', null!) as any),
                (schemaResolver = new SchemaResolverImpl({} as any) as any)
            );
        });

        describe('getPluginInfo', () => {
            it('should call plugin-info provider', () => {
                pluginInfoResolver.getPluginInfo.mockReturnValue({ version: '1.22.333' });
                const req = mockServerUnaryCall({});
                const cb = jest.fn();
                root.getPluginInfo(req, cb);

                expect(pluginInfoResolver.getPluginInfo).toHaveBeenCalledTimes(1);

                expect(cb).toHaveBeenCalledTimes(1);
                const exp = new PluginInfo();
                exp.setVersion('1.22.333');
                expect(cb.mock.calls[0]).toEqual([null, exp]);
            });

            it('should return error', () => {
                pluginInfoResolver.getPluginInfo.mockImplementation(() => {
                    throw new Error('err msg');
                });
                const req = mockServerUnaryCall({});
                const cb = jest.fn();
                root.getPluginInfo(req, cb);

                expect(cb).toHaveBeenCalledTimes(1);
                expect(cb.mock.calls[0][0]).toBeInstanceOf(ServiceError);
                expect(cb.mock.calls[0][0]).toEqual(ServiceError.ensure(new Error('err msg')));
                expect(cb.mock.calls[0][1]).toEqual(null);
            });
        });

        describe('getSchema', () => {
            it('should call schema provider', () => {
                schemaResolver.getSchema.mockReturnValue({ schema: '$SCHEMA$' });
                const req = mockServerUnaryCall(new GetSchemaRequest());
                const cb = jest.fn();
                root.getSchema(req, cb);

                expect(schemaResolver.getSchema).toHaveBeenCalledTimes(1);

                expect(cb).toHaveBeenCalledTimes(1);
                const exp = new GetSchemaResponse();
                exp.setSchema('$SCHEMA$');
                expect(cb.mock.calls[0]).toEqual([null, exp]);
            });

            it('should return error', () => {
                schemaResolver.getSchema.mockImplementation(() => {
                    throw new Error('err msg');
                });
                const req = mockServerUnaryCall(new GetSchemaRequest());
                const cb = jest.fn();
                root.getSchema(req, cb);

                expect(cb).toHaveBeenCalledTimes(1);
                expect(cb.mock.calls[0][0]).toBeInstanceOf(ServiceError);
                expect(cb.mock.calls[0][0]).toEqual(ServiceError.ensure(new Error('err msg')));
                expect(cb.mock.calls[0][1]).toEqual(null);
            });

            it('should throw "not implemented" error on missing implementation', () => {
                root = new RootProvider(
                    (providers = [new ProviderMockImpl(), new ProviderMockImpl()]),
                    (providerResolver = new ProviderResolverImpl(providers) as any),
                    (pluginInfoResolver = new PluginInfoResolverImpl({} as any) as any),
                    (configuration = new ConfigurationImpl('', null!) as any)
                );
                const req = mockServerUnaryCall(new GetSchemaRequest());
                const cb = jest.fn();
                root.getSchema(req, cb);

                expect(cb).toHaveBeenCalledTimes(1);
                expect(cb.mock.calls[0]).toEqual([new ServiceError('not implemented', status.UNIMPLEMENTED), null]);
            });
        });

        describe('checkConfig', () => {
            it('should call configuration', async () => {
                const res = new CheckResponse();
                configuration.checkConfig.mockReturnValue(res);
                const req = mockServerUnaryCall(new CheckRequest());
                const cb = jest.fn();
                await root.checkConfig(req, cb);

                expect(configuration.checkConfig).toHaveBeenCalledTimes(1);

                expect(cb).toHaveBeenCalledTimes(1);
                expect(cb.mock.calls[0]).toEqual([null, res]);
            });

            it('should return error', async () => {
                configuration.checkConfig.mockImplementation(() => {
                    throw new Error('err msg');
                });
                const req = mockServerUnaryCall(new CheckRequest());
                const cb = jest.fn();
                await root.checkConfig(req, cb);

                expect(cb).toHaveBeenCalledTimes(1);
                expect(cb.mock.calls[0][0]).toBeInstanceOf(ServiceError);
                expect(cb.mock.calls[0][0]).toEqual(ServiceError.ensure(new Error('err msg')));
                expect(cb.mock.calls[0][1]).toEqual(null);
            });
        });

        describe('diffConfig', () => {
            it('should call configuration', async () => {
                const res = new DiffResponse();
                configuration.diffConfig.mockReturnValue(res);
                const req = mockServerUnaryCall(new DiffRequest());
                const cb = jest.fn();
                await root.diffConfig(req, cb);

                expect(configuration.diffConfig).toHaveBeenCalledTimes(1);

                expect(cb).toHaveBeenCalledTimes(1);
                expect(cb.mock.calls[0]).toEqual([null, res]);
            });

            it('should return error', async () => {
                configuration.diffConfig.mockImplementation(() => {
                    throw new Error('err msg');
                });
                const req = mockServerUnaryCall(new DiffRequest());
                const cb = jest.fn();
                await root.diffConfig(req, cb);

                expect(cb).toHaveBeenCalledTimes(1);
                expect(cb.mock.calls[0][0]).toBeInstanceOf(ServiceError);
                expect(cb.mock.calls[0][0]).toEqual(ServiceError.ensure(new Error('err msg')));
                expect(cb.mock.calls[0][1]).toEqual(null);
            });
        });

        describe('configure', () => {
            it('should call configuration', async () => {
                const res = new ConfigureResponse();
                configuration.configure.mockReturnValue(res);
                const req = mockServerUnaryCall(new ConfigureRequest());
                const cb = jest.fn();
                await root.configure(req, cb);

                expect(configuration.configure).toHaveBeenCalledTimes(1);

                expect(cb).toHaveBeenCalledTimes(1);
                expect(cb.mock.calls[0]).toEqual([null, res]);
            });

            it('should return error', async () => {
                configuration.configure.mockImplementation(() => {
                    throw new Error('err msg');
                });
                const req = mockServerUnaryCall(new ConfigureRequest());
                const cb = jest.fn();
                await root.configure(req, cb);

                expect(cb).toHaveBeenCalledTimes(1);
                expect(cb.mock.calls[0][0]).toBeInstanceOf(ServiceError);
                expect(cb.mock.calls[0][0]).toEqual(ServiceError.ensure(new Error('err msg')));
                expect(cb.mock.calls[0][1]).toEqual(null);
            });
        });

        for (const [method, options] of new Map<
            keyof IProvider,
            { emptyResponse?: boolean; callAll?: boolean; ignoreNotImplemented?: boolean }
        >([
            ['invoke', {}],
            ['check', {}],
            ['diff', {}],
            ['create', {}],
            ['read', {}],
            ['update', {}],
            ['delete', { emptyResponse: true }],
            ['cancel', { emptyResponse: true, callAll: true, ignoreNotImplemented: true }]
        ])) {
            describe(method, () => {
                beforeEach(() => {
                    providerResolver.resolve.mockReturnValue(providers[0]);
                });

                it('should call method', async () => {
                    (providers[0][method] as jest.MockedFunction<any>).mockReturnValue({ return: 'value' });
                    const req = mockServerUnaryCall({});
                    const cb = jest.fn();

                    await (root as any)[method](req, cb);

                    expect(cb).toHaveBeenCalledTimes(1);
                    expect(cb.mock.calls[0][0]).toEqual(null);
                    expect(cb.mock.calls[0][1]).toEqual(options.emptyResponse ? new Empty() : { return: 'value' });
                });

                it('should throw error', async () => {
                    (providers[0][method] as jest.MockedFunction<any>).mockImplementation(() => {
                        throw new Error('err msg');
                    });
                    const req = mockServerUnaryCall({});
                    const cb = jest.fn();

                    await (root as any)[method](req, cb);

                    expect(cb).toHaveBeenCalledTimes(1);
                    expect(cb.mock.calls[0][0]).toBeInstanceOf(ServiceError);
                    expect(cb.mock.calls[0][0]).toEqual(ServiceError.ensure(new Error('err msg')));
                    expect(cb.mock.calls[0][1]).toEqual(null);
                });

                if (options.callAll) {
                    it('should call all providers', async () => {
                        const req = mockServerUnaryCall({});
                        const cb = jest.fn();

                        await (root as any)[method](req, cb);

                        for (const p of providers) {
                            expect(p[method]).toHaveBeenCalledTimes(1);
                        }
                    });
                }
                if (!options.ignoreNotImplemented) {
                    it('should throw "not implemented" on missing method', async () => {
                        delete providers[0][method];
                        const req = mockServerUnaryCall({});
                        const cb = jest.fn();

                        await (root as any)[method](req, cb);

                        expect(cb).toHaveBeenCalledTimes(1);
                        expect(cb.mock.calls[0][0]).toEqual(new ServiceError('not implemented', status.UNIMPLEMENTED));
                        expect(cb.mock.calls[0][1]).toEqual(null);
                    });
                }
            });
        }
    });
});
