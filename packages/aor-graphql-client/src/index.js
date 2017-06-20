import merge from 'lodash.merge';
import { ApolloClient } from 'apollo-client';
import pluralize from 'pluralize';

import buildApolloClient from './buildApolloClient';
import { GET_LIST, GET_ONE, GET_MANY, GET_MANY_REFERENCE, CREATE, UPDATE, DELETE, QUERY_TYPES } from './constants';
import defaultResolveIntrospection from './introspection';

const defaultOptions = {
    resolveIntrospection: defaultResolveIntrospection,
    introspection: {
        operationNames: {
            [GET_LIST]: resource => `all${pluralize(resource.name)}`,
            [GET_ONE]: resource => `${resource.name}`,
            [GET_MANY]: resource => `all${pluralize(resource.name)}`,
            [GET_MANY_REFERENCE]: resource => `all${pluralize(resource.name)}`,
            [CREATE]: resource => `create${resource.name}`,
            [UPDATE]: resource => `update${resource.name}`,
            [DELETE]: resource => `delete${resource.name}`,
        },
        exclude: [],
        include: [],
    },
};

const getOptions = (options, aorFetchType, resource) => {
    if (typeof options === 'function') {
        return options(resource, aorFetchType);
    }

    return options;
};

export default async options => {
    const {
        client: clientOptions,
        introspection,
        resolveIntrospection,
        queryBuilder: queryBuilderFactory,
        ...otherOptions
    } = merge({}, defaultOptions, options);

    const client = clientOptions && clientOptions instanceof ApolloClient
        ? clientOptions
        : buildApolloClient(clientOptions);

    let introspectionResults;
    if (introspection) {
        introspectionResults = await resolveIntrospection(client, introspection);
    }

    const queryBuilder = queryBuilderFactory(introspectionResults, otherOptions);

    const aorClient = (aorFetchType, resource, params) => {
        const { parseResponse, ...query } = queryBuilder(aorFetchType, resource, params);

        if (QUERY_TYPES.includes(aorFetchType)) {
            const apolloQuery = {
                ...query,
                ...getOptions(otherOptions.query, aorFetchType, resource),
            };

            return client.query(apolloQuery).then(parseResponse);
        }

        const apolloQuery = {
            mutation: query.query,
            variables: query.variables,
            ...getOptions(otherOptions.mutation, aorFetchType, resource),
        };

        return client.mutate(apolloQuery).then(parseResponse);
    };

    aorClient.observeRequest = (aorFetchType, resource, params) => {
        const { parseResponse, ...query } = queryBuilder(aorFetchType, resource, params);

        const apolloQuery = {
            ...query,
            ...getOptions(otherOptions.watchQuery, aorFetchType, resource),
        };

        return client.watchQuery(apolloQuery).then(parseResponse);
    };

    aorClient.saga = () => {};

    return aorClient;
};
