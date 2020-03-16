import { SchemaResolver } from '../schema.resolver';

export class SchemaResolverMock implements SchemaResolver {
    getSchema = jest.fn();
}

export const SchemaResolverImpl = jest.fn().mockImplementation(function() {
    return new SchemaResolverMock();
});
