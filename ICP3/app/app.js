'use strict';

// Declare app level module which depends on views, and components
const app = angular.module('icp3app', [
	'ngRoute',
	'icp3app.food'
]);

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');

	$routeProvider.otherwise({redirectTo: '/food'});
}]);
