// core node modules

// 3rd party modules
const mongoose = require('mongoose');

// internal alias modules

// internal modules

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

module.exports = mongoose.model('Nomination', NominationSchema);
