import { TypeKind } from 'graphql';
import gql from 'graphql-tag';
import { GET_LIST, GET_ONE, GET_MANY, GET_MANY_REFERENCE, UPDATE, QUERY_TYPES } from 'aor-graphql-client/lib/constants';

/**
 * Ensure we get the real type even if the root type is NON_NULL or LIST
 * @param {GraphQLType} type 
 */
export const getFinalType = type => {
    if (type.kind === TypeKind.NON_NULL || type.kind === TypeKind.LIST) {
        return getFinalType(type.ofType);
    }

    return type;
};

/**
 * Check wether the type is a LIST (or a NON_NULL LIST)
 * @param {GraphQLType} type 
 */
export const isList = type => {
    if (type.kind === TypeKind.NON_NULL) {
        return isList(type.ofType);
    }

    return type.kind === TypeKind.LIST;
};

export const buildFields = introspectionResults => fields =>
    fields
        .reduce((acc, field) => {
            const type = getFinalType(field.type);

            if (type.kind !== TypeKind.OBJECT) {
                return [...acc, field.name];
            }

            const linkedResource = introspectionResults.resources.find(r => r.type.name === type.name);

            if (linkedResource) {
                return [acc, `${field.name} { id }`];
            }

            const linkedType = introspectionResults.types.find(t => t.name === type.name);

            if (linkedType) {
                return [acc, `${field.name} { ${buildFields(introspectionResults)(linkedType.fields)} }`];
            }

            // NOTE: We might have to handle linked types which are not resources but will have to be careful about
            // ending with endless circular dependencies
            return acc;
        }, [])
        .join(' ');

export const getQueryType = aorFetchType => (QUERY_TYPES.includes(aorFetchType) ? 'query' : 'mutation');

export const getArgType = arg => {
    if (arg.type.kind === TypeKind.NON_NULL) {
        return `${arg.type.ofType.name}!`;
    }

    return arg.type.name;
};

export const buildArgs = query => {
    if (query.args.length === 0) {
        return '';
    }

    let args = query.args.map(arg => `${arg.name}: $${arg.name}`).join(', ');

    return `(${args})`;
};

export const buildApolloArgs = query => {
    if (query.args.length === 0) {
        return '';
    }

    let args = query.args.map(arg => `$${arg.name}: ${getArgType(arg)}`).join(', ');

    return `(${args})`;
};

// NOTE: Building queries by merging/concatenating strings is bad and dirty!
// The ApolloClient.query method accepts an object of the shape { query, variables }.
// The query is actually a DocumentNode which is builded by the gql tag function.
// We should investigate how to build such DocumentNode from introspection results
// as it would be more robust.
export const buildQuery = introspectionResults => (resource, aorFetchType, query) => {
    let fields;
    if (aorFetchType === GET_LIST || aorFetchType === GET_MANY || aorFetchType === GET_MANY_REFERENCE) {
        fields = `items { ${buildFields(introspectionResults)(resource.type.fields)} } totalCount`;
    } else {
        fields = buildFields(introspectionResults)(resource.type.fields);
    }

    const queryType = getQueryType(aorFetchType);
    const apolloArgs = buildApolloArgs(query);
    const args = buildArgs(query);
    const result = `${queryType} ${query.name}${apolloArgs} {
        ${query.name}${args} {
            ${fields}
        }
    }`;
    return result;
};

export const buildVariables = (resource, aorFetchType, params) => {
    switch (aorFetchType) {
        case GET_LIST:
            return {
                sortField: params.sort.field,
                sortOrder: params.sort.order,
                page: params.pagination.page,
                perPage: params.pagination.perPage,
                filter: JSON.stringify(params.filter),
            };
        case GET_MANY:
            return {
                filter: JSON.stringify({ ids: params.ids }),
            };
        case GET_MANY_REFERENCE:
            return {
                filter: JSON.stringify({ [params.target]: params.id }),
            };
        case GET_ONE:
            return {
                id: params.id,
            };
        case UPDATE:
            return {
                id: params.id,
            };
    }
};

export const sanitizeResource = (introspectionResults, resource) => data => {
    const result = Object.keys(data).reduce((acc, key) => {
        if (key.startsWith('_')) {
            return acc;
        }

        const field = resource.type.fields.find(f => f.name === key);
        const type = getFinalType(field.type);

        if (type.kind !== TypeKind.OBJECT) {
            return { ...acc, [field.name]: data[field.name] };
        }

        const linkedResource = introspectionResults.resources.find(r => r.type.name === type.name);

        if (linkedResource) {
            return { ...acc, [`${field.name}Id`]: data[field.name].id };
        }

        // NOTE: We might have to handle linked types which are not resources but will have to be careful about
        // ending with endless circular dependencies
        return { ...acc, [field.name]: data[field.name] };
    }, {});

    return result;
};

export const getResponseParser = introspectionResults => (aorFetchType, resource, query) => response => {
    const sanitize = sanitizeResource(introspectionResults, resource);
    const data = response.data[query.name];
    if (aorFetchType === GET_LIST || aorFetchType === GET_MANY || aorFetchType === GET_MANY_REFERENCE) {
        const result = {
            data: data.items.map(sanitize),
            total: data.totalCount,
        };
        return result;
    }

    return { data: sanitize(data) };
};

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

        const query = buildQuery(introspectionResults)(resource, aorFetchType, queryType);
        const variables = buildVariables(resource, aorFetchType, params, queryType);
        const parseResponse = getResponseParser(introspectionResults)(aorFetchType, resource, queryType);

        return { query: gql`${query}`, variables, parseResponse };
    };
};
