import merge from 'lodash.merge';
import buildClient from 'aor-graphql-client';
import buildQuery from './buildQuery';

import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE
} from 'admin-on-rest';
import pluralize from 'pluralize';

const defaultOptions = {
    introspection: {
        operationNames: {
            [GET_LIST]: resource => `all${pluralize(resource.name)}`,
            [GET_ONE]: resource => `${resource.name.substring(0, 1).toLowerCase()}${resource.name.substring(1)}ById`,
            [GET_MANY]: resource => `all${pluralize(resource.name)}`,
            [GET_MANY_REFERENCE]: resource => `all${pluralize(resource.name)}`,
            [CREATE]: resource => `create${resource.name}`,
            [UPDATE]: resource => `update${resource.name}`,
            [DELETE]: resource => `delete${resource.name}ById`,
        },
        exclude: undefined,
        include: undefined
    },
    buildQuery,
};

export default options => {
    return buildClient(merge({}, defaultOptions, options));
};
