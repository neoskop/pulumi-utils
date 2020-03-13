import { Urn, InvalidUrnError } from './urn';

describe('utils / urn', () => {
    describe('parse', () => {
        it('should throw on invalid urn', () => {
            expect(() => {
                Urn.parse('invalid::tok');
            }).toThrow(new InvalidUrnError('invalid::tok'));
        });

        it('should parse urn', () => {
            expect(Urn.parse('urn:pulumi:stack-name::project-name::foobar:grp:id::resource-name')).toEqual({
                namespace: 'pulumi',
                stack: 'stack-name',
                project: 'project-name',
                type: {
                    raw: 'foobar:grp:id',
                    parents: [],
                    resource: {
                        raw: 'foobar:grp:id',
                        plugin: 'foobar',
                        kind: 'grp',
                        name: 'id'
                    }
                },
                name: 'resource-name'
            });
        });

        it('should parse urn with single parent', () => {
            expect(Urn.parse('urn:pulumi:stack-name::project-name::parent:pgrp:pid$foobar:grp:id::resource-name')).toEqual({
                namespace: 'pulumi',
                stack: 'stack-name',
                project: 'project-name',
                type: {
                    raw: 'parent:pgrp:pid$foobar:grp:id',
                    parents: [
                        {
                            raw: 'parent:pgrp:pid',
                            plugin: 'parent',
                            kind: 'pgrp',
                            name: 'pid'
                        }
                    ],
                    resource: {
                        raw: 'foobar:grp:id',
                        plugin: 'foobar',
                        kind: 'grp',
                        name: 'id'
                    }
                },
                name: 'resource-name'
            });
        });

        it('should parse urn with multiple parents', () => {
            expect(
                Urn.parse('urn:pulumi:stack-name::project-name::parent1:p1grp:p1id$parent2:p2grp:p2id$foobar:grp:id::resource-name')
            ).toEqual({
                namespace: 'pulumi',
                stack: 'stack-name',
                project: 'project-name',
                type: {
                    raw: 'parent1:p1grp:p1id$parent2:p2grp:p2id$foobar:grp:id',
                    parents: [
                        {
                            raw: 'parent1:p1grp:p1id',
                            plugin: 'parent1',
                            kind: 'p1grp',
                            name: 'p1id'
                        },
                        {
                            raw: 'parent2:p2grp:p2id',
                            plugin: 'parent2',
                            kind: 'p2grp',
                            name: 'p2id'
                        }
                    ],
                    resource: {
                        raw: 'foobar:grp:id',
                        plugin: 'foobar',
                        kind: 'grp',
                        name: 'id'
                    }
                },
                name: 'resource-name'
            });
        });

        it('should handle non parsable types', () => {
            expect(Urn.parse('urn:pulumi:stack-name::project-name::parent-pgrp-pid$foobar-grp-id::resource-name')).toEqual({
                namespace: 'pulumi',
                stack: 'stack-name',
                project: 'project-name',
                type: {
                    raw: 'parent-pgrp-pid$foobar-grp-id',
                    parents: [
                        {
                            raw: 'parent-pgrp-pid'
                        }
                    ],
                    resource: {
                        raw: 'foobar-grp-id'
                    }
                },
                name: 'resource-name'
            });
        });
    });
});
