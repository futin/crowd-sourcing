// core modules

// 3rd party GraphQLString
const { GraphQLID, GraphQLList, GraphQLNonNull } = require('graphql');

// internal alias modules

// internal modules
const { NominationType } = require('../../../../models');
const { NomineeInputType } = require('./input-types');
const { addNominationResolver, updateNominationFullResolver } = require('./resolvers');

const addNomination = {
  type: NominationType,
  description: 'Add new nomination',
  args: {
    nominees: { type: new GraphQLNonNull(new GraphQLList(NomineeInputType)) },
  },
  resolve: addNominationResolver,
};

const updateNominationFull = {
  type: NominationType,
  description: 'Fully update existing nomination',
  args: {
    nominationId: { type: new GraphQLNonNull(GraphQLID) },
    nominees: { type: new GraphQLNonNull(new GraphQLList(NomineeInputType)) },
  },
  resolve: updateNominationFullResolver,
};

module.exports = {
  addNomination,
  updateNominationFull,
};
