import { TypeKind } from 'graphql';
import getFinalType from './getFinalType';
import { GET_LIST, GET_MANY, GET_MANY_REFERENCE, CREATE, UPDATE, DELETE } from 'aor-graphql-client/lib/constants';

const sanitizeResource = (introspectionResults, resource, aorFetchType) => data => {
    const result = Object.keys(data).reduce((acc, key) => {
        if (key.startsWith('_')) {
            return acc;
        }

        const field = aorFetchType === DELETE ? resource[DELETE] : resource.type.fields.find(f => f.name === key);
        const type = getFinalType(field.type);

        if (type.kind !== TypeKind.OBJECT) {
            return { ...acc, [field.name]: data[field.name] };
        }

        // FIXME: We might have to handle linked types which are not resources but will have to be careful about
        // endless circular dependencies
        const linkedResource = introspectionResults.resources.find(r => r.type.name === type.name);

        if (linkedResource) {
            const linkedResourceData = data[field.name];

            if (Array.isArray(linkedResourceData)) {
                return {
                    ...acc,
                    [field.name]: data[field.name].map(sanitizeResource(introspectionResults, linkedResource)),
                    [`${field.name}Ids`]: data[field.name].map(d => d.id),
                };
            }

            return {
                ...acc,
                [`${field.name}.id`]: linkedResourceData ? data[field.name].id : undefined,
                [field.name]: linkedResourceData
                    ? sanitizeResource(introspectionResults, linkedResource)(data[field.name])
                    : undefined,
            };
        }

        return { ...acc, [field.name]: data[field.name] };
    }, {});

    return result;
};

export default introspectionResults => (aorFetchType, resource) => response => {
    const sanitize = sanitizeResource(introspectionResults, resource, aorFetchType);
    const data = response.data;

    if (aorFetchType === GET_LIST || aorFetchType === GET_MANY || aorFetchType === GET_MANY_REFERENCE) {
        return { data: response.data.items.nodes.map(sanitize), total: response.data.total.count };
    }

    if (aorFetchType === CREATE || aorFetchType === UPDATE) {
        const lowerCasedResource = Object.keys(data.data)[0];

        return { data: sanitize(data.data[lowerCasedResource]) };
    }

    return { data: sanitize(data.data) };
};
