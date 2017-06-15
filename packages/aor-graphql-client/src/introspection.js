import { introspectionQuery } from 'graphql';
import gql from 'graphql-tag';

import { GET_LIST, GET_ONE, ALL_TYPES } from './constants';

export const filterTypesByIncludeExclude = ({ include, exclude }) => {
    if (include) {
        if (Array.isArray(include)) {
            return type => include.includes(type.name);
        }

        if (typeof include === 'function') {
            return type => include(type);
        }
    }

    if (exclude) {
        if (Array.isArray(exclude)) {
            return type => !exclude.includes(type.name);
        }

        if (typeof exclude === 'function') {
            return type => !exclude(type);
        }
    }

    return () => true;
};

/**
 * @param {ApolloClient} client The Apollo client
 * @param {Object} options The introspection options
 */
export default async (client, options) => {
    const schema = await client.query({ query: gql`${introspectionQuery}` }).then(({ data: { __schema } }) => __schema);

    const queries = schema.types.reduce((acc, type) => {
        if (type.name !== 'Query' && type.name !== 'Mutation') return acc;

        return [...acc, ...type.fields];
    }, []);

    const types = schema.types.filter(type => type.name !== 'Query' && type.name !== 'Mutation');

    const isResource = type =>
        queries.some(query => query.name === options.operationNames[GET_LIST](type)) &&
        queries.some(query => query.name === options.operationNames[GET_ONE](type));

    const buildResource = type =>
        ALL_TYPES.reduce(
            (acc, aorFetchType) => ({
                ...acc,
                [aorFetchType]: queries.find(query => query.name == options.operationNames[aorFetchType](type)),
            }),
            { type },
        );

    const resources = types.filter(isResource).filter(filterTypesByIncludeExclude(options)).map(buildResource);

    return {
        types,
        queries,
        resources,
    };
};
