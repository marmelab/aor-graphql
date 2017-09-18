import { getAorClient } from './index';
import { GET_LIST, GET_ONE, GET_MANY, GET_MANY_REFERENCE, CREATE, UPDATE, DELETE } from './constants';

describe('aorClient', () => {
    const client = {
        query: jest.fn(() => Promise.resolve('response')),
        mutate: jest.fn(() => Promise.resolve('response')),
    };

    const parseResponse = jest.fn(() => 'parsed response');

    const buildQuery = jest.fn(() => ({
        query: 'query',
        variables: 'variables',
        parseResponse,
        anotherApolloOption: 'anotherApolloOption',
    }));

    it('calls buildQuery with the same arguments the aorClient received', async () => {
        const aorClient = getAorClient({ buildQuery, client, options: {} });
        await aorClient(GET_ONE, 'posts', { filter: 'foo' });

        expect(buildQuery).toHaveBeenCalledWith(GET_ONE, 'posts', { filter: 'foo' });
    });

    [GET_LIST, GET_ONE, GET_MANY, GET_MANY_REFERENCE].forEach(aorFetchType => {
        it(`calls the ApolloClient.query method with the result of buildQuery expect parseResonse, when aor fetch type is ${aorFetchType}`, async () => {
            const aorClient = getAorClient({ buildQuery, client, options: {} });
            await aorClient(aorFetchType, 'posts', { filter: 'foo' });

            expect(client.query).toHaveBeenCalledWith({
                query: 'query',
                variables: 'variables',
                anotherApolloOption: 'anotherApolloOption',
            });
        });
    });

    [CREATE, UPDATE, DELETE].forEach(aorFetchType => {
        it(`calls the ApolloClient.mutate method with the result of buildQuery expect parseResonse, when aor fetch type is ${aorFetchType}`, async () => {
            const aorClient = getAorClient({ buildQuery, client, options: {} });
            await aorClient(aorFetchType, 'posts', { filter: 'foo' });

            expect(client.mutate).toHaveBeenCalledWith({
                mutation: 'query',
                variables: 'variables',
                anotherApolloOption: 'anotherApolloOption',
            });
        });
    });

    it('returns the parsed response', async () => {
        const aorClient = getAorClient({ buildQuery, client, options: {} });
        const result = await aorClient(GET_ONE, 'posts', { filter: 'foo' });

        expect(parseResponse).toHaveBeenCalledWith('response');
        expect(result).toEqual('parsed response');
    });

    it(`calls the ApolloClient.query method with the overriden query when specified`, async () => {
        const overridenParseResponse = jest.fn(() => 'overriden parsed response');

        const aorClient = getAorClient({
            buildQuery,
            client,
            options: {
                override: {
                    posts: {
                        [GET_ONE]: jest.fn(() => ({
                            query: 'overriden query',
                            variables: 'overriden variables',
                            parseResponse: overridenParseResponse,
                            yetAnotherApolloOption: 'yetAnotherApolloOption',
                        })),
                    },
                },
            },
        });
        const result = await aorClient(GET_ONE, 'posts', { filter: 'foo' });

        expect(client.query).toHaveBeenCalledWith({
            query: 'overriden query',
            variables: 'overriden variables',
            anotherApolloOption: 'anotherApolloOption',
            yetAnotherApolloOption: 'yetAnotherApolloOption',
        });

        expect(result).toEqual('overriden parsed response');
    });
});
