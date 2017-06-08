# aor-graphql-client-simple

[![Build Status](https://travis-ci.org/marmelab/aor-simple-graphql-client.svg?branch=master)](https://travis-ci.org/marmelab/aor-simple-graphql-client)

A simple GraphQL client for [admin-on-rest](https://github.com/marmelab/admin-on-rest/)
built with [Apollo](http://www.apollodata.com/)

A version of the `admin-on-rest` demo using this client is available at https://marmelab.com/admin-on-rest-graphql-demo.<br>
The source code for this demo is available at https://github.com/marmelab/admin-on-rest-graphql-demo.

- [Installation](#installation)
- [Usage](#installation)
- [Options](#options)
- [Realtime updates](#realtime-updates)

## About GraphQL and Apollo

This library is meant to be used with Apollo on the **client** side but
you're free to use any graphql server.

Note that this client is **not** compatible with [graphcool](https://www.graph.cool/). However, another client exists for graphcool: [aor-graphql-client-graphcool](https://github.com/marmelab/aor-graphql-client-graphcool).

## Installation

Install with:

```sh
npm install --save aor-graphql-client-simple
```

or

```sh
yarn add aor-graphql-client-simple
```

## Usage

Let's create a file for our admin page `admin.js`:

```js
import React, { Component } from 'react';
import buildApolloClient from 'aor-graphql-client-simple';

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

And that's it, `buildApolloClient` will create a default ApolloClient for you and
run an introspection query on your graphql endpoint.

By default, it expect the following queries and mutations for each resource:

### List resources with pagination

Example with resource `Post`:

```graphql
getPageOfPosts(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: String) {
    items: [Post]
    totalCount: Int
}
```

Note that the function should be named with the plural version of `Post`.
We use [pluralize](https://github.com/blakeembrey/pluralize) to generate it.

`filter` may contain a serialized JSON object, for example:

```js
'{ "authorId": "4e80878c-6baa-4506-a93c-ef99b74e73e0" }'
```

### Get a resource

Example with resource `Post`:

```graphql
getPost(id: ID!) Post
```

### Create a new resource

Example with resource `Post`:

```graphql
createPost(data: String) Post
```

`data` is a serialized JSON object, for example:

```js
'{ "title": "My first post", "authorId": "4e80878c-6baa-4506-a93c-ef99b74e73e0", "body": "..." }'
```

### Update a resource

Example with resource `Post`:

```graphql
updatePost(data: String) Post
```

`data` is a serialized JSON object, for example:

```js
'{ "id": "c02e92e8-2a21-4ae7-9197-cb9601861a44", "title": "My first post", "authorId": "4e80878c-6baa-4506-a93c-ef99b74e73e0", "body": "..." }'
```

### Remove a resource

Example with resource `Post`:

```graphql
removePost(id: ID!) Boolean
```

## Options

### Customize the Apollo client

You can either supply the client options by calling `buildApolloClient` like this:

```js
buildApolloClient({ client: { uri: 'http://localhost:3000', ...otherApolloOptions } });
```

Or supply your client directly with:

```js
buildApolloClient({ client: myClient });
```

### Customize the introspection

These are the default options for introspection:

```js
const introspectionOptions = {
    include: [], // Either an array of types/queries/mutations to include or a function which will be called for every type, query and mutation discovered through introspection
    exclude: [], // Either an array of types/queries/mutations to exclude or a function which will be called for every type, query and mutation discovered through introspection
}
```

And how you pass them to the `buildApolloClient` function:

```js
buildApolloClient({ introspection: introspectionOptions });
```

**Note**: `exclude` and `include` are mutualy exclusives and `include` will take precendance.

## Contributing

Run the tests with this command:

```sh
make test
```

Coverage data is available in `./coverage` after executing `make test`.

An HTML report is generated in `./coverage/lcov-report/index.html`.
