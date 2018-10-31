const express = require('express');
const mongo = require('./mongo');
const router = express.Router();

const users = mongo.then(client => client.db().collection('users'));

router.post('/register', (req, res) => {
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
		.then(value => res.json(value))
		.catch(error => res.status(500).send(error));
});

router.post('/login', (req, res) => {
	const {username, password} = req.body;

	if (!(username && password)) {
		return res.status(400).send('Invalid username or password.');
	}

	const user = {username, password};
	return this.users.findOne(user)
		.then(value => res.json(value))
		.catch(error => res.status(500).send(error));
});

router.get('/search', (req, res) => {
	const {
		query: {name, university}
	} = req;

	let searchQuery;
	if (name) {
		searchQuery = {$or: [{firstName: name}, {lastName: name}]};
	} else if (university) {
		searchQuery = {'education.university': university};
	}

	if (!searchQuery) {
		return res.status(400).json({message: 'Missing search parameters.'});
	}

	return this.users.find(searchQuery).toArray()
		.then(value => res.json(value))
		.catch(error => res.status(500).send(error))
});


module.exports = router;
