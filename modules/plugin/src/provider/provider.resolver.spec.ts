import 'reflect-metadata';
import { InvokeRequest } from '@pulumi-utils/grpc';
import { ServerUnaryCall } from 'grpc';

import { RequestWithUrn } from './provider.interface';
import { ProviderResolver, ProviderResolverImpl } from './provider.resolver';
import { mockServerUnaryCall } from '@pulumi-utils/grpc/src/testing';
import { InvalidTokError } from '@pulumi-utils/common';

class ProviderByKind {
    kind = 'kind-provider';
}

class ProviderByCanHandle {
    canHandle(request: ServerUnaryCall<RequestWithUrn | InvokeRequest>) {
        return true;
    }
}

describe('provider / provider.resolver', () => {
    describe('ProviderResolverImpl', () => {
        let resolver: ProviderResolverImpl;
        beforeEach(() => {
            resolver = new ProviderResolverImpl([new ProviderByKind(), new ProviderByCanHandle()] as any[]);
        });

        it('should be instanceof ProviderResolver', () => {
            expect(resolver).toBeInstanceOf(ProviderResolver);
        });

        it('should handle urn request', () => {
            const req = mockServerUnaryCall({
                getUrn() {
                    return 'urn:pulumi:stack-name::project-name::plugin-name:kind-provider:KindProvider::resource-name';
                }
            } as RequestWithUrn);

            expect(resolver.resolve(req)).toBeInstanceOf(ProviderByKind);
        });

        it('should handle tok request', () => {
            const req = mockServerUnaryCall({
                getTok() {
                    return 'plugin-name:kind-provider:KindProvider';
                }
            } as InvokeRequest);

            expect(resolver.resolve(req)).toBeInstanceOf(ProviderByKind);
        });

        it('should handle request via canHandle method', () => {
            const req = mockServerUnaryCall({} as any);

            expect(resolver.resolve(req)).toBeInstanceOf(ProviderByCanHandle);
        });

        it('should throw on invalid urn', () => {
            const req = mockServerUnaryCall({
                getUrn() {
                    return 'urn:pulumi:stack-name::project-name::not-valid-tok::resource-name';
                }
            } as RequestWithUrn);

            expect(() => resolver.resolve(req)).toThrow(new InvalidTokError('not-valid-tok'));
        });

        it('should return undefined on unknwon resolver', () => {
            resolver = new ProviderResolverImpl([new ProviderByKind()] as any[]);
            const req = mockServerUnaryCall({
                getUrn() {
                    return 'urn:pulumi:stack-name::project-name::plugin-name:some-provider:KindProvider::resource-name';
                }
            } as RequestWithUrn);

            expect(resolver.resolve(req)).not.toBeDefined();
        });
    });
});
