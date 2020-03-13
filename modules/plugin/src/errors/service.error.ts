import { Metadata, ServiceError as IServiceError, status } from 'grpc';

export class ServiceError extends Error implements IServiceError {
    static wrap(error: Error, code: status = status.UNKNOWN, metadata?: Metadata, details?: string) {
        return Object.assign(new ServiceError(error.message, code, metadata, details), { error });
    }

    constructor(message: string, public readonly code?: status, public readonly metadata?: Metadata, public readonly details?: string) {
        super(message);
        if(null == code) delete (this as { code: any }).code;
        if(null == metadata) delete (this as { metadata: any }).metadata;
        if(null == details) delete (this as { details: any }).details;
    }
}