// core modules

// 3rd party modules
const debug = require('debug');

// internal alias modules
const {
  constants: {
    loggerNamespaces: {
      nominationTransaction,
    },
  },
} = require('@config');

// internal modules

const logger = debug(nominationTransaction);

/**
 * Nomination transaction implementation, where:
 *  1. Nominees are being extracted from nomination configuration and inserted in db
 *  2. New Nomination gets inserted into db with a reference to previously created Nominees
 *  3. Nominees are being updated by previously inserted/created Nomination
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

      return execute('Nominee', 'insertMany', nominees, { session });
    })
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
      return error;
    });
};

module.exports = {
  insertNominationTransaction,
};
