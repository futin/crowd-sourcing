// core node modules

// 3rd party modules
const mongoose = require('mongoose');
const debug = require('debug');

// internal alias modules
const { ing } = require('@utils');
// internal modules
const Nominee = require('./nominee-model');

const {
  constants: {
    loggerNamespaces: { nominationModelNamespace },
  },
} = require('@config');

// internal modules

const logger = debug(nominationModelNamespace);

const { Schema } = mongoose;

const NominationSchema = Schema({
  nominatedById: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  nomineeIds: [{
    type: Schema.ObjectId,
    ref: 'Nominee',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// the reason behind this post "save" hook:
//
// 1. In order to create Nomination, we need to create Nominees first
// 2. Once Nominees are created, create Nomination with already created Nominees references
// 3. Once Nomination is created, perform hook to update each Nominee with nominationID
//
// this way, we can create circular reference between Nomination and Nominee, which can be used
// for advance searching mechanism
NominationSchema.post('save', async (nomination) => {
  const { nomineeIds, id } = nomination;

  logger('Activating postSave hook on NominationSchema for id %s', id);

  // ids that require update
  const filter = { _id: { $in: nomineeIds } };

  // actual update
  const update = { nominationId: id };

  // it is necessary to wait for the update, otherwise the update will never happen
  await ing(Nominee.updateMany(filter, update));
});

module.exports = mongoose.model('Nomination', NominationSchema);
