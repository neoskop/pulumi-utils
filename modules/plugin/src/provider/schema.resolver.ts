import { GetSchemaResponse } from '@pulumi-utils/grpc';
import { Inject, Injectable } from 'injection-js';

import { SCHEMA } from './tokens';

export abstract class SchemaResolver {
    abstract getSchema(): GetSchemaResponse.AsObject;
}

@Injectable()
export class SchemaResolverImpl extends SchemaResolver {
    constructor(@Inject(SCHEMA) protected readonly schema: GetSchemaResponse.AsObject) {
        super();
    }

    getSchema() {
        return this.schema;
    }
}
