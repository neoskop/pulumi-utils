import { ServiceError } from "./service.error"
import { status } from 'grpc';

describe('errors / service.error', () => {
    it('should be instanceof Error', () => {
        expect(new ServiceError('foo')).toBeInstanceOf(Error);
    });

    it('should be instanceof ServiceError', () => {
        expect(new ServiceError('foo')).toBeInstanceOf(ServiceError);
    });

    it('should have provided values', () => {
        const metadata = {};
        const error = new ServiceError('msg', status.INTERNAL, metadata as any, 'details');

        expect(error.message).toBe('msg');
        expect(error.code).toBe(status.INTERNAL);
        expect(error.metadata).toBe(metadata);
        expect(error.details).toBe('details');
    });

    it('should not have not provided values', () => {
        const error = new ServiceError('msg');

        expect(error.message).toBe('msg');
        expect(error).not.toHaveProperty('code');
        expect(error).not.toHaveProperty('metadata');
        expect(error).not.toHaveProperty('details');
    });

    describe('wrap', () => {
        it('should wrap given error', () => {
            const error = new Error('msg');
            const serviceError = ServiceError.wrap(error);

            expect(serviceError).toBeInstanceOf(ServiceError);
        });

        it('should use default code', () => {
            const error = new Error('msg');
            const serviceError = ServiceError.wrap(error);

            expect(serviceError.code).toBe(status.UNKNOWN);
        });

        it('should use provided code', () => {
            const error = new Error('msg');
            const serviceError = ServiceError.wrap(error, status.INTERNAL);

            expect(serviceError.code).toBe(status.INTERNAL);
        });
    })
})