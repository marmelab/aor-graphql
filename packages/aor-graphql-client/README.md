# aor-graphql-client

[![Build Status](https://travis-ci.org/marmelab/aor-graphql-client.svg?branch=master)](https://travis-ci.org/marmelab/aor-graphql-client)

A GraphQL client for [admin-on-rest](https://github.com/marmelab/admin-on-rest/)
built with [Apollo](http://www.apollodata.com/)

A version of the `admin-on-rest` demo using this client is available at https://marmelab.com/admin-on-rest-graphql-demo.<br>
The source code for this demo is available at https://github.com/marmelab/admin-on-rest-graphql-demo.

- [Installation](#installation)
- [Usage](#installation)
- [Options](#options)
- [Realtime updates](#realtime-updates)

## About GraphQL and Apollo

This library is meant to be used with Apollo on the **client** side but
you're free to use any graphql **server**.

This is a very low level library which is not meant to be used directly unless you really want full control or are building a custom GraphQL client.

It provides the foundations for other packages such as:

- [aor-graphql-client-simple](https://github.com/marmelab/aor-graphql-client-simple)
- [aor-graphql-client-graphcool](https://github.com/marmelab/aor-graphql-client-graphcool)

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

Let's create a file for our admin page `admin.js`:

```js
import React, { Component } from 'react';
import buildApolloClient from 'aor-graphql-client';

import { Admin, Resource } from 'admin-on-rest';
import { Delete } from 'admin-on-rest/lib/mui';

import { PostCreate, PostEdit, PostList } from '../components/admin/posts';

const client = new ApolloClient();

class AdminPage extends Component {
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

export default AdminPage;
```

## Options

### Customize the Apollo client

You can either supply the client options by calling `buildApolloClient` like this:

```js
import { createNetworkInterface } from 'react-apollo';

buildApolloClient({ client: {
    networkInterface: createNetworkInterface({
        uri: 'http://api.myproduct.com/graphql',
    }),
} });
```

You can pass any options supported by the [ApolloClient](http://dev.apollodata.com/core/apollo-client-api.html#apollo-client) contructor with the addition of `uri` which can be specified so that we create the network interface for you.

You can also supply your own [ApolloClient](http://dev.apollodata.com/core/apollo-client-api.html#apollo-client) instance directly with:

```js
buildApolloClient({ client: myClient });
```

## Specify your queries and mutations

For the client to know how to map Admin-on-rest request to apollo queries and mutations, you must provide a `queryBuilder`. The `queryBuilder` is a function which will be called with the same parameters as the Admin-on-rest client but it must returns an object matching the `options` of the ApolloClient [query](http://dev.apollodata.com/core/apollo-client-api.html#ApolloClient.query) method but with an additional `parseResponse` function.

This function will be called with an [ApolloQueryResult](http://dev.apollodata.com/core/apollo-client-api.html#ApolloQueryResult) and must returns the data expected by Admin-on-rest.

For example:

```js
import buildFieldList from './buildFieldList';

const queryBuilder = (aorFetchType, resource, params) => {
    switch (aorFetchType) {
        case 'GET_ONE':
            return {
                query: gql`query getResource($id: ID) {
                    query get${resource}(id: $id) {
                        ${buildFieldList(resource)}
                    }
                }`,
                variables: params,
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

Coverage data is available in `./coverage` after executing `make test`.

An HTML report is generated in `./coverage/lcov-report/index.html`.
