import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { ApolloClient, createNetworkInterface } from 'apollo-client';
import buildApolloClient from 'aor-graphql-client-postgraphile';

import { Admin, Resource } from 'admin-on-rest';
import { Delete } from 'admin-on-rest/lib/mui';

import { PostCreate, PostEdit, PostList } from './components/admin/posts';
import { BoardMemberCreate, BoardMemberEdit, BoardMemberList } from './components/admin/boardmembers';

//const client = new ApolloClient();

class App extends Component {
    constructor() {
        super();
        this.state = { restClient: null };
    }
    componentDidMount() {
    
      const client = new ApolloClient({
        networkInterface: createNetworkInterface('http://graphile.service.consul/graphql')
      });

      const builtClient = buildApolloClient({ client });

      // We are using state here because the apollo client initialization is asynchronous
      builtClient.then(restClient => this.setState({ restClient }));
    }
  
  render() {
	const { restClient } = this.state;

        if (!restClient) {
            return <div>Loading</div>;
        }

        return (
            <Admin restClient={restClient} title="Management Console v 1.0">
              <Resource name="Post" list={PostList} edit={PostEdit} create={PostCreate} remove={Delete} />
              <Resource name="BoardMember" options={{ label: 'Board Members' }} edit={BoardMemberEdit} create={BoardMemberCreate} remove={Delete} list={BoardMemberList} />
            </Admin>
        );
  }

  renderOld() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          AAA To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
