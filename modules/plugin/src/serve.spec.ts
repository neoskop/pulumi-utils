import { Server } from 'grpc';
import { ObjectWritableMock } from 'stream-mock';
import { serve } from './serve';

describe('serve', () => {
    it('should throw on missing host arg', () => {
        expect(serve([], () => null!, { stdout: false })).rejects.toThrow(new Error('Missing argument for host RPC'));
    });

    it('should return started server and port', async () => {
        const stdout = new ObjectWritableMock({ objectMode: true });
        const { server, port } = await serve(['0.0.0.0:0'], () => ({} as any), { stdout });

        expect(server).toBeInstanceOf(Server);
        expect((server as any).started).toBeTruthy();
        expect(port).toBeGreaterThanOrEqual(1024);
        expect(port).toBeLessThanOrEqual(49151);
        expect(stdout.data).toEqual([`${port}\n`]);

        server.forceShutdown();
    });
});
