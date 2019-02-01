const rsConf = {
  _id: 'rs0',
  members: [
    { _id: 0, host: '192.168.1.183:27017' },
    { _id: 1, host: '192.168.1.183:27018' },
    { _id: 2, host: '192.168.1.183:27019' },
  ],
};

rs.initiate(rsConf);
rs.conf();
