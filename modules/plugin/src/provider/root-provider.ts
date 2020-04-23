import {
    CheckRequest,
    CheckResponse,
    ConfigureRequest,
    ConfigureResponse,
    CreateRequest,
    CreateResponse,
    DeleteRequest,
    DiffRequest,
    DiffResponse,
    GetSchemaRequest,
    GetSchemaResponse,
    InvokeRequest,
    InvokeResponse,
    IResourceProviderServer,
    PluginInfo,
    ReadRequest,
    ReadResponse,
    UpdateRequest,
    UpdateResponse
} from '@pulumi-utils/grpc';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { sendUnaryData, ServerUnaryCall, ServerWritableStream, status } from 'grpc';
import { Inject, Injectable, Optional } from 'injection-js';

import { ServiceError } from '../errors';
import { Configuration } from './configuration';
import { PluginInfoResolver } from './plugin-info.resolver';
import { IProvider } from './provider.interface';
import { ProviderResolver } from './provider.resolver';
import { SchemaResolver } from './schema.resolver';
import { PROVIDERS } from './tokens';

@Injectable()
export class RootProvider implements IResourceProviderServer {
    constructor(
        @Inject(PROVIDERS) protected readonly providers: IProvider[],
        protected readonly providerResolver: ProviderResolver,
        protected readonly pluginInfoResolver: PluginInfoResolver,
        protected readonly configuration: Configuration,
        @Optional() protected readonly schemaResolver?: SchemaResolver
    ) {}

    getPluginInfo(req: ServerUnaryCall<unknown>, callback: sendUnaryData<PluginInfo>) {
        try {
            const pluginInfo = new PluginInfo();
            pluginInfo.setVersion(this.pluginInfoResolver.getPluginInfo().version);
            callback(null, pluginInfo);
        } catch (e) {
            callback(ServiceError.ensure(e), null);
        }
    }

    getSchema(req: ServerUnaryCall<GetSchemaRequest>, callback: sendUnaryData<GetSchemaResponse>) {
        if (this.schemaResolver) {
            try {
                const response = new GetSchemaResponse();
                response.setSchema(this.schemaResolver.getSchema().schema);
                callback(null, response);
            } catch (e) {
                callback(ServiceError.ensure(e), null);
            }
        } else {
            callback(new ServiceError('not implemented', status.UNIMPLEMENTED), null);
        }
    }

    async checkConfig(req: ServerUnaryCall<CheckRequest>, callback: sendUnaryData<CheckResponse>) {
        try {
            callback(null, await this.configuration.checkConfig(req));
        } catch (e) {
            callback(ServiceError.ensure(e), null);
        }
    }

    async diffConfig(req: ServerUnaryCall<DiffRequest>, callback: sendUnaryData<DiffResponse>) {
        try {
            callback(null, await this.configuration.diffConfig(req));
        } catch (e) {
            callback(ServiceError.ensure(e), null);
        }
    }

    async configure(req: ServerUnaryCall<ConfigureRequest>, callback: sendUnaryData<ConfigureResponse>) {
        try {
            callback(null, await this.configuration.configure(req));
        } catch (e) {
            callback(ServiceError.ensure(e), null);
        }
    }

    async invoke(req: ServerUnaryCall<InvokeRequest>, callback: sendUnaryData<InvokeResponse>) {
        const provider = this.providerResolver.resolve(req);

        if (provider && provider.invoke) {
            try {
                callback(null, await provider.invoke(req));
            } catch (e) {
                callback(ServiceError.ensure(e), null);
            }
        } else {
            callback(new ServiceError('not implemented', status.UNIMPLEMENTED), null);
        }
    }

    /**
     *
     * @TODO: implement & test
     */
    /* istanbul ignore next */
    streamInvoke(req: ServerWritableStream<InvokeRequest>) {
        const provider = this.providerResolver.resolve(req);

        if (provider && provider.streamInvoke) {
            provider.streamInvoke(req).subscribe(res => req.write(res));
        } else {
            req.emit('error', new ServiceError('not implemented', status.UNIMPLEMENTED));
        }
    }

    async check(req: ServerUnaryCall<CheckRequest>, callback: sendUnaryData<CheckResponse>) {
        const provider = this.providerResolver.resolve(req);

        if (provider && provider.check) {
            try {
                callback(null, await provider.check(req));
            } catch (e) {
                callback(ServiceError.ensure(e), null);
            }
        } else {
            callback(new ServiceError('not implemented', status.UNIMPLEMENTED), null);
        }
    }

    async diff(req: ServerUnaryCall<DiffRequest>, callback: sendUnaryData<DiffResponse>) {
        const provider = this.providerResolver.resolve(req);

        if (provider && provider.diff) {
            try {
                callback(null, await provider.diff(req));
            } catch (e) {
                callback(ServiceError.ensure(e), null);
            }
        } else {
            callback(new ServiceError('not implemented', status.UNIMPLEMENTED), null);
        }
    }

    async create(req: ServerUnaryCall<CreateRequest>, callback: sendUnaryData<CreateResponse>) {
        const provider = this.providerResolver.resolve(req);

        if (provider && provider.create) {
            try {
                callback(null, await provider.create(req));
            } catch (e) {
                callback(ServiceError.ensure(e), null);
            }
        } else {
            callback(new ServiceError('not implemented', status.UNIMPLEMENTED), null);
        }
    }

    async read(req: ServerUnaryCall<ReadRequest>, callback: sendUnaryData<ReadResponse>) {
        const provider = this.providerResolver.resolve(req);

        if (provider && provider.read) {
            try {
                callback(null, await provider.read(req));
            } catch (e) {
                callback(ServiceError.ensure(e), null);
            }
        } else {
            callback(new ServiceError('not implemented', status.UNIMPLEMENTED), null);
        }
    }

    async update(req: ServerUnaryCall<UpdateRequest>, callback: sendUnaryData<UpdateResponse>) {
        const provider = this.providerResolver.resolve(req);

        if (provider && provider.update) {
            try {
                callback(null, await provider.update(req));
            } catch (e) {
                callback(ServiceError.ensure(e), null);
            }
        } else {
            callback(new ServiceError('not implemented', status.UNIMPLEMENTED), null);
        }
    }

    async delete(req: ServerUnaryCall<DeleteRequest>, callback: sendUnaryData<Empty>) {
        const provider = this.providerResolver.resolve(req);

        if (provider && provider.delete) {
            try {
                await provider.delete(req);
                callback(null, new Empty());
            } catch (e) {
                callback(ServiceError.ensure(e), null);
            }
        } else {
            callback(new ServiceError('not implemented', status.UNIMPLEMENTED), null);
        }
    }

    async cancel(req: ServerUnaryCall<Empty>, callback: sendUnaryData<Empty>) {
        try {
            for (const provider of this.providers) {
                await provider.cancel?.(req);
            }
            callback(null, new Empty());
        } catch (e) {
            callback(ServiceError.ensure(e), null);
        }
    }
}
