module.exports = function (config) {
	'use strict';

	config.set({
		// basePath: '../../',
		frameworks: ['jasmine'],
		files: [
			'node_modules/lodash/index.js',
			'node_modules/angular/angular.js',
			'node_modules/angular-route/angular-route.js',
			'node_modules/angular-mocks/angular-mocks.js',
			'js/**/*.js',
			'test/**/*.js'
		],
		autoWatch: true,
		singleRun: false,
		browsers: ['Chrome']
	});
};
