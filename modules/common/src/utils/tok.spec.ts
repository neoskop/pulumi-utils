import { Tok, InvalidTokError } from './tok';

describe('utils / tok', () => {
    describe('parse', () => {
        it('should throw on invalid tok', () => {
            expect(() => {
                Tok.parse('invalid.tok');
            }).toThrow(new InvalidTokError('invalid.tok'));
        });

        it('should parse tok', () => {
            expect(Tok.parse('foo:bar:foobar')).toEqual({ plugin: 'foo', kind: 'bar', name: 'foobar' });
        });
    });

    describe('stringify', () => {
        it('should stringify by object', () => {
            expect(Tok.stringify({ plugin: 'foo', kind: 'bar', name: 'foobar' })).toEqual('foo:bar:foobar');
        });

        it('should stringify by positional parameters', () => {
            expect(Tok.stringify('foo', 'bar', 'foobar')).toEqual('foo:bar:foobar');
        });
    });
});
