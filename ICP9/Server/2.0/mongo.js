const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost/csee5551';
// const promise = MongoClient.connect(url, {useNewUrlParser: true}).then(client => {
// 	this.users = client.db().collection('demoase');
// 	return this.start(appPort);
// });

module.exports = MongoClient.connect(url, {useNewUrlParser: true});
