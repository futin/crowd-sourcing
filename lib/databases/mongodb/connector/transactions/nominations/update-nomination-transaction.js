// core modules

// 3rd party modules
const debug = require('debug');

// internal alias modules
const {
  constants: {
    loggerNamespaces: {
      updateNominationTransactionNamespace,
    },
    errors,
  },
} = require('@config');

// internal modules
const { mongodbIdBuilder } = require('../../../utils');

const logger = debug(updateNominationTransactionNamespace);

/**
 * Nomination transaction implementation, where:
 *  1. Nominator's pointToAssign are updated by the points provided from the context
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
const updateNominationTransaction = async (mongoose, execute, nominationConfig) => {
  logger('UpdateNominationTransaction called with configuration', nominationConfig);

  const {
    nominationId, nominees, user, extras,
  } = nominationConfig;

  let session = null;
  let nomination = null;

  // start a transaction session
  return mongoose.startSession()
    .then((_session) => {
      session = _session;
      session.startTransaction();

      if (!(extras && extras.pointsToAssign)) {
        // if extras or numberOfPointsState are not provided,
        // it means that there is no need to update user's assign points
        return true;
      }

      const { pointsToAssign } = extras;

      // provide value extracted from the context, which was set by the validation resolver
      const updateData = { $inc: { pointsToAssign } };

      // we can relay on the validation resolver the context user is the actual
      // Nomination issuer
      const query = { _id: mongodbIdBuilder(user.id) };
      const options = { session };

      return execute('User', 'updateOne', query, updateData, options);
    })
    .then(() => {
      const transformedNominees = nominees.map(nominee => ({ ...nominee, nominationId }));
      return execute('findAndUpsertMany', 'Nominee', transformedNominees, ['nominationId', 'userId'], { session });
    })
    .then((nomineeInstances) => {
      const userIds = nomineeInstances.map(nominee => nominee.userId);
      const findAllFilter = { nominationId, userId: { $nin: userIds } };
      const options = { session };

      const findAll = execute('findAll', 'Nominee', findAllFilter, options);

      const nomineeIds = nomineeInstances.map(nominee => nominee.id);
      const query = { _id: nominationId };
      const updateOneFilter = { nomineeIds };

      const updateNomination = execute('findOneAndUpdate', 'Nomination', query, updateOneFilter, options);

      return Promise.all([findAll, updateNomination]);
    })
    .then(([nomineeInstances, nominationInstance]) => {
      nomination = nominationInstance;

      const nomineeIdsToRemove = nomineeInstances.map(nominee => nominee.id);
      return execute('deleteMany', 'Nominee', { _id: { $in: nomineeIdsToRemove } }, { session });
    })
    .then(async () => {
      await session.commitTransaction();
      return nomination;
    })
    .catch(async (error) => {
      await session.abortTransaction();

      if (error.errorLabels && error.errorLabels[0] === 'TransientTransactionError') {
        // assign a custom error type, so the caller can apply retry logic
        Object.assign(error, { customErrorType: errors.RETRY_ERROR });
      }

      throw error;
    });
};

module.exports = updateNominationTransaction;
