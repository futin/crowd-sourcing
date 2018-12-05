// core modules

// 3rd party modules
const {
  GraphQLObjectType,
} = require('graphql');

// internal modules
const fields = require('./fields');

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'Crowd-sourcing Schema Query Root',
  fields,
});

module.exports = RootQuery;
