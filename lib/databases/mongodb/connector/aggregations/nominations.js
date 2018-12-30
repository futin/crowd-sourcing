// core modules

// 3rd party modules

// internal alias modules
const { ing } = require('@utils');

// internal modules
const { mongodbIdBuilder } = require('../../utils');

/**
 * Method is used to find all Nominees by the Nomination Id, and $sum points by all nominees.
 * We need these points to determined if a user is allowed to post a Nomination update.
 *
 * @param models
 * @param nominationId
 * @returns {Promise<*|$group.totalPoints|{$sum}>}
 */
const calculateNomineePointsByNominationId = async (models, nominationId) => {
  const { Nominee: NomineeModel } = models;
  const [err, aggregationResult] = await ing(
    NomineeModel.aggregate([
      { $match: { nominationId: mongodbIdBuilder(nominationId) } },
      { $group: { _id: null, totalPoints: { $sum: '$numberOfPoints' } } },
    ]),
  );

  if (err) {
    throw err;
  }

  // aggregation result should always have a single object with "totalPoints" field
  // otherwise return undefined
  return aggregationResult && aggregationResult[0] && aggregationResult[0].totalPoints;
};

module.exports = {
  calculateNomineePointsByNominationId,
};
