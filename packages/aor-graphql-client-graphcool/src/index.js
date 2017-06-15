import merge from 'lodash.merge';
import buildClient from 'aor-graphql-client';
import buildQuery from './buildQuery';

const defaultOptions = {
    queryBuilder: buildQuery,
};

export default options => {
    return buildClient(merge({}, defaultOptions, options));
};
