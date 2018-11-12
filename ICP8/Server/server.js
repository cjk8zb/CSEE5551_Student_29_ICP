const express = require('express');
const request = require('request-promise-native');

const app = express();

// CORS
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/airplanes/?(:filterICAO24)?', function (req, res) {
	const {
		params: {filterICAO24},
		query: {minimumLatitude, maximumLatitude, minimumLongitude, maximumLongitude}
	} = req;

	return request({
		uri: 'https://opensky-network.org/api/states/all',
		qs: {
			lamin: minimumLatitude,
			lomin: minimumLongitude,
			lamax: maximumLatitude,
			lomax: maximumLongitude,
			icao24: filterICAO24
		},
		resolveWithFullResponse: true,
		json: true
	}).then(({body}) => {
		const {
			time,  // int   - The time which the state vectors in this response are associated with.
		           //         All vectors represent the state of a vehicle with the interval [time − 1, time].
			states // array - The state vectors.
		} = body;

		const airplanes = (states || []).map(stateVector => {
				const [
					identifier,                // string  - Unique ICAO 24-bit address of the transponder in hex string
				                               //           representation.
					callSign,                  // string? - Call sign of the vehicle (8 chars). Can be null if no call
				                               //           sign has been received.
					countryName,               // string  - Country name inferred from the ICAO 24-bit address.
					lastPositionUpdate,        // int?    - Unix timestamp (seconds) for the last position update.
				                               //           Can be null if no position report was received by OpenSky
				                               //           within the past 15s.
					lastUpdate,                // int     - Unix timestamp (seconds) for the last update in general.
				                               //           This field is updated for any new, valid message received
				                               //           from the transponder.
					longitude,                 // float?  - WGS-84 longitude in decimal degrees. Can be null.
					latitude,                  // float?  - WGS-84 latitude in decimal degrees. Can be null.
					barometricAltitude,        // float?  - Barometric altitude in meters. Can be null.
					isOnGround,                // boolean - Boolean value which indicates if the position was retrieved
				                               //           from a surface position report.
					velocity,                  // float?  - Velocity over ground in m/s. Can be null.
					trueTrack,                 // float?  - True track in decimal degrees clockwise from north
				                               //           (north=0°). Can be null.
					verticalRate,              // float?  - Vertical rate in m/s. A positive value indicates that the
				                               //           airplane is climbing, a negative value indicates that it
				                               //           descends. Can be null.
					sensors,                   // int[]?  - IDs of the receivers which contributed to this state vector.
				                               //           Is null if no filtering for sensor was used in the request.
					geometricAltitude,         // float?  - Geometric altitude in meters. Can be null.
					squawk,                    // string? - The transponder code aka Squawk. Can be null.
					isSpecialPurposeIndicator, // boolean - Whether flight status indicates special purpose indicator.
					sourceValue                // int     - Origin of this state’s position:
				                               //           0 = ADS-B, 1 = ASTERIX, 2 = MLAT
				] = stateVector;

				let source = "";
				switch (sourceValue) {
					case 0:
						source = "ADS-B";
						break;
					case 1:
						source = "ASTERIX";
						break;
					case 2:
						source = "MLAT";
						break;
					default:
						source = "Other";
				}
				return {
					identifier, callSign, countryName, lastPositionUpdate, lastUpdate, longitude, latitude,
					barometricAltitude, isOnGround, velocity, trueTrack, verticalRate, sensors, geometricAltitude,
					squawk, isSpecialPurposeIndicator, source, time
				};
			}
		);
		res.json(airplanes);

	}).catch(error => {
		res.status(400);

		if (!error) {
			res.send({message: 'Unknown error'});
		} else if (typeof error === 'string') {
			res.send({message: error});
		} else if (error.error) {
			res.send(error.error);
		} else if (error.message) {
			res.send({message: error.message});
		} else {
			res.send(error);
		}
	});

});

const server = app.listen(process.env.PORT || 8081, () => {
	console.info("Listening on port", server.address().port);
});
