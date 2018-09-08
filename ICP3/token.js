'use strict';

const WATSON_USERNAME = '00000000-0000-0000-0000-000000000000';
const WATSON_PASSWORD = 'YOUR PASSWORD HERE';

const url = 'https://stream.watsonplatform.net/authorization/api/v1/token?url=https://stream.watsonplatform.net/text-to-speech/api';
const auth = 'Basic ' + Buffer.from(WATSON_USERNAME + ":" + WATSON_PASSWORD).toString('base64');

const express = require('express');
const https = require('https');

const app = express();

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:8000");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/token', (req, res) => {
	https.get(url, {headers: {Authorization: auth}}, response => {
		let token = '';
		response.on('data', function (chunk) {
			token += chunk;
		}).on('end', function () {
			res.json({token: decodeURIComponent(token), expires: Date.now() + 36e5});
		});
	});
});

const port = 3000;
app.listen(port, () => console.info('Listening on port', port));
