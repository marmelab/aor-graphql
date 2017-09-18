aor-graphql
===========

This is a [lerna](https://lernajs.io/) project for working on packages related to using GraphQL with [Admin-on-rest](https://github.com/marmelab/admin-on-rest).

## About this repository

You'll find three packages in this repository:

- [aor-graphql-client](packages/aor-graphql-client): base implementation of graphql for admin-on-rest. It provides the basis for real implementations such as the graphcool client.

- [aor-graphql-client-graphcool](packages/aor-graphql-client-graphcool): *real* implementation tailored for graphcool *dialect* of graphql for admin-on-rest

- [admin-on-rest-graphql-demo](packages/admin-on-rest-graphql-demo): a graphcool version of the official admin-on-rest demo.

## Roadmap

- Better documentation and samples
- Provide an example implementation of a custom graphql *dialect*
- Includes a custom saga for real time updates based on graphql subscriptions

## Development

We included some make commands to ease common tasks:

`make install`: runs the installation command from lerna, ensuring packages are linked correctly.

`make watch`: will compile and watch changes on the aor-graphql-client and aor-graphql-client-graphcool packages
`make run`: will starts the demo

**Tip**: You should run both commands in separate terminals when playing with the source code.

`make watch-test`: will run the tests in watch mode.
`make test`: will run the tests once.
