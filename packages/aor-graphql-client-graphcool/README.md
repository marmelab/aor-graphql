# aor-graphql-client-graphcool

[![Build Status](https://travis-ci.org/marmelab/aor-graphcool-graphql-client.svg?branch=master)](https://travis-ci.org/marmelab/aor-graphcool-graphql-client)

A GraphQL client for [admin-on-rest](https://github.com/marmelab/admin-on-rest/)
built with [Apollo](http://www.apollodata.com/) and tailored to target the [GraphCool](https://www.graph.cool/) service.

A version of the `admin-on-rest` demo using this client is available at https://marmelab.com/admin-on-rest-graphcool-demo.<br>
The source code for this demo is available at https://github.com/marmelab/admin-on-rest-graphcool-demo.

- [Installation](#installation)
- [Usage](#installation)
- [Options](#options)
- [Realtime updates](#realtime-updates)

## Installation

Install with:

```sh
npm install --save aor-graphql-client-graphcool
```

or

```sh
yarn add aor-graphql-client-graphcool
```

## Usage

Let's create a file for our admin page `admin.js`:

```js
import React, { Component } from 'react';
import buildApolloClient from 'aor-graphql-client-graphcool';

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
