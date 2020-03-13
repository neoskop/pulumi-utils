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
            kind: match[2],
            name: match[3]
        };
    }

    static stringify(obj: Tok.Parsed): string;
    static stringify(plugin: string, kind: string, name: string): string;
    static stringify(pluginOrObject: string | Tok.Parsed, kind?: string, name?: string): string {
        const plugin = typeof pluginOrObject === 'object' ? pluginOrObject.plugin : pluginOrObject;
        if (typeof pluginOrObject === 'object') {
            ({ kind, name } = pluginOrObject);
        }

        return util.format('%s:%s:%s', plugin, kind, name);
    }
}

export namespace Tok {
    export interface Parsed {
        plugin: string;
        kind: string;
        name: string;
    }
}

export class InvalidTokError extends Error {
    constructor(tok: string) {
        super(`Invalid tok "${tok}"`);
    }
}
