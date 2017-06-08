/* global data */
// import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
// import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
// import pluralize from 'pluralize';

// import typeDefs from './schema';

// const schema = makeExecutableSchema({ typeDefs });

// const currentData = data;

// const graphqlize = item => Object.keys(item).reduce((acc, key) => {
//     const indexOfId = key.indexOf('_id');
//     if (indexOfId > -1) {
//         return {
//             ...acc,
//             [key.substr(0, indexOfId)]: { id: item[key] },
//         };
//     }

//     return { ...acc, [key]: item[key] };
// }, {});

// const mockQueriesForEntity = (entity) => {
//     const entityData = currentData[pluralize(entity).toLowerCase()];

//     return {
//         [`getPageOf${pluralize(entity)}`]: (r, { page, perPage, filter }) => {
//             const filters = JSON.parse(filter);
//             let items = entityData;

//             if (filters.ids) {
//                 items = items.filter(d => filters.ids.includes(d.id.toString()));
//             } else {
//                 Object.keys(filters).filter(key => key !== 'q').forEach((key) => {
//                     if (key.endsWith('Id')) {
//                         const resource = key.substr(0, key.indexOf('Id'));
//                         if (currentData[pluralize(resource)]) {
//                             items = items.filter(d => d[`${resource}_id`] == filters[key]);
//                             return;
//                         }
//                     }

//                     if (key.indexOf('_lte') !== -1) {
//                         // less than or equal
//                         const realKey = key.replace(/(_lte)$/, '');
//                         items = items.filter(d => d[realKey] <= filters[key]);
//                         return;
//                     }
//                     if (key.indexOf('_gte') !== -1) {
//                         // less than or equal
//                         const realKey = key.replace(/(_gte)$/, '');
//                         items = items.filter(d => d[realKey] >= filters[key]);
//                         return;
//                     }
//                     if (key.indexOf('_lt') !== -1) {
//                         // less than or equal
//                         const realKey = key.replace(/(_lt)$/, '');
//                         items = items.filter(d => d[realKey] < filters[key]);
//                         return;
//                     }
//                     if (key.indexOf('_gt') !== -1) {
//                         // less than or equal
//                         const realKey = key.replace(/(_gt)$/, '');
//                         items = items.filter(d => d[realKey] > filters[key]);
//                         return;
//                     }

//                     items = items.filter(d => d[key] == filters[key]);
//                 });

//                 if (filters.q) {
//                     items = items.filter(d => Object.keys(d).some(key => d[key].toString().includes(filters.q)));
//                 }
//             }

//             if (page !== undefined && perPage) {
//                 items = items.slice(page * perPage, (page * perPage) + perPage);
//             }

//             const graphqlizedItems = items.map(graphqlize);

//             return {
//                 items: graphqlizedItems,
//                 totalCount: entityData.length,
//             };
//         },
//         [`get${entity}`]: (r, { id }) => graphqlize(entityData.find(d => d.id == id)),
//     };
// };

// const mockMutationsForEntity = (entity) => {
//     let entityData = currentData[pluralize(entity).toLowerCase()];

//     return {
//         [`create${entity}`]: (root, { data }) => {
//             const { __typename, ...parsedData } = JSON.parse(data);
//             const newEntity = {
//                 id: entityData[entityData.length - 1].id + 1,
//                 ...parsedData,
//             };

//             entityData.push(newEntity);
//             return newEntity;
//         },
//         [`update${entity}`]: (root, { data }) => {
//             const { id, __typename, ...parsedData } = JSON.parse(data);
//             const parsedId = parseInt(id, 10);
//             const indexOfEntity = entityData.findIndex(e => e.id === parsedId);

//             entityData[indexOfEntity] = { id: parsedId, ...parsedData };
//             return parsedData;
//         },
//         [`remove${entity}`]: (root, { id }) => {
//             entityData = entityData.filter(e => e.id !== id);
//         },
//     };
// };

// const mocks = {
//     Query: () => ({
//         ...mockQueriesForEntity('Customer'),
//         ...mockQueriesForEntity('Category'),
//         ...mockQueriesForEntity('Product'),
//         ...mockQueriesForEntity('Command'),
//         ...mockQueriesForEntity('Review'),
//     }),
//     Mutation: () => ({
//         ...mockMutationsForEntity('Customer'),
//         ...mockMutationsForEntity('Category'),
//         ...mockMutationsForEntity('Product'),
//         ...mockMutationsForEntity('Command'),
//         ...mockMutationsForEntity('Review'),
//     }),
// };

// addMockFunctionsToSchema({
//     schema,
//     mocks,
// });

// const mockNetworkInterface = mockNetworkInterfaceWithSchema({ schema });

const client = new ApolloClient({
    networkInterface: createNetworkInterface('https://api.graph.cool/simple/v1/cj2kl5gbc8w7a0130p3n4eg78'),
});

export default client;
