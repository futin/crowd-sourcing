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
const CategoryType = require('./category');
const UserType = require('./user');

const NominationType = new GraphQLObjectType({
  name: 'Nomination',
  description: 'A normalized nomination type, where only ID references are returned',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    nominatedById: { type: new GraphQLNonNull(GraphQLID) },
    nomineeId: { type: new GraphQLNonNull(GraphQLID) },
    categoryId: { type: new GraphQLNonNull(GraphQLID) },
    numberOfPoints: { type: new GraphQLNonNull(GraphQLInt) },
    createdAt: { type: GraphQLDate },
  }),
});

const NominationFullType = new GraphQLObjectType({
  name: 'NominationFull',
  description: 'Full nomination type, with all of the dependencies included',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    numberOfPoints: { type: new GraphQLNonNull(GraphQLInt) },
    createdAt: { type: GraphQLDate },
    nominatedBy: {
      type: UserType,
      resolve: ({ nominatedById }, args, { connector }) => connector.findById('User', nominatedById),
    },
    nominee: {
      type: UserType,
      resolve: ({ nomineeId }, args, { connector }) => connector.findById('User', nomineeId),
    },
    category: {
      type: CategoryType,
      resolve: ({ categoryId }, args, { connector }) => connector.findById('Category', categoryId),
    },
  }),
});

module.exports = {
  NominationType,
  NominationFullType,
};
