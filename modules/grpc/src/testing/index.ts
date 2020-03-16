import { ServerUnaryCall, Metadata } from 'grpc';
import { EventEmitter } from 'events';

export function mockServerUnaryCall<R>(request: R, metadata = new Metadata()): ServerUnaryCall<R> {
    /* istanbul ignore next */
    return new (class extends EventEmitter {
        request = request;
        cancelled = false;
        metadata = metadata;
        getPeer() {
            return '';
        }
        sendMetadata() {}
    })();
}
