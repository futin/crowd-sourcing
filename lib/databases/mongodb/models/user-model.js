// core node modules

// 3rd party modules
const mongoose = require('mongoose');
const findOrCreate = require('findorcreate-promise');

// internal alias modules

// internal modules

const { Schema } = mongoose;

const UserSchema = Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  fullName: String,
  role: String,
  pointsToAssign: String,
});

// Adds support for findOrCreate
UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);
