# aor-graphql-client

[![Build Status](https://travis-ci.org/marmelab/aor-graphql-client.svg?branch=master)](https://travis-ci.org/marmelab/aor-graphql-client)

A GraphQL client for [admin-on-rest](https://github.com/marmelab/admin-on-rest/)
built with [Apollo](http://www.apollodata.com/)

A version of the `admin-on-rest` demo using this client is available at https://marmelab.com/admin-on-rest-graphql-demo.<br>
The source code for this demo is available at https://github.com/marmelab/admin-on-rest-graphql-demo.

- [Installation](#installation)
- [Usage](#installation)
- [Options](#options)

This is a very low level library which is not meant to be used directly unless you really want full control or are building a custom GraphQL client.

It provides the foundations for other packages such as:

- [aor-graphql-client-simple](https://github.com/marmelab/aor-graphql-client-simple)
- [aor-graphql-client-graphcool](https://github.com/marmelab/aor-graphql-client-graphcool)

## About GraphQL and Apollo

This library is meant to be used with Apollo on the **client** side but
you're free to use any graphql **server**.

## Installation

Install with:

```sh
npm install --save aor-graphql-client
```

or

```sh
yarn add aor-graphql-client
```

## Usage

```jsx
// in App.js
import React, { Component } from 'react';
import buildApolloClient from 'aor-graphql-client';

import { Admin, Resource } from 'admin-on-rest';
import { Delete } from 'admin-on-rest/lib/mui';

import { PostCreate, PostEdit, PostList } from '../components/admin/posts';

const client = new ApolloClient();

class App extends Component {
    constructor() {
        super();
        this.state = { restClient: null };
    }
    componentDidMount() {
        buildApolloClient()
            .then(restClient => this.setState({ restClient }));
    }

    render() {
        const { restClient } = this.state;

        if (!restClient) {
            return <div>Loading</div>;
        }

        return (
            <Admin restClient={restClient}>
                <Resource name="Post" list={PostList} edit={PostEdit} create={PostCreate} remove={Delete} />
            </Admin>
        );
    }
}

export default App;
```

## Options

### Customize the Apollo client

You can specify the client options by calling `buildApolloClient` like this:

```js
import { createNetworkInterface } from 'react-apollo';

buildApolloClient({
    client: {
        networkInterface: createNetworkInterface({
            uri: 'http://api.myproduct.com/graphql',
        }),
    },
});
```

You can pass any options supported by the [ApolloClient](http://dev.apollodata.com/core/apollo-client-api.html#apollo-client) contructor with the addition of `uri` which can be specified so that we create the network interface for you.

You can also supply your own [ApolloClient](http://dev.apollodata.com/core/apollo-client-api.html#apollo-client) instance directly with:

```js
buildApolloClient({ client: myClient });
```

### IntrospectionOptions

Instead of running an IntrospectionQuery you can also provide the IntrospectionQuery result directly. This speeds up the initial rendering of the `Admin` component as it no longer has to wait for the introspection query request to resolve.

```jsx
import { __schema as schema } from './schema';

const introspectionOptions = {
  schema
};

buildApolloClient({
    introspection: introspectionOptions
});
```

The `./schema` file is a `schema.json` in `./scr` retrieved with [`get-graphql-schema --json <graphql_endpoint>`](https://github.com/graphcool/get-graphql-schema).

> Note: Importing the `schema.json` file will significantly increase the bundle size.

## Specify your queries and mutations

For the client to know how to map Admin-on-rest request to apollo queries and mutations, you must provide a `queryBuilder` option. The `queryBuilder` is a factory function which will be called with the introspection query result.

The introspection result is an object with 3 properties:

- `types`: an array of all the GraphQL types discovered on your endpoint
- `queries`: an array of all the GraphQL queries and mutations discovered on your endpoint
- `resources`: an array of objects with a `type` property, which is the GraphQL type for this resource, and a property for each Admin-on-rest fetch verb for which we found a matching query or mutation

For example:

```js
{
    types: [
        {
            name: 'Post',
            kind: 'OBJECT',
            fields: [
                { name: 'id', type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'ID' } } },
                { name: 'title', type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'String' } } },
                ...
            ]
        },
        ...
    ],
    queries: [
        {
            name: 'createPost',
            args: [
                { name: 'title', type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'String' } } }
            ],
            type : { kind: 'OBJECT', name: 'Category' }
        },
        ...
    ],
    resources: [
        {
            type: {
                name: 'Post',
                kind: 'OBJECT',
                fields: [
                    { name: 'id', type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'ID' } } },
                    { name: 'title', type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'String' } } },
                    ...
                ]
            },
            GET_LIST: {
                name: 'createPost',
                args: [
                    { name: 'title', type: { kind: 'NON_NULL', ofType: { kind: 'SCALAR', name: 'String' } } }
                ],
                type : { kind: 'OBJECT', name: 'Category' }
            },
            ...
        }
    ]
}
```

The `queryBuilder` function must return a function which will be called with the same parameters as the Admin-on-rest client but must return an object matching the `options` of the ApolloClient [query](http://dev.apollodata.com/core/apollo-client-api.html#ApolloClient.query) method with an additional `parseResponse` function.

This `parseResponse` function will be called with an [ApolloQueryResult](http://dev.apollodata.com/core/apollo-client-api.html#ApolloQueryResult) and must returns the data expected by Admin-on-rest.

For example:

```js
import buildFieldList from './buildFieldList';

const queryBuilder = introspectionResults => (aorFetchType, resourceName, params) => {
    const resource = introspectionResults.resource.find(r => r.type.name === resourceName);

    switch (aorFetchType) {
        case 'GET_ONE':
            return {
                query: gql`query ${resource[aorFetchType].name}($id: ID) {
                    data: ${resource[aorFetchType].name}(id: $id) {
                        ${buildFieldList(introspectionResults, resource, aorFetchType)}
                    }
                }`,
                variables: params, // params = { id: ... }
                parseResponse: response => response.data,
            }
            break;
        // ... other types handled here
    }
}
```

```js
buildApolloClient({ queryBuilder });
```

## Contributing

Run the tests with this command:

```sh
make test
```
