// core modules

// 3rd party modules
const { argv } = require('yargs');

// internal alias modules
const { settings: { environment, databases: { mongodb: { url: configMongoUrl } } } } = require('../../../config');

// internal modules
const scriptRunner = require('./script-runner');

const {
  MONGO_SERVERS_PATH: serversPath,
  USERNAME_INSERT: username = 'ajevtic',
} = argv;
const { log } = console;

// if serversPath is provided, build the url. Otherwise just use the url from config
const url = serversPath ? `mongodb://${serversPath}` : configMongoUrl;

const insertScripts = [
  {
    dbName: `crowd-source-${environment}`,
    collectionName: 'authusers',
    action: collection => collection.insertOne({ username }),
  },
  {
    dbName: `crowd-source-${environment}`,
    collectionName: 'users',
    // create admin user
    action: collection => collection.insertOne({
      username,
      email: `${username}@ztech.io`,
      fullName: 'admin',
      role: 'admin',
      pointsToAssign: 10,
      isActive: true,
    }),
  },
];

module.exports = scriptRunner(insertScripts, url)
  .then(() => (log('Users inserted!'), process.exit())) // eslint-disable-line no-sequences
  .catch(err => log(err));
