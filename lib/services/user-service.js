'use strict';

// node core modules

// 3rd party modules

// internal modules
const User = require('../models/user-model');
const AuthUser = require('../models/auth-user-model');

const userService = {
  findOrCreateUser(user) {
    const { displayName: fullName, emails } = user;
    const [email] = emails;

    return User.findOrCreate({ email: email.value, fullName });
  },
  isUserAuthorized: username => AuthUser.findOne({ username }),
};

module.exports = userService;