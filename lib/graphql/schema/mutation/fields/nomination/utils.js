// core node modules

// 3rd party modules
const { skip } = require('graphql-resolvers');
const debug = require('debug');

// internal alias modules
const {
  settings: {
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

/**
 * Nominee points must be positive integers and must not be greater then the Nominator's assign points
 *
 * @param {Object} parent
 * @param {Array} nominees
 * @param {Object} user
 * @returns {Error}
 */
const validateNomineesPointsResolver = (parent, { nominees }, { user }) => {
  // check if non-positive integer is provided
  if (!nominees.every(nominee => nominee.numberOfPoints > 0)) {
    throw new Error('Nominees\' points must be greater then 0');
  }

  // now check if the total number of points is lower then provided maximum value
  const numberOfPointsSum = nominees.reduce((sum, nominee) => sum + nominee.numberOfPoints, 0);

  return user.pointsToAssign >= numberOfPointsSum
    ? skip
    : new Error(`Invalid number of points. Allowed sum: ${user.pointsToAssign}, but received ${numberOfPointsSum}`);
};

/**
 * User is allowed to make a single Nomination per month.
 *
 * @param {Object} parent
 * @param {Object} args
 * @param {Object} connector
 * @param {Object} user
 * @returns {Promise<*>}
 */
const validateNominationMonthUniqueness = async (parent, args, { connector, user }) => {
  const { id: nominatedById } = user;
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

/**
 * Self-nominations are not allowed, make sure that this does not happen.
 *
 * @param {Object} parent
 * @param {Object} user
 * @param {Array} nominees
 */
const validateNomineesUniqueness = (parent, { nominees }, { user }) =>
  (nominees.map(nominee => nominee.userId).includes(user.id)
    ? new Error('Self-nomination is not allowed.')
    : skip);

module.exports = {
  validateNomineesPointsResolver,
  validateNominationMonthUniqueness,
  validateNomineesUniqueness,
};
