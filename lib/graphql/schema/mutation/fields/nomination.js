// core modules

// 3rd party GraphQLString
const {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');

// internal alias modules

// internal modules
const { NominationType } = require('../../../models');

const addNomination = {
  type: NominationType,
  description: 'Add new nomination',
  args: {
    nominatedById: { type: new GraphQLNonNull(GraphQLID) },
    nomineeId: { type: new GraphQLNonNull(GraphQLID) },
    categoryId: { type: new GraphQLNonNull(GraphQLID) },
    numberOfPoints: { type: new GraphQLNonNull(GraphQLInt) },
  },
  // TODO: validate entered data
  resolve: (parent, args, { connector }) => connector.insertOne('Nomination', { createdAt: new Date(), ...args }),
};

module.exports = {
  addNomination,
};
