const MongoClient = require('mongodb').MongoClient;
const express = require('express');

class Server {
	constructor(mongoUrl, appPort) {
		this.app = express();
		this.config();
		MongoClient.connect(mongoUrl, {useNewUrlParser: true}).then(client => {
			this.users = client.db().collection('users');
			return this.start(appPort);
		})
	}

	config() {
		this.app.use((req, res, next) => {
			console.log(req.url);
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});

		this.app.use(express.json());

		this.app.post('/register', (req, res) => {
			const {
				username,
				password,
				firstName,
				lastName,
				address: {city, state},
				education: {university, degree, major},
				email
			} = req.body;

			if (!(username && password)) {
				return res.status(400).send('Invalid username or password.');
			}

			const user = {
				username,
				password,
				firstName,
				lastName,
				address: {city, state},
				education: {university, degree, major},
				email
			};
			return this.users.insertOne(user)
				.then(value => {
					console.info('value', value);
					return value.result.ok && value.result.n > 0 ? res.json(value.ops[0]) : res.json(null);
				})
				.catch(error => {
					console.error('Error', error);
					return res.status(500).send(error);
				});
		});

		this.app.post('/login', (req, res) => {
			console.log('req body', req.body);
			const {username, password} = req.body;

			if (!(username && password)) {
				return res.status(400).send('Invalid username or password.');
			}

			const user = {username, password};
			return this.users.findOne(user)
				.then(value => res.json(value))
				.catch(error => res.status(500).send(error));
		});

		this.app.get('/search', (req, res) => {
			const {
				query: {name, university}
			} = req;

			const searchQuery = {};

			if (name) {
				Object.assign(searchQuery, {$or: [{firstName: name}, {lastName: name}]});
			}

			if (university) {
				Object.assign(searchQuery, {'education.university': university});
			}

			return this.users.find(searchQuery).toArray()
				.then(value => res.json(value))
				.catch(error => res.status(500).send(error))
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
