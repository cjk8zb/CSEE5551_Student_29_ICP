/**
 * Created by Marmik on 04/10/2016.
 */
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const path = require('path');
const request = require('request-promise-native');

const api = require('./api');

class Server {
	constructor(mongoUrl, appPort) {
		this.app = express();
		this.config();
		MongoClient.connect(mongoUrl, {useNewUrlParser: true}).then(client => {
			this.users = client.db().collection('demoase');
			return this.start(appPort);
		});
	}

	config() {
		this.app.use((req, res, next) => {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});

		this.app.use('/api', api);

		this.app.use(express.static(path.join(__dirname, '../Client/dist/Client')));

		this.app.get('*', (req, res) => {
			res.sendFile(path.join(__dirname, '../Client/dist/Client/index.html'));
		});
	}

	start(port) {
		const server = this.app.listen(port, () => {
			// var host = server.address().address
			const port = server.address().port;

			console.log("Example app listening at http://127.0.0.1:%s", port);
		});
	}
}

new Server('mongodb://localhost/csee5551', process.env.PORT || 8081);
