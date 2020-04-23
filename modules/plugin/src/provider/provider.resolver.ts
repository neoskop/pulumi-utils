import { Urn, InvalidTokError, Tok } from '@pulumi-utils/common';
import { InvokeRequest } from '@pulumi-utils/grpc';
import { ServerUnaryCall } from 'grpc';
import { Inject, Injectable } from 'injection-js';

import { IProvider, RequestWithUrn } from './provider.interface';
import { PROVIDERS } from './tokens';

export abstract class ProviderResolver {
    abstract resolve(request: ServerUnaryCall<RequestWithUrn | InvokeRequest>): IProvider | undefined;
}

@Injectable()
export class ProviderResolverImpl extends ProviderResolver {
    constructor(@Inject(PROVIDERS) protected readonly providers: IProvider[]) {
        super();
    }

    protected getRequestKind(request: ServerUnaryCall<RequestWithUrn | InvokeRequest>): string | undefined {
        if ('getUrn' in request.request) {
            const urn = Urn.parse(request.request.getUrn());
            if (!urn.type.resource.kind) {
                throw new InvalidTokError(urn.type.resource.raw);
            }
            return urn.type.resource.kind;
        } else if ('getTok' in request.request) {
            const tok = Tok.parse(request.request.getTok());
            return tok.kind;
        }

        return undefined;
    }

    resolve(request: ServerUnaryCall<RequestWithUrn | InvokeRequest>): IProvider | undefined {
        const kind = this.getRequestKind(request);

        for (const provider of this.providers) {
            if (provider.canHandle?.(request) || (kind && provider.kind === kind)) {
                return provider;
            }
        }

        return undefined;
    }
}
