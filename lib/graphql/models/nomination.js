// core modules

// 3rd party modules
const {
  GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLNonNull, GraphQLList,
} = require('graphql');

const { GraphQLDate } = require('graphql-iso-date');

// internal alias modules

// internal modules
const UserType = require('./user');
const CategoryType = require('./category');

const NominationType = new GraphQLObjectType({
  name: 'Nomination',
  description: 'A normalized nomination, which can be submitted only once per month',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    nominatedById: { type: new GraphQLNonNull(GraphQLID) },
    nomineeIds: { type: new GraphQLList(GraphQLID) },
    createdAt: { type: GraphQLDate },
  }),
});

const NominationFullType = new GraphQLObjectType({
  name: 'NominationFull',
  description: 'Full nomination, with all of the dependencies included. Can be submitted only once per month',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    createdAt: { type: GraphQLDate },
    nominatedBy: {
      type: UserType,
      resolve: ({ nominatedById }, args, { connector }) => connector.findById('User', nominatedById),
    },
    nominees: {
      type: new GraphQLList(NomineeFullType), // eslint-disable-line no-use-before-define
      resolve: ({ nomineeIds }, args, { connector }) => connector.findManyById('Nominee', nomineeIds),
    },
  }),
});

const NomineeFullType = new GraphQLObjectType({
  name: 'NomineeFull',
  description: 'Full nominee, with all of the dependencies included. In depends on Nomination',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    numberOfPoints: { type: new GraphQLNonNull(GraphQLInt) },
    category: {
      type: CategoryType,
      resolve: ({ categoryId }, args, { connector }) => connector.findById('Category', categoryId),
    },
    user: {
      type: UserType,
      resolve: ({ userId }, args, { connector }) => connector.findById('User', userId),
    },
    nomination: {
      type: NominationFullType,
      resolve: ({ nominationId }, args, { connector }) => connector.findById('Nomination', nominationId),
    },
  }),
});

module.exports = {
  NominationType,
  NominationFullType,
  NomineeFullType,
};
