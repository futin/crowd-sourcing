// core modules

// 3rd party modules
const { argv } = require('yargs');

// internal alias modules
const { settings: { environment, databases: { mongodb: { url: configMongoUrl } } } } = require('../../../config');

// internal modules
const scriptRunner = require('./script-runner');

const {
  MONGO_SERVERS_PATH: serversPath,
} = argv;
const { log } = console;
// if serversPath is provided, build the url. Otherwise just use the url from config
const url = serversPath ? `mongodb://${serversPath}` : configMongoUrl;

const createNomination = [
  {
    dbName: `crowd-source-${environment}`,
    collectionName: 'users',
    findAndUpdate: true,
    action: async (collection, user, dbInstance) => {
      const Nominations = dbInstance.collection('nominations');
      const Nominee = dbInstance.collection('nominees');
      const Categories = dbInstance.collection('categories');

      const category = await Categories.findOne({ name: 'Machine' });

      const { _id: categoryId } = category;
      const { _id: userId } = user;

      const nomineeInstance = await Nominee.insertOne({
        categoryId,
        userId,
        numberOfPoints: 10,
      });

      const nomination = {
        nominatedById: userId,
        nomineeIds: [nomineeInstance.insertedId],
        createdAt: new Date(),
      };

      const nominationInstance = await Nominations.insertOne(nomination);

      return Nominee.updateOne(
        { _id: nomineeInstance.insertedId }, // filter
        { $set: { nominationId: nominationInstance.insertedId } }, // update
      );
    },
  },
];

module.exports = scriptRunner(createNomination, url)
  .then(() => (log('Nomination inserted!'), process.exit()))
  .catch(err => log(err));
