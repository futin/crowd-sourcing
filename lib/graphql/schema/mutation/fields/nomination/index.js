// core modules
const util = require('util');

// 3rd party GraphQLString
const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules
const {
  settings: {
    transactionConfig: {
      maxAttempts,
      timeout,
    },
  },
  constants: {
    errors,
  },
} = require('@config');

// internal modules
const { NominationType } = require('../../../../models');
const { NomineeInputType } = require('./input-types');
const {
  validateNomineesPointsResolver, validateNominationMonthUniqueness, validateSelfNominations,
  validateNomineesUniqueness,
} = require('./utils');

function timeoutFn(ms) {
  util.promisify(setTimeout);
  return new Promise(p => setTimeout(p, ms));
}

const addNominationResolver = (parent, args, context) => {
  return combineResolvers(
    // validateNominationMonthUniqueness,
    validateNomineesPointsResolver,
    // validateSelfNominations,
    // validateNomineesUniqueness,
    (_, { nominees }, { connector, user }) =>
      connector.executeTransaction('insertNominationTransaction', { nominees, nominatedById: user.id })
        .then(data => data)
        .catch(async (error) => {
          let { extras: { attempts = 0 } = {} } = context;

          // custom retry logic. If attempts number surpasses the maxAttempts, simply return the error
          if (error.customErrorType === errors.RETRY_ERROR && attempts <= maxAttempts) {
            // increase number of attempts by 1
            Object.assign(context, { extras: { attempts: attempts += 1 } });
            // wait until the method is called again
            await timeoutFn(timeout);

            return addNominationResolver(parent, args, context);
          }

          return error;
        }),
  )(parent, args, context);
};

const addNomination = {
  type: NominationType,
  description: 'Add new nomination',
  args: {
    nominees: { type: new GraphQLNonNull(new GraphQLList(NomineeInputType)) },
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: addNominationResolver,
};

// const updateNomination = {
//   type: NominationType,
//   description: 'Update nomination by nominationId',
//   args: {
//     nominationId: { type: new GraphQLNonNull(GraphQLID) },
//     nominees: { type: new GraphQLNonNull(new GraphQLList(NomineeInputType)) },
//   },
//   resolve: combineResolvers(
//     validateNomineesPointsResolver,
//     async (parent, { nominationId, nominees }, { connector }) => {
//       const nomineesTransformed = nominees.map(nominee => ({ nominationId, ...nominee }));
//       const [error, nomineeInstances] = await ing(connector.upsertMany('Nominee', nomineesTransformed));
//
//       if (error) {
//         throw error;
//       }
//
//       // extract list of nomineeIds, and create a Nomination
//       const nomineeIds = nomineeInstances.map(nominee => nominee.id);
//
//       return connector.findOneAndUpdate('Nomination', { nominationId }, { nomineeIds });
//     },
//   ),
// };

module.exports = {
  addNomination,
  // updateNomination,
};
