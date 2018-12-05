'use strict';

// core node modules

// 3rd party modules
const mongoose = require('mongoose');
const findOrCreate = require('findorcreate-promise');

// internal modules

const { Schema } = mongoose;

const UserSchema = Schema({
  username: String,
  email: String,
  handle: String,
  role: String,
  __v: { type: Number, select: false },
});

// Adds support for findOrCreate
UserSchema.plugin(findOrCreate);

UserSchema.index({ username: 1, handle: 1 });

module.exports = mongoose.model('User', UserSchema);
