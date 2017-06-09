import { TypeKind } from 'graphql';
import { buildApolloArgs, buildArgs, buildFields, getArgType } from './buildQuery';

describe('getArgType', () => {
    it('returns the arg type name', () => {
        expect(getArgType({ type: { kind: TypeKind.SCALAR, name: 'foo' } })).toEqual('foo');
    });
    it('returns the arg type name for NON_NULL types', () => {
        expect(getArgType({ type: { kind: TypeKind.NON_NULL, ofType: { name: 'foo' } } })).toEqual('foo!');
    });
});

describe('buildArgs', () => {
    it('returns an empty array when query does not have any arguments', () => {
        expect(buildArgs({ args: [] })).toEqual({});
    });

    it('returns an array of args correctly filtered when query has arguments', () => {
        expect(buildArgs({ args: [{ name: 'foo' }, { name: 'bar' }] }, { foo: 'foo_value' })).toEqual({ foo: '$foo' });
    });
});

describe('buildApolloArgs', () => {
    it('returns an empty array when query does not have any arguments', () => {
        expect(buildApolloArgs({ args: [] })).toEqual({});
    });

    it('returns an array of args correctly filtered when query has arguments', () => {
        expect(
            buildApolloArgs(
                {
                    args: [
                        {
                            name: 'foo',
                            type: { kind: TypeKind.NON_NULL, ofType: { kind: TypeKind.SCALAR, name: 'Int' } },
                        },
                        {
                            name: 'barId',
                            type: { kind: TypeKind.SCALAR },
                        },
                        {
                            name: 'barIds',
                            type: { kind: TypeKind.SCALAR },
                        },
                        { name: 'bar' },
                    ],
                },
                { foo: 'foo_value', barId: 100, barIds: [101, 102] },
            ),
        ).toEqual({ $foo: 'Int!', $barId: 'ID!', $barIds: '[ID!]!' });
    });
});

describe('buildFields', () => {
    it('returns an object with the fields to retrieve', () => {
        const introspectionResults = {
            resources: [{ type: { name: 'resourceType' } }],
            types: [
                {
                    name: 'linkedType',
                    fields: [{ name: 'foo', type: { kind: TypeKind.SCALAR, name: 'bar' } }],
                },
            ],
        };

        const fields = [
            { type: { kind: TypeKind.SCALAR, name: '' }, name: 'foo' },
            { type: { kind: TypeKind.SCALAR, name: '_foo' }, name: 'foo1' },
            { type: { kind: TypeKind.OBJECT, name: 'linkedType' }, name: 'linked' },
            { type: { kind: TypeKind.OBJECT, name: 'resourceType' }, name: 'resource' },
        ];

        expect(buildFields(introspectionResults)(fields)).toEqual({
            foo: {},
            linked: {
                fields: { foo: {} },
            },
            resource: {
                fields: { id: {} },
            },
        });
    });
});
