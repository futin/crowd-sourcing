// core node modules

// 3rd party modules

// internal alias modules
const { mongodb: { connector } } = require('@databases');
const { userService } = require('@services');
const { ing } = require('@utils');

// internal modules

module.exports = async (req, res, next) => {
  const { user } = req;

  if (!user) {
    res.status(401).send({ message: 'Please login first' });
    return;
  }
  const { emails } = user;
  const username = userService.fetchUsernameByEmail(emails[0]);
  const [error, dbUser] = await ing(connector.findOne('User', { username }));

  if (error) {
    next(error);
    return;
  }

  // something went wrong, force user to re-login!
  if (!dbUser) {
    next(new Error('Oops... something went wrong with database'));
    return;
  }

  req.user = dbUser;
  next();
};
