// core modules
const util = require('util');

// 3rd party modules
const debug = require('debug');

// internal alias modules
const {
  constants: {
    loggerNamespaces: {
      nominationTransaction,
    },
    errors,
  },
} = require('@config');

// internal modules
const { mongodbIdBuilder } = require('../../utils');

const logger = debug(nominationTransaction);

/**
 * Nomination transaction implementation, where:
 *  1. Nominator's pointToAssign are decreased by the total sum of points given to nominees
 *  2. Nominees are being extracted from nomination configuration and inserted in db
 *  3. New Nomination gets inserted into db with a reference to previously created Nominees
 *  4. Nominees are being updated by previously inserted/created Nomination
 *
 * If any of these steps fail, transaction is aborted immediately.
 *
 * @param {Object} mongoose
 * @param {Function} execute
 * @param {Object} nominationConfig
 * @returns {Promise<T | never>}
 */
const insertNominationTransaction = async (mongoose, execute, nominationConfig) => {
  logger('InsertNominationTransaction called with configuration', nominationConfig);

  const { nominatedById, nominees } = nominationConfig;

  let session = null;
  let nomination = null;

  // start a transaction session
  return mongoose.startSession()
    .then((_session) => {
      session = _session;
      session.startTransaction();

      const totalSumOfNomineePoints = nominees.reduce((sum, nominee) => sum + nominee.numberOfPoints, 0);

      // we need to provide negative value in order to "decrement" points to assign
      const updateData = { $inc: { pointsToAssign: -totalSumOfNomineePoints } };
      const query = { _id: mongodbIdBuilder(nominatedById) };
      const options = { session };

      return execute('User', 'updateOne', query, updateData, options);
    })
    .then(() => execute('Nominee', 'insertMany', nominees, { session }))
    .then(async (nomineeInstances = []) => {
      logger('Nominees inserted ', nomineeInstances);

      const nomineeIds = nomineeInstances.map(nominee => nominee.id);
      // since we are providing "options" here, the collection must be passed as an array
      return execute('Nomination', 'create', [{ createdAt: new Date(), nominatedById, nomineeIds }], { session });
    })
    .then(([nominationInstance]) => {
      logger('Nomination created ', nominationInstance.toObject());

      // keep the reference to nomination, so we can return it in the next iteration
      nomination = nominationInstance;

      const { nomineeIds, id } = nomination;

      // ids that require update
      const filter = { _id: { $in: nomineeIds } };

      return execute('Nominee', 'updateMany', filter, { nominationId: id }, { session });
    })
    .then((nomineeInstances = []) => {
      logger('Nominees updated ', nomineeInstances);

      session.commitTransaction();
      return nomination;
    })
    .catch(async (error) => {
      await session.abortTransaction();

      if (error.errorLabels[0] === 'TransientTransactionError') {
        // assign a custom error type, so the caller can apply retry logic
        Object.assign(error, { customErrorType: errors.RETRY_ERROR });
      }

      throw error;
    });
};

module.exports = {
  insertNominationTransaction,
};
