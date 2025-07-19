const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

const startInMemoryDB = async () => {
  try {
    console.log('🚀 Starting in-memory MongoDB...');
    mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017, // Use default MongoDB port
        dbName: 'truenumber'
      }
    });
    
    const uri = mongod.getUri();
    console.log('✅ In-memory MongoDB started at:', uri);
    return uri;
  } catch (error) {
    console.error('❌ Failed to start in-memory MongoDB:', error);
    throw error;
  }
};

const stopInMemoryDB = async () => {
  if (mongod) {
    await mongod.stop();
    console.log('🛑 In-memory MongoDB stopped');
  }
};

module.exports = {
  startInMemoryDB,
  stopInMemoryDB
};