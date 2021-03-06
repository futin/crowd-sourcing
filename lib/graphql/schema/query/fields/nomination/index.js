// core modules

// 3rd party modules
const { GraphQLList, GraphQLID } = require('graphql');

// internal alias modules

// internal modules
const { NominationFullType, NominationType } = require('../../../../models');
const { DateInputType } = require('./input-types');
const { pickThruthy } = require('../../../utils');

const fetchNominationByType = type => ({
  type,
  description: 'Fetch a single nomination by id',
  args: { id: { type: GraphQLID } },
  resolve: (parent, { id }, { connector }) => connector.findById('Nomination', id),
});

const fetchNominationsByType = type => ({
  type: new GraphQLList(type),
  description: 'Fetch list of nominations, by nominationId and/or date input',
  args: {
    nominatedById: { type: GraphQLID },
    date: { type: DateInputType },
  },
  resolve: (parent, { nominatedById, date }, { connector }) => {
    const filter = pickThruthy({ nominatedById });

    if (date) {
      return connector.findAllByDate('Nomination', date, filter);
    }

    // if no params were provided, return all nominations
    return connector.findAll('Nomination', filter);
  },
});

// normalized nominations
const nomination = fetchNominationByType(NominationType);
const nominations = fetchNominationsByType(NominationType);

// nominations with full relation list provided
const fullNomination = fetchNominationByType(NominationFullType);
const fullNominations = fetchNominationsByType(NominationFullType);

module.exports = {
  nomination,
  nominations,
  fullNomination,
  fullNominations,
};
