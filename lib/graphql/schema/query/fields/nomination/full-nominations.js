// core modules

// 3rd party modules
const { GraphQLList } = require('graphql');
const { combineResolvers } = require('graphql-resolvers');

// internal alias modules
const { constants: { roles } } = require('@config');

// internal modules
const { NominationFullType } = require('../../../../models/index');
const { userRoleValidator } = require('../../../utils/index');

const fullNominations = {
  type: new GraphQLList(NominationFullType),
  description: 'Fetch list of full nominations (with all relations)',
  resolve: combineResolvers(
    userRoleValidator([roles.admin]),
    (parent, args, { connector }) => connector.findAll('Nomination'),
  ),
};

module.exports = {
  fullNominations,
};
