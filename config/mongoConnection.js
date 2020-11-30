const MongoClient = require('mongodb').MongoClient;

let _connection;
let _db;

module.exports = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        _db = await _connection.db('Lighthouse');
    }

    return _db;
};
