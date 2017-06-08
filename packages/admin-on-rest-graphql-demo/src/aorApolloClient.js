import buildApolloClient from 'aor-graphql-client-graphcool';

import apolloClient from './apolloClient';

export default () => buildApolloClient({
    client: apolloClient,
});
