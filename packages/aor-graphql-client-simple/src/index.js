import merge from 'lodash.merge';
import buildClient from 'aor-graphql-client';
import introspectionResolve from 'aor-graphql-client/lib/introspection';
import queryBuilder from './queryBuilder';

const defaultOptions = {
    introspection: {
        resolve: introspectionResolve,
    },
    queryBuilder,
};

export default options => {
    return buildClient(merge({}, defaultOptions, options));
};
