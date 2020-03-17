import 'reflect-metadata';
import { Configuration, ConfigurationImpl } from './configuration';
import {} from './configuration';
import { mockServerUnaryCall } from '@neoskop/pulumi-utils-grpc/src/testing';
import {
    ConfigureRequest,
    ConfigureResponse,
    CheckResponse,
    CheckRequest,
    CheckFailure,
    DiffRequest,
    DiffResponse
} from '@neoskop/pulumi-utils-grpc';
import { Struct } from '@neoskop/pulumi-utils-common';

describe('provider / configuration', () => {
    describe('ConfigurationImpl', () => {
        let configuration: Configuration;

        beforeEach(() => {
            configuration = new ConfigurationImpl('plugin-name', true);
        });

        describe('configure', () => {
            it('should store prefixed configuration', async () => {
                const r = new ConfigureRequest();
                const req = mockServerUnaryCall(r);

                r.getVariablesMap().set('plugin-name:config:foo', 'bar');
                r.getVariablesMap().set('plugin-name:config:foobar', 'baz');
                r.getVariablesMap().set('other-name:config:baz', 'bar');

                expect(await configuration.configure(req)).toBeInstanceOf(ConfigureResponse);

                expect(configuration.get('foo')).toBe('bar');
                expect(configuration.get('foobar')).toBe('baz');
                expect(configuration.get('baz')).not.toBeDefined();
            });
        });

        describe('checkConfig', () => {
            it('should return CheckResponse', async () => {
                const r = new CheckRequest();
                const req = mockServerUnaryCall(r);

                r.setNews(Struct.fromJavaScript({}));
                r.setOlds(Struct.fromJavaScript({}));

                expect(await configuration.checkConfig(req)).toBeInstanceOf(CheckResponse);
            });

            it('should set news as inputs', async () => {
                const r = new CheckRequest();
                const req = mockServerUnaryCall(r);

                r.setNews(Struct.fromJavaScript({ foo: 'bar' }));
                r.setOlds(Struct.fromJavaScript({}));

                const response = await configuration.checkConfig(req);
                expect(response.getInputs()?.toJavaScript()).toEqual({ foo: 'bar' });
            });

            it('should add failure on throws CheckFailure', async () => {
                configuration = new ConfigurationImpl('plugin-name', true, () => {
                    const failure = new CheckFailure();
                    failure.setProperty('foobar');
                    failure.setProperty('baz');
                    throw failure;
                });

                const r = new CheckRequest();
                const req = mockServerUnaryCall(r);

                r.setNews(Struct.fromJavaScript({}));
                r.setOlds(Struct.fromJavaScript({}));

                const response = await configuration.checkConfig(req);
                expect(response).toBeInstanceOf(CheckResponse);
                expect(response.getFailuresList().length).toBe(1);
            });

            it('should throw on error', async () => {
                configuration = new ConfigurationImpl('plugin-name', true, () => {
                    throw new Error('err msg');
                });

                const r = new CheckRequest();
                const req = mockServerUnaryCall(r);

                r.setNews(Struct.fromJavaScript({}));
                r.setOlds(Struct.fromJavaScript({}));

                await expect(configuration.checkConfig(req)).rejects.toEqual(new Error('err msg'));
            });
        });

        describe('diffConfig', () => {
            type TestValues = { updating: string; replacing: string };

            beforeEach(() => {
                configuration = new ConfigurationImpl('plugin-name', true, (values: TestValues, olds: TestValues) => {
                    if (values.replacing !== olds.replacing) {
                        return ['replacing'];
                    }
                    if (values.updating !== olds.updating) {
                        return true;
                    }
                    return false;
                });
            });

            it('should return DiffResponse', async () => {
                const r = new DiffRequest();
                const req = mockServerUnaryCall(r);

                r.setNews(Struct.fromJavaScript({}));
                r.setOlds(Struct.fromJavaScript({}));

                expect(await configuration.diffConfig(req)).toBeInstanceOf(DiffResponse);
            });

            it('should return array of replacing properties', async () => {
                const r = new DiffRequest();
                const req = mockServerUnaryCall(r);

                r.setNews(Struct.fromJavaScript({ updating: 'foobar', replacing: 'foo' }));
                r.setOlds(Struct.fromJavaScript({ updating: 'foobar', replacing: 'bar' }));

                const response = await configuration.diffConfig(req);
                expect(response.getReplacesList()).toEqual(['replacing']);
                expect(response.getChanges()).toEqual(DiffResponse.DiffChanges.DIFF_SOME);
            });

            it('should return true on updating properties', async () => {
                const r = new DiffRequest();
                const req = mockServerUnaryCall(r);

                r.setNews(Struct.fromJavaScript({ updating: 'foobar', replacing: 'foo' }));
                r.setOlds(Struct.fromJavaScript({ updating: 'bar', replacing: 'foo' }));

                const response = await configuration.diffConfig(req);
                expect(response.getReplacesList()).toEqual([]);
                expect(response.getChanges()).toEqual(DiffResponse.DiffChanges.DIFF_SOME);
            });

            it('should return false on no changes', async () => {
                const r = new DiffRequest();
                const req = mockServerUnaryCall(r);

                r.setNews(Struct.fromJavaScript({ updating: 'foobar', replacing: 'foo' }));
                r.setOlds(Struct.fromJavaScript({ updating: 'foobar', replacing: 'foo' }));

                const response = await configuration.diffConfig(req);
                expect(response.getReplacesList()).toEqual([]);
                expect(response.getChanges()).toEqual(DiffResponse.DiffChanges.DIFF_NONE);
            });

            it('should throw on error', async () => {
                configuration = new ConfigurationImpl('plugin-name', true, () => {
                    throw new Error('err msg');
                });

                const r = new DiffRequest();
                const req = mockServerUnaryCall(r);

                r.setNews(Struct.fromJavaScript({}));
                r.setOlds(Struct.fromJavaScript({}));

                await expect(configuration.diffConfig(req)).rejects.toEqual(new Error('err msg'));
            });

            it('should set DIFF_UNKNOWN on missing validator function', async () => {
                configuration = new ConfigurationImpl('plugin-name', true);

                const r = new DiffRequest();
                const req = mockServerUnaryCall(r);

                r.setNews(Struct.fromJavaScript({}));
                r.setOlds(Struct.fromJavaScript({}));

                const response = await configuration.diffConfig(req);
                expect(response.getReplacesList()).toEqual([]);
                expect(response.getChanges()).toEqual(DiffResponse.DiffChanges.DIFF_UNKNOWN);
            });
        });

        describe('Map interface', () => {
            it('should set and get values', () => {
                expect(configuration.get('foobar')).toBeUndefined();
                configuration.set('foobar', 'baz');
                expect(configuration.get('foobar')).toBe('baz');
            });

            it('should return required value', () => {
                configuration.set('foobar', 'baz');
                expect(configuration.require('foobar')).toBe('baz');
            });

            it('should throw on missing required value', () => {
                expect(() => configuration.require('foobar')).toThrow(new Error('Required config value "foobar" missing'));
            });

            it('should be iterable', () => {
                configuration.set('foo', 'bar');
                configuration.set('foobar', 'baz');

                expect(configuration[Symbol.iterator]).toBeInstanceOf(Function);
                expect([...configuration]).toEqual([
                    ['foo', 'bar'],
                    ['foobar', 'baz']
                ]);
            });
        });
    });
});
