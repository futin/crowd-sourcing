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

NominationSchema.index({
  nominatedById: 1,
  createdAt: 1,
}, {
  unique: true,
});

NominationSchema.pre('save', async (next, nomination) => {
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
