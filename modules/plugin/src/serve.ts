import { IResourceProviderServer, ResourceProviderService, EngineClient } from '@pulumi-utils/grpc';
import { Server, ServerCredentials, credentials } from 'grpc';
import { promisify } from 'util';
import { Writable } from 'stream';

export type ResourceProviderFactory = (host: EngineClient) => IResourceProviderServer;

export async function serve(
    args: string[],
    providerFactory: ResourceProviderFactory,
    /* istanbul ignore next */ { stdout = process.stdout }: { stdout?: Writable | false } = {}
) {
    if (1 !== args.length) {
        throw new Error('Missing argument for host RPC');
    }

    const host = new EngineClient(args[0], credentials.createInsecure());

    const server = new Server();
    server.addService(ResourceProviderService, providerFactory(host));

    const port = await promisify(server.bindAsync.bind(server))('0.0.0.0:0', ServerCredentials.createInsecure());

    stdout && stdout.write(`${port}\n`);

    server.start();

    return { server, port };
}
