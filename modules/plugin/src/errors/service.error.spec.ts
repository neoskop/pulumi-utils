import { ServiceError } from './service.error';
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
    });

    describe('ensure', () => {
        it('should passthrough ServiceError', () => {
            const error = new ServiceError('msg');

            expect(ServiceError.ensure(error)).toBe(error);
        });

        it('should wrapp Error', () => {
            const error = new Error('msg');
            const serviceError = ServiceError.ensure(error);

            expect(serviceError).toBeInstanceOf(ServiceError);
            expect(serviceError.message).toBe(error.message);
            expect(serviceError.error).toBe(error);
        });

        it('should wrap string', () => {
            const serviceError = ServiceError.ensure('error-message');

            expect(serviceError).toBeInstanceOf(ServiceError);
            expect(serviceError.message).toBe('error-message');
            expect(serviceError).not.toHaveProperty('error');
        });

        it('should wrap JSON content', () => {
            const serviceError = ServiceError.ensure({ message: 'msg' });

            expect(serviceError).toBeInstanceOf(ServiceError);
            expect(serviceError.message).toBe('{"message":"msg"}');
            expect(serviceError).not.toHaveProperty('error');
        });

        it('should fallback to toString on JSON stringify error', () => {
            const object: any = {};
            object.object = object;
            const serviceError = ServiceError.ensure(object);

            expect(serviceError).toBeInstanceOf(ServiceError);
            expect(serviceError.message).toBe('[object Object]');
            expect(serviceError).not.toHaveProperty('error');
        });

        it('should fallback to default message on null-like error', () => {
            expect(ServiceError.ensure(null).message).toBe('unknown');
            expect(ServiceError.ensure(undefined).message).toBe('unknown');
        });
    });
});
