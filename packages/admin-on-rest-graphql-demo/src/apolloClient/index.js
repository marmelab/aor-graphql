import { ApolloClient, createNetworkInterface } from 'apollo-client';

const client = new ApolloClient({
    networkInterface: createNetworkInterface('https://api.graph.cool/simple/v1/cj2kl5gbc8w7a0130p3n4eg78'),
});

export default client;
