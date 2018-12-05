'use strict';

// node core modules

// 3rd party modules
const mongoose = require('mongoose');

// internal modules

const { Schema } = mongoose;

const HandleSchema = Schema({
  handleName: String,
  __v: { type: Number, select: false },
});

HandleSchema.index({ handleName: 1 });

module.exports = mongoose.model('Handle', HandleSchema);
