'use strict';

const NUTRITIONIX_APP_ID = 'YOUR APP ID HERE';
const NUTRITIONIX_APP_KEY = 'YOUR APP KEY HERE';

const foodModule = angular.module('icp3app.food', ['ngRoute']);

foodModule.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/food', {
		templateUrl: 'food/food.html',
		controller: 'FoodController'
	});
}]);

foodModule.controller('FoodController', function ($scope, $http) {

	$scope.findAndSpeak = function () {
		Promise.all([$scope.getAudio(), $scope.getNutrition()]);
	};

	$scope.getAudio = function () {
		return $scope.getToken().then(token => $scope.buildUrl({
			host: 'stream.watsonplatform.net',
			path: 'text-to-speech/api/v1/synthesize',
			query: {
				accept: 'audio/mp3',
				voice: 'en-US_AllisonVoice',
				text: $scope.term,
				'watson-token': token
			}
		})).then(url => {
			const audio = new Audio(url);
			return audio.play();
		});
	};

	$scope.getNutrition = function () {
		return $http.get($scope.buildUrl({
			host: 'api.nutritionix.com',
			path: `v1_1/search/${encodeURIComponent($scope.term)}`,
			query: {
				results: '0:1',
				fields: 'nf_calories,nf_serving_weight_grams',
				appId: NUTRITIONIX_APP_ID,
				appKey: NUTRITIONIX_APP_KEY
			}
		})).then(results => {
			// Overly complex way of extracting parameters without needing to check for null
			const {
				data: {
					hits: [{
						fields: {
							nf_calories: calories,
							nf_serving_weight_grams: weight
						} = {}
					} = {}] = []
				} = {}
			} = results || {};

			Object.assign($scope, {calories, weight});
		});
	};

	// Components to URL.

	$scope.buildUrl = function ({protocol = 'https', host, port = 0, path, query = {}}) {
		const portStr = port ? `:${port}` : '';
		const queryParts = Object.entries(query)
			.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
		const queryString = queryParts.length ? `?${queryParts.join('&')}` : '';
		return `${protocol}://${host}${portStr}/${path}${queryString}`;
	};

	// Token management.

	$scope.getToken = function () {
		if ($scope.validToken()) {
			return Promise.resolve($scope.auth.token);
		}

		return $scope.loadToken();
	};

	$scope.validToken = function () {
		return $scope.auth && $scope.auth.token && Date.now() < $scope.auth.expires;
	};

	$scope.loadToken = function () {
		return $http.get($scope.buildUrl({
			protocol: 'http',
			host: 'localhost',
			port: 3000,
			path: 'token'
		})).then(results => {
			$scope.auth = results.data;
			return $scope.auth.token;
		});
	};

	$scope.loadToken(); //Pre-load the token
});
