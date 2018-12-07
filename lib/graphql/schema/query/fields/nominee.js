// core modules

// 3rd party modules
const { GraphQLList, GraphQLID } = require('graphql');

// internal alias modules

// internal modules
const { NomineeFullType } = require('../../../models');
const { pickThruthy } = require('../../utils');

const nominee = {
  type: NomineeFullType,
  description: 'Fetch single nominee',
  args: {
    id: { type: GraphQLID },
  },
  resolve: (parent, { id }, { connector }) => connector.findById('Nominee', id),
};

const nominees = {
  type: new GraphQLList(NomineeFullType),
  description: 'Fetch list of nominees',
  args: {
    userId: { type: GraphQLID },
    categoryId: { type: GraphQLID },
  },
  resolve: (parent, args, { connector }) => connector.findAll('Nominee', pickThruthy(args)),
};

module.exports = {
  nominee,
  nominees,
};
