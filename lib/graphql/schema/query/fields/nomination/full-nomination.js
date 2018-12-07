// core modules

// 3rd party modules
const { GraphQLList, GraphQLID } = require('graphql');

// internal alias modules

// internal modules
const { NominationFullType } = require('../../../../models');
const { DateInputType } = require('./input-types');
const { pickThruthy } = require('../../../utils');

const fullNominations = {
  type: new GraphQLList(NominationFullType),
  description: 'Fetch list of full nominations (with all relations)',
  args: {
    nominatedById: { type: GraphQLID },
    nomineeId: { type: GraphQLID },
    categoryId: { type: GraphQLID },
    date: { type: DateInputType },
  },
  resolve: (parent, args, { connector }) => {
    const {
      nominatedById, nomineeId, categoryId, date,
    } = args;

    const filter = pickThruthy({ nominatedById, nomineeId, categoryId });

    if (date) { return connector.findAllByDate('Nomination', date, filter); }

    // if no params were provided, return all nominations
    return connector.findAll('Nomination', filter);
  },
};

module.exports = {
  fullNominations,
};
