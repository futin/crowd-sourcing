// core modules

// 3rd party GraphQLString
const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules

// internal modules
const { NominationType } = require('../../../../models');
const { NomineeInputType } = require('./input-types');
const {
  validateNomineesPointsResolver, validateNominationMonthUniqueness, validateSelfNominations,
  validateNomineesUniqueness,
} = require('./utils/add-nomination-utils');

const updateNominationUtils = require('./utils/update-nomination-utils');

const addNomination = {
  type: NominationType,
  description: 'Add new nomination',
  args: {
    nominees: { type: new GraphQLNonNull(new GraphQLList(NomineeInputType)) },
  },
  resolve: combineResolvers(
    validateNominationMonthUniqueness,
    validateNomineesPointsResolver,
    validateSelfNominations,
    validateNomineesUniqueness,
    async (parent, { nominees }, { connector, user }) =>
      connector.executeTransaction('insertNominationTransaction', { nominees, nominatedById: user.id }),
  ),
};

const updateNominationFull = {
  type: NominationType,
  description: 'Fully update existing nomination',
  args: {
    nominationId: { type: new GraphQLNonNull(GraphQLID) },
    nominees: { type: new GraphQLNonNull(new GraphQLList(NomineeInputType)) },
  },
  resolve: combineResolvers(
    updateNominationUtils.validateNomineesPointsResolver,
    async (parent, { nominees }, { connector, user }) =>
      connector.executeTransaction('insertNominationTransaction', { nominees, nominatedById: user.id }),
  ),
};

module.exports = {
  addNomination,
  updateNominationFull,
};
