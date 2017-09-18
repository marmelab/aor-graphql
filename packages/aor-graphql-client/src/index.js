import merge from 'lodash.merge';
import get from 'lodash.get';
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
        exclude: undefined,
        include: undefined,
    },
};

const getOptions = (options, aorFetchType, resource) => {
    if (typeof options === 'function') {
        return options(resource, aorFetchType);
    }

    return options;
};

export const getAorClient = ({ buildQuery, client, options }) => {
    const aorClient = (aorFetchType, resource, params) => {
        const overridedbuildQuery = get(options.override, `${resource}.${aorFetchType}`);

        const { parseResponse, ...query } = overridedbuildQuery
            ? {
                  ...buildQuery(aorFetchType, resource, params),
                  ...overridedbuildQuery(params),
              }
            : buildQuery(aorFetchType, resource, params);

        if (QUERY_TYPES.includes(aorFetchType)) {
            const apolloQuery = {
                ...query,
                ...getOptions(options.query, aorFetchType, resource),
            };

            return client.query(apolloQuery).then(parseResponse);
        }

        const { query: mutation, variables, ...queryOptions } = query;
        const apolloQuery = {
            mutation,
            variables,
            ...queryOptions,
            ...getOptions(options.mutation, aorFetchType, resource),
        };

        return client.mutate(apolloQuery).then(parseResponse);
    };

    aorClient.observeRequest = (aorFetchType, resource, params) => {
        const { parseResponse, ...query } = buildQuery(aorFetchType, resource, params);

        const apolloQuery = {
            ...query,
            ...getOptions(options.watchQuery, aorFetchType, resource),
        };

        return client.watchQuery(apolloQuery).then(parseResponse);
    };

    return aorClient;
};

export default async options => {
    const {
        client: clientOptions,
        introspection,
        resolveIntrospection,
        buildQuery: buildQueryFactory,
        ...otherOptions
    } = merge({}, defaultOptions, options);

    const client = clientOptions && clientOptions instanceof ApolloClient
        ? clientOptions
        : buildApolloClient(clientOptions);

    let introspectionResults;
    if (introspection) {
        introspectionResults = await resolveIntrospection(client, introspection);
    }

    const buildQuery = buildQueryFactory(introspectionResults, otherOptions);

    const aorClient = getAorClient({ buildQuery, client, options: otherOptions });

    return aorClient;
};
