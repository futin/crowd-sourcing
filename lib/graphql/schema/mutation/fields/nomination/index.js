// core modules

// 3rd party GraphQLString
const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

// internal alias modules
const { ing } = require('@utils');

// internal modules
const { NominationType } = require('../../../../models');
const { NomineeInputType } = require('./input-types');

const addNomination = {
  type: NominationType,
  description: 'Add new nomination',
  args: {
    nominatedById: { type: new GraphQLNonNull(GraphQLID) },
    nominees: { type: new GraphQLList(NomineeInputType) },
  },
  // TODO: validate entered data
  resolve: async (parent, { nominatedById, nominees }, { connector }) => {
    const nomineesTransformed = nominees.map(nominee => ({ nominatedById, ...nominee }));
    const [error, nomineesInstances] = await ing(connector.insertMany('Nominee', nomineesTransformed));

    if (error) {
      throw error;
    }

    const nomineeIds = nomineesInstances.map(nominee => nominee.id);

    return connector.insertOne('Nomination', { createdAt: new Date(), nominatedById, nomineeIds });
  },
};

module.exports = {
  addNomination,
};
