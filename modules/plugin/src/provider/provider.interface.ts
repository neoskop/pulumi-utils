import {
    CheckRequest,
    CheckResponse,
    ConfigureRequest,
    CreateRequest,
    CreateResponse,
    DeleteRequest,
    DiffRequest,
    DiffResponse,
    InvokeRequest,
    InvokeResponse,
    ReadRequest,
    ReadResponse,
    UpdateRequest,
    UpdateResponse
} from '@neoskop/pulumi-utils-grpc';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { ServerUnaryCall, ServerWritableStream } from 'grpc';
import { Observable } from 'rxjs';

export type RequestWithUrn = CheckRequest | DiffRequest | CreateRequest | ReadRequest | UpdateRequest | DeleteRequest;

export interface IProvider {
    kind?: string;
    canHandle?(request: ServerUnaryCall<RequestWithUrn | InvokeRequest>): Promise<boolean> | boolean;

    // getSchema?(request: ServerUnaryCall<GetSchemaRequest>): Promise<GetSchemaResponse> | GetSchemaResponse;
    // checkConfig?(request: ServerUnaryCall<CheckRequest>): Promise<CheckResponse> | CheckResponse;
    // diffConfig?(request: ServerUnaryCall<DiffRequest>): Promise<DiffResponse> | DiffResponse;
    // configure?(request: ServerUnaryCall<ConfigureRequest>): Promise<void> | void;
    invoke?(request: ServerUnaryCall<InvokeRequest>): Promise<InvokeResponse> | InvokeResponse;
    streamInvoke?(request: ServerWritableStream<InvokeRequest>): Observable<InvokeResponse>;

    check(request: ServerUnaryCall<CheckRequest>): Promise<CheckResponse> | CheckResponse;
    diff(request: ServerUnaryCall<DiffRequest>): Promise<DiffResponse> | DiffResponse;
    create(request: ServerUnaryCall<CreateRequest>): Promise<CreateResponse> | CreateResponse;
    read(request: ServerUnaryCall<ReadRequest>): Promise<ReadResponse> | ReadResponse;
    update(request: ServerUnaryCall<UpdateRequest>): Promise<UpdateResponse> | UpdateResponse;
    delete(request: ServerUnaryCall<DeleteRequest>): Promise<void> | void;
    cancel(request: ServerUnaryCall<Empty>): Promise<void> | void;
    // getPluginInfo(request: ServerUnaryCall<void>): Promise<PluginInfo> | PluginInfo;
}
