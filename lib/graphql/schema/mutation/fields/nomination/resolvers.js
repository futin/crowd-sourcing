// core modules

// 3rd party modules
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules

// internal modules
const { transactionRetryWrapper } = require('../utils');
const {
  addNominationValidators: {
    validateNomineesPointsResolver, validateNominationMonthUniqueness, validateSelfNominations,
    validateNomineesUniqueness,
  },
  updateNominationValidators,
} = require('./validators/');

const addNominationResolver = (...params) =>
  combineResolvers(
    validateNominationMonthUniqueness,
    validateSelfNominations,
    validateNomineesUniqueness,
    validateNomineesPointsResolver,
    (_, { nominees }, { connector, user }) => {
      const transactionToExecute = connector.executeTransaction(
        'insertNominationTransaction',
        {
          nominees,
          nominatedById: user.id,
        },
      );

      return transactionRetryWrapper(transactionToExecute)(addNominationResolver, ...params);
    },
  )(...params);

const updateNominationFullResolver = (...params) =>
  combineResolvers(
    validateSelfNominations,
    validateNomineesUniqueness,
    updateNominationValidators.validateNominationDateCreationAndIssuer,
    updateNominationValidators.validateNomineesPointsResolver,
    (parent, args, { connector, user, extras }) => {
      const transactionToExecute = connector.executeTransaction(
        'updateNominationTransaction',
        {
          user,
          extras,
          ...args,
        },
      );

      return transactionRetryWrapper(transactionToExecute)(updateNominationFullResolver, ...params);
    },
  )(...params);

module.exports = {
  addNominationResolver,
  updateNominationFullResolver,
};
