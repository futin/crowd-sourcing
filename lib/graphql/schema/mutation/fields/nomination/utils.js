// core node modules

// 3rd party modules
const { skip } = require('graphql-resolvers');
const debug = require('debug');

// internal alias modules
const {
  settings: {
    nominationConfig: {
      numberOfPointsPerMonth,
    },
    environment,
  },
  constants: {
    loggerNamespaces: {
      nominationMonthUniquenessNamespace,
    },
  },
} = require('@config');
const { ing } = require('@utils');

// internal modules

const logger = debug(nominationMonthUniquenessNamespace);
const devMode = /dev|local/.test(environment);

const validateNomineesPointsResolver = (parent, { nominees }) => {
  const numberOfPointsSum = nominees.reduce((sum, nominee) => sum + nominee.numberOfPoints, 0);
  return numberOfPointsPerMonth >= numberOfPointsSum
    ? skip
    : new Error(`Invalid number of points. Maximum is ${numberOfPointsPerMonth}, but received ${numberOfPointsSum}`);
};

const validateNominationMonthUniqueness = async (parent, { nominatedById }, { connector }) => {
  const currentDate = new Date();
  const dateFrom = new Date(currentDate.getFullYear(), currentDate.getMonth());
  const dateTo = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const dateConfig = { dateFrom, dateTo };
  const additionalFilter = { nominatedById };

  const [error, nominations] = await ing(connector.findAllByDate('Nomination', dateConfig, additionalFilter));

  if (error) {
    logger(error);
    return devMode ? error : new Error('Oops... something went wrong');
  }

  if (nominations.length >= 1) {
    return new Error(`Nomination already created for this month by ${nominatedById}. Use 'updateNomination' instead.`);
  }

  return skip;
};

module.exports = {
  validateNomineesPointsResolver,
  validateNominationMonthUniqueness,
};
