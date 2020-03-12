import * as struct_pb from 'google-protobuf/google/protobuf/struct_pb';
import { Struct } from './struct';

describe('protobuf / Struct', () => {
    it('should originally throw on undefined value', () => {
        expect(() => {
            struct_pb.Struct.fromJavaScript({ foo: undefined } as any);
        }).toThrow(/unexpected struct type/i);
    });
    it('should not throw on undefined value', () => {
        expect(() => {
            Struct.fromJavaScript({ foo: undefined } as any);
        }).not.toThrow();
    });
    it('should convert object', () => {
        expect(Struct.fromJavaScript({ foo: 'bar', foobar: undefined } as any).toJavaScript()).toEqual({ foo: 'bar' });
    });
});
