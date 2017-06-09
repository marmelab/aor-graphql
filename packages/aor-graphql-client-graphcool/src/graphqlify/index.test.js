import graphqlify, { encodeQuery, encodeMutation, Fragment } from './';

describe('graphqlify', function() {
    it('should encode a simple field', function() {
        const out = graphqlify({ a: 1 });
        expect(out).toEqual('{a}');
    });

    it('should encode multiple fields', function() {
        const out = graphqlify({ a: 1, b: true, c: {}, d: null });
        expect(out).toEqual('{a,b,c}');
    });

    it('should encode field with a label', function() {
        const out = graphqlify({ a: { field: 'b' } });
        expect(out).toEqual('{a:b}');
    });

    it('should encode a field with nested fields', function() {
        const out = graphqlify({ a: { fields: { b: { fields: { c: 1 } } } } });
        expect(out).toEqual('{a{b{c}}}');
    });

    it('should encode field with parameter', function() {
        const out = graphqlify({ a: { params: { b: 'c' } } });
        expect(out).toEqual('{a(b:c)}');
    });

    it('should encode a field with params and nested fields', function() {
        const out = graphqlify({ a: { params: { b: 'c' }, fields: { d: 1 } } });
        expect(out).toEqual('{a(b:c){d}}');
    });

    it('should encode a field with a fragment', function() {
        const frag = Fragment({
            name: 'fragname',
            type: 'FragType',
            fields: { b: 1 },
        });
        const out = graphqlify({ a: { fragments: [frag] } });
        expect(out).toEqual('{a{...fragname}},fragment fragname on FragType{b}');
    });

    it('should encode a field with 2 fragments', function() {
        const frag1 = Fragment({
            name: 'fragname1',
            type: 'FragType1',
            fields: { b: 1 },
        });
        const frag2 = Fragment({
            name: 'fragname2',
            type: 'FragType2',
            fields: { c: 1 },
        });
        const out = graphqlify({ a: { fragments: [frag1, frag2] } });
        expect(out).toEqual(
            '{a{...fragname1,...fragname2}},fragment fragname1 on FragType1{b},fragment fragname2 on FragType2{c}',
        );
    });

    it('should encode a field with nested fragments', function() {
        const frag2 = Fragment({
            name: 'fragname2',
            type: 'FragType2',
            fields: { b: 1 },
        });
        const frag1 = Fragment({
            name: 'fragname1',
            type: 'FragType1',
            fragments: [frag2],
        });
        const out = graphqlify({ a: { fragments: [frag1] } });
        expect(out).toEqual(
            '{a{...fragname1}},fragment fragname1 on FragType1{...fragname2},fragment fragname2 on FragType2{b}',
        );
    });
});

describe('encodeQuery', function() {
    it('should encode a graphql query', function() {
        const out = encodeQuery({ a: 1 });
        expect(out).toEqual('query{a}');
    });

    it('should encode a named graphql query', function() {
        const out = encodeQuery('q1', { a: 1 });
        expect(out).toEqual('query q1{a}');
    });
});

describe('encodeMutation', function() {
    it('should encode a graphql mutation', function() {
        const out = encodeMutation({ a: 1 });
        expect(out).toEqual('mutation{a}');
    });

    it('should encode a named graphql mutation', function() {
        const out = encodeMutation('m1', { a: 1 });
        expect(out).toEqual('mutation m1{a}');
    });
});
