import buildApolloClient from 'aor-graphql-client-graphcool';
import gql from 'graphql-tag';

import apolloClient from './apolloClient';

export default () => buildApolloClient({
    client: apolloClient,
    override: {
        Command: {
            GET_ONE: () => ({
                query: gql`
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
            product {
                id
                reference
                price
                stock
            }
            quantity
        }
    }
}`,
            }),
        },
    },
});
