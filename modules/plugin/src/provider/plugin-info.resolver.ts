import { PluginInfo } from '@pulumi-utils/grpc';
import { Inject, Injectable } from 'injection-js';

import { PLUGIN_INFO } from './tokens';

export abstract class PluginInfoResolver {
    abstract getPluginInfo(): PluginInfo.AsObject;
}

@Injectable()
export class PluginInfoResolverImpl extends PluginInfoResolver {
    constructor(@Inject(PLUGIN_INFO) protected readonly pluginInfo: PluginInfo.AsObject) {
        super();
    }

    getPluginInfo() {
        return this.pluginInfo;
    }
}
