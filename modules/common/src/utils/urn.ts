import { Tok, InvalidTokError } from './tok';

export class Urn {
    static readonly URN_REGEXP = /^urn:pulumi:(.+)::(.+)::(.+)::(.+)$/;

    static parse(urn: string): Urn.Parsed {
        const match = Urn.URN_REGEXP.exec(urn);

        if (!match) {
            throw new InvalidUrnError(urn);
        }

        return {
            namespace: 'pulumi',
            stack: match[1],
            project: match[2],
            type: Urn.parseType(match[3]),
            name: match[4]
        };
    }

    static parseType(raw: string): Urn.ParsedType {
        const parents = raw.split(/\$/).map(raw => {
            try {
                return { raw, ...Tok.parse(raw) };
            } catch (e) {
                /* istanbul ignore else */
                if (e instanceof InvalidTokError) {
                    return { raw };
                }
                /* istanbul ignore next */
                throw e;
            }
        });
        const resource = parents.pop()!;

        return {
            raw,
            parents,
            resource
        };
    }
}

export namespace Urn {
    export interface ParsedTypeTok extends Partial<Tok.Parsed> {
        raw: string;
    }

    export interface ParsedType {
        raw: string;
        parents: ParsedTypeTok[];
        resource: ParsedTypeTok;
    }

    export interface Parsed {
        namespace: 'pulumi';
        stack: string;
        project: string;
        type: ParsedType;
        name: string;
    }
}

export class InvalidUrnError extends Error {
    constructor(urn: string) {
        super(`Invalid urn '${urn}'`);
    }
}
