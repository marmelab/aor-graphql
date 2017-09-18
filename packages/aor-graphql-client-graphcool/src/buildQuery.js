import gql from 'graphql-tag';
import { invalidateFields, ROOT } from 'apollo-cache-invalidation';
import { QUERY_TYPES } from 'aor-graphql-client/lib/constants';
import buildVariables from './buildVariables';
import buildGqlQuery from './buildGqlQuery';
import getResponseParser from './getResponseParser';

export const buildQueryFactory = (
    buildVariablesImpl,
    buildGqlQueryImpl,
    getResponseParserImpl,
) => introspectionResults => {
    const knownResources = introspectionResults.resources.map(r => r.type.name);

    return (aorFetchType, resourceName, params) => {
        const resource = introspectionResults.resources.find(r => r.type.name === resourceName);

        if (!resource) {
            throw new Error(
                `Unknown resource ${resource}. Make sure it has been declared on your server side schema. Known resources are ${knownResources.join(', ')}`,
            );
        }

        const queryType = resource[aorFetchType];

        if (!queryType) {
            throw new Error(
                `No query or mutation matching aor fetch type ${aorFetchType} could be found for resource ${resource.type.name}`,
            );
        }

        const variables = buildVariablesImpl(introspectionResults)(resource, aorFetchType, params, queryType);
        const query = buildGqlQueryImpl(introspectionResults)(resource, aorFetchType, queryType, variables);
        const parseResponse = getResponseParserImpl(introspectionResults)(aorFetchType, resource, queryType);

        let update = undefined;
        if (!QUERY_TYPES.includes(aorFetchType)) {
            const paths = QUERY_TYPES.filter(queryType => resource[queryType])
                .map(queryType => resource[queryType].name)
                .reduce((acc, queryName) => (acc.includes(queryName) ? acc : [...acc, queryName]), [])
                .map(queryName => [ROOT, new RegExp(queryName)]);

            update = invalidateFields(() => paths);
        }

        return { query: gql`${query}`, variables, parseResponse, update };
    };
};

export default buildQueryFactory(buildVariables, buildGqlQuery, getResponseParser);
