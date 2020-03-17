import {
    CheckRequest,
    CheckResponse,
    ConfigureRequest,
    ConfigureResponse,
    DiffRequest,
    DiffResponse,
    CheckFailure
} from '@neoskop/pulumi-utils-grpc';
import { ServerUnaryCall } from 'grpc';
import { Inject, Injectable, Optional } from 'injection-js';

import { ACCEPT_SECRETS, NAME, CONFIGURATION_VALIDATOR } from './tokens';
import { Struct } from '@neoskop/pulumi-utils-common';

export abstract class Configuration {
    abstract configure(req: ServerUnaryCall<ConfigureRequest>): Promise<ConfigureResponse> | ConfigureResponse;
    abstract checkConfig(req: ServerUnaryCall<CheckRequest>): Promise<CheckResponse> | CheckResponse;
    abstract diffConfig(req: ServerUnaryCall<DiffRequest>): Promise<DiffResponse> | DiffResponse;
    abstract [Symbol.iterator](): IterableIterator<[string, any]>;
    abstract set(key: string, value: any): void;
    abstract get<T = string>(key: string): T | undefined;
    abstract require<T = string>(key: string): T;
}

export type ConfigurationValidator<T extends {} = any> = (values: T, oldValues: T) => Promise<boolean | string[]> | boolean | string[];

@Injectable()
export class ConfigurationImpl extends Configuration {
    private configuration = new Map<string, any>();

    constructor(
        @Inject(NAME) protected readonly name: string,
        @Inject(ACCEPT_SECRETS) protected readonly acceptSecrets: boolean,
        @Inject(CONFIGURATION_VALIDATOR) @Optional() protected readonly configurationValidator?: ConfigurationValidator
    ) {
        super();
    }

    configure(req: ServerUnaryCall<ConfigureRequest>): ConfigureResponse {
        const vars = req.request.getVariablesMap().toArray();

        const prefix = `${this.name}:config:`;

        for (const [key, value] of vars) {
            if (key.startsWith(prefix)) {
                this.set(key.substr(prefix.length), value);
            }
        }

        const response = new ConfigureResponse();
        response.setAcceptsecrets(this.acceptSecrets);
        return response;
    }

    async checkConfig(req: ServerUnaryCall<CheckRequest>): Promise<CheckResponse> {
        const news = req.request.getNews()?.toJavaScript();
        const olds = req.request.getOlds()?.toJavaScript();

        const response = new CheckResponse();

        response.setInputs(Struct.fromJavaScript(news || {}));
        try {
            if (this.configurationValidator) {
                await this.configurationValidator(news as {}, olds as {});
            }
        } catch (e) {
            if (e instanceof CheckFailure) {
                response.addFailures(e);
            } else {
                throw e;
            }
        }
        return response;
    }

    async diffConfig(req: ServerUnaryCall<DiffRequest>): Promise<DiffResponse> {
        const news = req.request.getNews()?.toJavaScript();
        const olds = req.request.getOlds()?.toJavaScript();

        const response = new DiffResponse();

        if (this.configurationValidator) {
            const res = await this.configurationValidator(news as {}, olds as {});

            if (typeof res === 'boolean' && res) {
                response.setChanges(DiffResponse.DiffChanges.DIFF_SOME);
            } else if (Array.isArray(res) && res.length > 0) {
                response.setChanges(DiffResponse.DiffChanges.DIFF_SOME);
                response.setReplacesList(res);
            } else {
                response.setChanges(DiffResponse.DiffChanges.DIFF_NONE);
            }
        } else {
            response.setChanges(DiffResponse.DiffChanges.DIFF_UNKNOWN);
        }
        return response;
    }

    [Symbol.iterator]() {
        return this.configuration[Symbol.iterator]();
    }

    set(key: string, value: any) {
        this.configuration.set(key, value);
    }

    get<T = string>(key: string): T | undefined {
        return this.configuration.get(key);
    }

    require<T = string>(key: string): T {
        const value = this.get<T>(key);

        if (!value) {
            throw new Error(`Required config value "${key}" missing`);
        }

        return value;
    }
}
