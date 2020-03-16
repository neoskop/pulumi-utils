import { Metadata, ServiceError as IServiceError, status } from 'grpc';

export class ServiceError extends Error implements IServiceError {
    error?: Error;

    static wrap(error: Error, code: status = status.UNKNOWN, metadata?: Metadata, details?: string) {
        return Object.assign(new ServiceError(error.message, code, metadata, details), { error });
    }

    static ensure(error: ServiceError | Error | string | any): ServiceError {
        if (error instanceof ServiceError) {
            return error;
        } else if (error instanceof Error) {
            return ServiceError.wrap(error);
        } else {
            try {
                return new ServiceError(typeof error === 'string' ? error : error ? JSON.stringify(error) : 'unknown');
            } catch {
                return new ServiceError(error?.toString?.() ?? 'unknown');
            }
        }
    }

    constructor(message: string, public readonly code?: status, public readonly metadata?: Metadata, public readonly details?: string) {
        super(message);
        if (null == code) delete (this as { code: any }).code;
        if (null == metadata) delete (this as { metadata: any }).metadata;
        if (null == details) delete (this as { details: any }).details;
    }
}
