'use strict';

// core node modules

// 3rd party modules

// internal modules

module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: 'Please login first' });
  }

  return next();
};
