// core modules

// 3rd party GraphQLString
const {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');

// internal alias modules

// internal modules
const { NominationType } = require('../../../../models');

const addNomination = {
  type: NominationType,
  description: 'Add new nomination',
  args: {
    nominatedById: { type: new GraphQLNonNull(GraphQLID) },
    nomineeId: { type: new GraphQLNonNull(GraphQLID) },
    categoryId: { type: new GraphQLNonNull(GraphQLID) },
    numberOfPoints: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: (parent, args, { connector }) => connector.insertOne('Nomination', { createdAt: new Date(), ...args }),
};

// const updateUser = {
//   type: UserType,
//   description: 'Add new Zilker user',
//   args: {
//     username: { type: GraphQLString },
//     email: { type: GraphQLString },
//     input: { type: UserInputType },
//   },
//   resolve: combineResolvers(
//     userRoleValidator([roles.admin]),
//     (parent, { email, username, input: { fullName, role } }, { connector }) => {
//       if (role && !isProvidedRoleValid(role)) {
//         throw Error('Invalid role provided. Please check documentation.');
//       }
//
//       if (!isAnyMandatoryFieldProvided(email, username)) {
//         throw Error('Please provide either username or an email');
//       }
//
//       const query = username ? { username } : { email };
//       const updateFilter = pickThruthy({ fullName, role });
//
//       return connector.findOneAndUpdate('User', query, updateFilter);
//     },
//   ),
// };
//
// const deleteUser = {
//   type: GraphQLString,
//   description: 'Delete Zilker user by username (or even email)',
//   args: {
//     username: { type: GraphQLString },
//     email: { type: GraphQLString },
//   },
//   resolve: combineResolvers(
//     userRoleValidator([roles.admin]),
//     async(parent, { username, email }, { connector }) => {
//       if (!isAnyMandatoryFieldProvided(username, email)) {
//         throw Error('Please provide either username or an email');
//       }
//
//       const deleteFilter = username ? { username } : { email };
//       const [error] = await ing(connector.deleteOne('User', deleteFilter));
//
//       return error
//         ? `Unable to delete Zilker user [${username || email}]`
//         : `Successfully deleted Zilker user [${username || email}]`;
//     },
//   ),
// };

module.exports = {
  addNomination,
  // updateUser,
  // deleteUser,
};
