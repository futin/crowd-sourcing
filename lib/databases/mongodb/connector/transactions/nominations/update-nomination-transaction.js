// core modules

// 3rd party modules
const debug = require('debug');

// internal alias modules
const {
  constants: {
    loggerNamespaces: { updateNominationTransactionNamespace },
    errors,
  },
} = require('@config');

// internal modules
const { mongodbIdBuilder } = require('../../../utils');

const logger = debug(updateNominationTransactionNamespace);

/**
 * Implementation of Nomination full update transaction.
 *
 * @param {Object} mongoose                       - mongoose library, used to start the session
 * @param {Function} executeDaoMethod             - used to execute any available Dao method
 * @param {Object} nominationConfig
 * @param {String} nominationConfig.nominationId  - unique nomination id that is being updated
 * @param {Array} nominationConfig.nominees       - list of nominees that should be updated
 * @param {Object} nominationConfig.user          - user that issued the Nomination
 * @param {Object} nominationConfig.extras        - some additional information collected by the previous operations
 * @returns {Promise<T | never>}
 */
const updateNominationTransaction = async (mongoose, executeDaoMethod, nominationConfig) => {
  logger('UpdateNominationTransaction called with configuration', nominationConfig);

  const {
    nominationId, nominees, user, extras,
  } = nominationConfig;

  let session = null;
  let nomination = null;

  /**
   * Start the session and update user's pointsToAssign state
   */
  return (
    mongoose
      .startSession()
      .then((_session) => {
        session = _session;
        session.startTransaction();

        if (!(extras && extras.pointsToAssign)) {
          // if extras or numberOfPointsState are not provided,
          // it means that there is no need to update user's assign points
          return true;
        }

        const { pointsToAssign } = extras;

        // update user's pointsToAssign value. This information was calculated in one of the previous
        // processes. If pointsToAssign were invalid, we would never get into this point.
        const updateData = { $inc: { pointsToAssign } };
        const query = { _id: mongodbIdBuilder(user.id) };
        const options = { session };

        return executeDaoMethod('updateOne', 'User', query, updateData, options);
      })
      /**
       * Find and upsert Nominees by nominationId and userId. So, if Nominee with the provided identifiers
       * was not found, it is automatically created.
       */
      .then(() => {
        const transformedNominees = nominees.map(nominee => ({
          ...nominee,
          nominationId,
        }));

        // identifiers are used to be queried upon.
        const identifiers = ['nominationId', 'userId'];
        const options = { session };

        return executeDaoMethod('findAndUpsertMany', 'Nominee', transformedNominees, identifiers, options);
      })
      /**
       * This phase contains to actions. Once new Nominees are upserted, we need to:
       *  1.  Remove all "old" Nominees. For that, query operation
       *      $nin (not in) has been use in order to find all Nominees that have the same nominationId, but
       *      are not any of the provided userIds.
       *  2.  Update Nomination with the newly upserted Nominee instances.
       */
      .then((nomineeInstances) => {
        logger('Nominees upserted: ', nomineeInstances);

        // findAll arguments
        const userIds = nomineeInstances.map(nominee => nominee.userId);

        // find all Nominees that does not have provided userIds.
        // If there are any, we must remove them since they are obsolete now.
        const findAllNotInFilter = {
          nominationId,
          userId: { $nin: userIds },
        };
        const options = { session };

        const findAll = executeDaoMethod('findAll', 'Nominee', findAllNotInFilter, options);

        // findOneAndUpdate arguments
        const nomineeIds = nomineeInstances.map(nominee => nominee.id);
        const query = { _id: nominationId };
        const updateOneFilter = { nomineeIds };

        const updateNomination = executeDaoMethod('findOneAndUpdate', 'Nomination', query, updateOneFilter, options);

        return Promise.all([findAll, updateNomination]);
      })
      /**
       * Once Nomination has been updated, store it into temp "nomination" variable, since that is the
       * Nomination instance that is ready and can be returned...
       *
       * But before we can do that, we must perform "cleanup" of the obsolete Nominees, and remove all of them!
       */
      .then(([nomineeInstances, nominationInstance]) => {
        logger('Obsolete Nominees list: ', nomineeInstances);

        nomination = nominationInstance;

        const nomineeIdsToRemove = nomineeInstances.map(nominee => nominee.id);
        const filter = { _id: { $in: nomineeIdsToRemove } };
        const options = { session };

        return executeDaoMethod('deleteMany', 'Nominee', filter, options);
      })
      /**
       * Finally, commit the transaction and return updated Nomination
       */
      .then(async () => {
        await session.commitTransaction();

        logger('Nomination updated and session committed', nomination);

        return nomination;
      })
      /**
       * If anything went wrong, abort the transaction immediately!
       * If the errorLabel indicates "TransientTransactionError", initiate retry logic
       */
      .catch(async (error) => {
        await session.abortTransaction();

        logger('Session aborted with error', error);

        if (error.errorLabels && error.errorLabels[0] === 'TransientTransactionError') {
          // assign a custom error type, so the caller can apply retry logic
          Object.assign(error, { customErrorType: errors.RETRY_ERROR });
        }

        throw error;
      })
  );
};

module.exports = updateNominationTransaction;
