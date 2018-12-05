'use strict';

// node core modules

// 3rd party modules

// internal modules
const User = require('../models/user-model');

const userService = {
  findOrCreateUser(user) {
    const { displayName: username, emails } = user;
    const { value: email } = emails[0];
    const handle = email.split('@')[0];

    return User.findOrCreate({ username, email, handle });
  },
};

module.exports = userService;
