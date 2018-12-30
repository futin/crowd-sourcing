// core node modules

// 3rd party modules
const { skip } = require('graphql-resolvers');
const debug = require('debug');
const _ = require('lodash');

// internal alias modules
const {
  settings: { environment },
  constants: {
    loggerNamespaces: { updateNominationUtilsNamespace },
  },
} = require('@config');
const { ing } = require('@utils');

// internal modules

const logger = debug(updateNominationUtilsNamespace);
const devMode = /dev|local/.test(environment);

/**
 * Nominee points must be positive integers and must not be greater then the Nominator's assign points.
 * We must also compare the previous nomination state with the updating one.
 * numberOfPointsState indicate the difference between these 2 states:
 *  1. currentState > previousState  - validation will pass if user's pointsToAssign are greater then this value
 *  2. currentState == previousState - validation will pass if user's pointsToAssign are greater then this value
 *  3. currentState < previousState  - validation should always pass, and user's pointsToAssign should be
 *                                     updated at the end (since this is a negative value)
 *
 * @param {Object} parent
 * @param {String} nominationId
 * @param {Array} nominees
 * @param {Object} context
 * @returns {Error}
 */
const validateNomineesPointsResolver = async (parent, { nominationId, nominees }, context) => {
  const { connector, user } = context;

  // check if non-positive integer is provided
  if (!nominees.every(nominee => nominee.numberOfPoints > 0)) {
    throw new Error("Nominees' points must be greater then 0");
  }

  // get the number of points for the provided nominees
  const numberOfProvidedPoints = nominees.reduce((sum, nominee) => sum + nominee.numberOfPoints, 0);

  // get the number of points for the previous nominees
  const [errNomination, numberOfCurrentPoints] = await ing(
    connector.executeAggregation('calculateNomineePointsByNominationId', nominationId),
  );

  if (errNomination) {
    logger(errNomination);
    return devMode ? errNomination : new Error('Oops... something went wrong');
  }

  if (!numberOfCurrentPoints) {
    const errorMsg = 'Number of points should be available, something went wrong with aggregation pipeline!';
    logger(errorMsg);

    return devMode ? new Error(errorMsg) : new Error('Oops... something went wrong');
  }

  const numberOfPointsState = numberOfProvidedPoints - numberOfCurrentPoints;

  // fetch user from db in order to extract latest pointsToAssign
  const [error, userInstance] = await ing(connector.findById('User', user.id));

  if (error) {
    logger(error);
    return devMode ? error : new Error('Oops... something went wrong');
  }

  if (userInstance.pointsToAssign >= numberOfPointsState) {
    // since we already calculated the difference in points, add it to context, so it can be used later
    // reverse it, since positive number means that the number of user's pointsToAssign should be "decreased",
    // and opposite, negative number indicates that the points should be "increased"
    _.merge(context, { extras: { pointsToAssign: -numberOfPointsState } });
    return skip;
  }

  return new Error(`Invalid number of points.
   Allowed sum: ${userInstance.pointsToAssign}, but received ${numberOfPointsState}`);
};

/**
 * User is allowed to update only Nomination from the current month.
 * User is allowed to update only Nomination the he/she issued.
 * @param {Object} parent
 * @param {Object} args
 * @param {Object} connector
 * @param {Object} user
 * @returns {Promise<*>}
 */
const validateNominationDateCreationAndIssuer = async (parent, { nominationId }, { connector, user }) => {
  const [error, nomination] = await ing(connector.findById('Nomination', nominationId));

  if (error) {
    logger(error);
    return devMode ? error : new Error('Oops... something went wrong');
  }

  if (!nomination) {
    return new Error(`Nomination with id ${nominationId} was not found.`);
  }
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth());

  const { createdAt, nominatedById } = nomination;

  if (startOfMonth > createdAt) {
    return new Error('Updates of old Nominations is not permitted');
  }

  return nominatedById.toString() === user.id
    ? skip
    : new Error(`Unauthorized Nomination update request for ${nominationId}`);
};

module.exports = {
  validateNomineesPointsResolver,
  validateNominationDateCreationAndIssuer,
};
