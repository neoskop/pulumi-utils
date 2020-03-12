import * as util from 'util';

export class Tok {
    static readonly TOK_REGEXP = /^(.+):(.+):(.+)$/;

    static parse(tok: string): Tok.Parsed {
        const match = Tok.TOK_REGEXP.exec(tok);

        if (!match) {
            throw new InvalidTokError(tok);
        }

        return {
            plugin: match[1],
            group: match[2],
            identifier: match[3]
        };
    }

    static stringify(obj: Tok.Parsed): string;
    static stringify(plugin: string, group: string, identifier: string): string;
    static stringify(pluginOrObject: string | Tok.Parsed, group?: string, identifier?: string): string {
        const plugin = typeof pluginOrObject === 'object' ? pluginOrObject.plugin : pluginOrObject;
        if (typeof pluginOrObject === 'object') {
            ({ group, identifier } = pluginOrObject);
        }

        return util.format('%s:%s:%s', plugin, group, identifier);
    }
}

export namespace Tok {
    export interface Parsed {
        plugin: string;
        group: string;
        identifier: string;
    }
}

export class InvalidTokError extends Error {
    constructor(tok: string) {
        super(`Invalid tok "${tok}"`);
    }
}
