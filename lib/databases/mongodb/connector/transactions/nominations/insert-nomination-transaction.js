// core modules

// 3rd party modules
const debug = require('debug');

// internal alias modules
const {
  constants: {
    loggerNamespaces: { insertNominationTransactionNamespace },
    errors,
  },
} = require('@config');

// internal modules
const { mongodbIdBuilder } = require('../../../utils');

const logger = debug(insertNominationTransactionNamespace);

/**
 * Implementation of Nomination insertion transaction.
 *
 * @param {Object} mongoose               - mongoose library, used to start the session
 * @param {Function} executeDaoMethod     - used to execute any available Dao method
 * @param {Object} nominationConfig       - holds information about Nomination issuer and nominees that
 *                                          should be updated
 * @returns {Promise<T | never>}
 */
const insertNominationTransaction = async (mongoose, executeDaoMethod, nominationConfig) => {
  logger('InsertNominationTransaction called with configuration', nominationConfig);

  const { nominatedById, nominees } = nominationConfig;

  let session = null;
  let nomination = null;

  // start a transaction session
  return (
    mongoose
      .startSession()
      /**
       * Start the session and decrease user's pointsToAssign state
       */
      .then((_session) => {
        session = _session;
        session.startTransaction();

        const totalSumOfNomineePoints = nominees.reduce((sum, nominee) => sum + nominee.numberOfPoints, 0);

        // we need to provide negative value in order to "decrement" points to assign
        const updateData = { $inc: { pointsToAssign: -totalSumOfNomineePoints } };
        const query = { _id: mongodbIdBuilder(nominatedById) };
        const options = { session };

        return executeDaoMethod('updateOne', 'User', query, updateData, options);
      })
      .then(() => executeDaoMethod('insertMany', 'Nominee', nominees, { session }))
      /**
       * Once Nominees are persisted, create Nomination with a reference to created Nominees
       */
      .then(async (nomineeInstances = []) => {
        logger('Nominees inserted ', nomineeInstances);

        const nomineeIds = nomineeInstances.map(nominee => nominee.id);
        // Nomination we want to insert. It has to be an array since we are also passing "options" argument.
        const dataToInsert = [{ createdAt: new Date(), nominatedById, nomineeIds }];
        const options = { session };

        // since we are providing "options" here, the collection must be passed as an array
        return executeDaoMethod('insertOne', 'Nomination', dataToInsert, options);
      })
      /**
       * Once Nomination is persisted, assign Nomination reference to each Nominee
       */
      .then(([nominationInstance]) => {
        logger('Nomination created ', nominationInstance.toObject());

        // keep the reference to nomination, so we can return it in the next iteration
        nomination = nominationInstance;

        const { nomineeIds, id } = nomination;

        // ids that require update
        const filter = { _id: { $in: nomineeIds } };
        const updateData = { nominationId: id };
        const options = { session };

        return executeDaoMethod('updateMany', 'Nominee', filter, updateData, options);
      })
      /**
       * Finally, commit the transaction and return newly created Nomination
       */
      .then(async (nomineeInstances = []) => {
        await session.commitTransaction();

        logger('Nominees updated and session committed', nomineeInstances);

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

module.exports = insertNominationTransaction;
