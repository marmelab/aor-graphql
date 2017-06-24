import buildApolloClient from 'aor-graphql-client-graphcool';
import gql from 'graphql-tag';

import apolloClient from './apolloClient';

const getOneCommandQuery = gql`
query Command($id: ID!) {
    data: Command(id: $id) {
        id
        reference
        date
        status
        returned
        taxRate
        total
        deliveryFees
        totalExTaxes
        customer {
            id
            firstName
            lastName
        }
        basket {
            id
            product {
                id
                reference
                price
                stock
            }
            quantity
        }
    }
}`;

export default () => buildApolloClient({
    client: apolloClient,
    override: {
        Command: {
            GET_ONE: () => ({
                query: getOneCommandQuery,
            }),
        },
    },
});
