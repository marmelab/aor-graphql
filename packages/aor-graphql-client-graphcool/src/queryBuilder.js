import gql from 'graphql-tag';
import buildVariables from './buildVariables';
import buildQuery from './buildQuery';
import getResponseParser from './getResponseParser';

export default introspectionResults => {
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

        const variables = buildVariables(introspectionResults)(resource, aorFetchType, params, queryType);
        const query = buildQuery(introspectionResults)(resource, aorFetchType, queryType, variables);
        const parseResponse = getResponseParser(introspectionResults)(aorFetchType, resource, queryType);

        return { query: gql`${query}`, variables, parseResponse };
    };
};
