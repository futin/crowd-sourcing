// core modules

// 3rd party modules

// internal alias modules
const { settings: { environment, databases: { mongodb: { url: configMongoUrl } } } } = require('../../../config');

// internal modules
const scriptRunner = require('./script-runner');

const {
  MONGO_SERVERS_PATH: serversPath,
} = process.env;
const { log } = console;
// if serversPath is provided, build the url. Otherwise just use the url from config
const url = serversPath ? `mongodb://${serversPath}` : configMongoUrl;

const buildListOfPromises = (items, method) => items.map(item => method(item));

const deleteAllCollections = [
  {
    dbName: `crowd-source-${environment}`,
    collectionName: '',
    // create admin user
    action: async (dbInstance) => {
      const collections = await dbInstance.listCollections().toArray();

      const dropCollectionByName = (collectionName) => {
        log('Dropping collection', collectionName);
        return dbInstance.dropCollection(collectionName);
      };

      return Promise.all(buildListOfPromises(collections.map(collection => collection.name), dropCollectionByName));
    },
  },
];

module.exports = scriptRunner(deleteAllCollections, url)
  .then(() => (log('All collections dropped!'), process.exit())) // eslint-disable-line no-sequences
  .catch(err => log(err));
