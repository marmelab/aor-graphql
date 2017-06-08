import merge from 'lodash.merge';
import buildClient from 'aor-graphql-client';
import queryBuilder from './queryBuilder';

const defaultOptions = {
    queryBuilder,
};

export default options => {
    return buildClient(merge({}, defaultOptions, options));
};
