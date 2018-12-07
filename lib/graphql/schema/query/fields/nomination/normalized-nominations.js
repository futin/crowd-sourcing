// core modules

// 3rd party modules
const { GraphQLList } = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules
const { constants: { roles } } = require('@config');

// internal modules
const { NominationType } = require('../../../../models/index');
const { userRoleValidator } = require('../../../utils/index');
//
// const nomination = {
//   type: NominationType,
//   description: 'Fetch a single normalized nomination',
//   args: { username: { type: GraphQLString } },
//   resolve: combineResolvers(
//     userRoleValidator([roles.admin]),
//     (parent, args, { connector }) => connector.findAll('Nomination'),
//   ),
// };

const nominations = {
  type: new GraphQLList(NominationType),
  description: 'Fetch list of all normalized nominations',
  resolve: combineResolvers(
    userRoleValidator([roles.admin]),
    (parent, args, { connector }) => connector.findAll('Nomination'),
  ),
};

module.exports = {
  nominations,
};
