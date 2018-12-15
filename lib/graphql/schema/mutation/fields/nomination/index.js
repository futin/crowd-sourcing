// core modules

// 3rd party GraphQLString
const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules

// internal modules
const { NominationType } = require('../../../../models');
const { NomineeInputType } = require('./input-types');
const { validateNomineesPointsResolver, validateNominationMonthUniqueness } = require('./utils');

const addNomination = {
  type: NominationType,
  description: 'Add new nomination',
  args: {
    nominatedById: { type: new GraphQLNonNull(GraphQLID) },
    nominees: { type: new GraphQLNonNull(new GraphQLList(NomineeInputType)) },
  },
  resolve: combineResolvers(
    validateNominationMonthUniqueness,
    validateNomineesPointsResolver,
    async (parent, args, { connector }) =>
      connector.executeTransaction('insertNominationTransaction', args),
  ),
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
