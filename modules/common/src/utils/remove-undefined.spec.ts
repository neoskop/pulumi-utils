import { removeUndefined } from './remove-undefined';

describe('utils / remove-undefined', () => {
    it('should return undefined values from object', () => {
        expect(removeUndefined({ foo: 'bar', foobar: undefined })).toEqual({ foo: 'bar' });
    });

    it('should return undefined values from nested object', () => {
        expect(removeUndefined({ top: { foo: 'bar', foobar: undefined } })).toEqual({ top: { foo: 'bar' } });
    });

    it('should return undefined values from nested object in array', () => {
        expect(removeUndefined({ top: [{ foo: 'bar', foobar: undefined }] })).toEqual({ top: [{ foo: 'bar' }] });
    });

    it('should return undefined values from array', () => {
        expect(removeUndefined({ top: [undefined, { foo: 'bar' }] })).toEqual({ top: [{ foo: 'bar' }] });
    });

    it('should handle scalars in arrays', () => {
        expect(removeUndefined({ arr: ['foobar'] })).toEqual({ arr: ['foobar'] });
    });

    it('should throw on invalid values', () => {
        expect(() => {
            removeUndefined({ date: new Date() });
        }).toThrow(/invalid value/i);
    });
});
