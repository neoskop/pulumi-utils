import 'reflect-metadata';
import { SchemaResolverImpl, SchemaResolver } from './schema.resolver';

describe('provider / schema.resolver', () => {
    describe('SchemaResolverImpl', () => {
        it('should be instance of SchemaResolver', () => {
            expect(new SchemaResolverImpl(null!)).toBeInstanceOf(SchemaResolver);
        });

        it('should return provided schema', () => {
            const schema = { schema: '$schema$' };
            const resolver = new SchemaResolverImpl(schema);

            expect(resolver.getSchema()).toEqual(schema);
        });
    });
});
