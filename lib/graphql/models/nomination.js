// core modules

// 3rd party modules
const {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');

const {
  GraphQLDate,
} = require('graphql-iso-date');

// internal alias modules

// internal modules

const NominationType = new GraphQLObjectType({
  name: 'Nomination',
  description: 'All nominations can be found here',
  fields: () => ({
    nominatedById: { type: new GraphQLNonNull(GraphQLID) },
    nomineeId: { type: new GraphQLNonNull(GraphQLID) },
    categoryId: { type: new GraphQLNonNull(GraphQLID) },
    numberOfPoints: { type: new GraphQLNonNull(GraphQLInt) },
    date: { type: GraphQLDate },
  }),
});

module.exports = NominationType;
