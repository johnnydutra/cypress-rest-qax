const { MongoClient } = require('mongodb');

const mongoUri = 'mongodb+srv://cypress:abcdef123456@cluster0.dbreo.mongodb.net/markdb?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(mongoUri);

async function connect() {
  await client.connect();
  return client.db('markdb');
};

async function disconnect() {
  await client.close();
};

module.exports = { connect, disconnect };