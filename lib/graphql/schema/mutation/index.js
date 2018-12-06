// core modules

// 3rd party modules
const {
  GraphQLObjectType,
} = require('graphql');

// internal modules
const fields = require('./fields');

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields,
});

module.exports = Mutation;
