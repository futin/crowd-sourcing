// core modules

// 3rd party modules
const { GraphQLList, GraphQLString } = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules
const { constants: { roles } } = require('@config');

// internal modules
const { NominationType } = require('../../../models');
const { userRoleValidator } = require('../../utils');

// const nomination = {
//   type: NominationType,
//   description: 'Fetch single nomination',
//   args: { name: { type: GraphQLString } },
//   resolve: combineResolvers(
//     userRoleValidator([roles.admin]),
//     (parent, { name }, { connector }) => connector.findOne('Category', { name }),
//   ),
// };

const nominations = {
  type: new GraphQLList(NominationType),
  description: 'Fetch list of all nomination',
  resolve: combineResolvers(
    userRoleValidator([roles.admin]),
    (parent, args, { connector }) => connector.findAll('Nomination'),
  ),
};

module.exports = {
  // nomination,
  nominations,
};
