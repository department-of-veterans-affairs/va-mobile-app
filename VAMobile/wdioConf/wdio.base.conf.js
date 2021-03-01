exports.config = {
	runner: 'local',
	maxInstances: 1,
	specs: [
		'__tests__/**/*.spec.ts'
	],
	framework: 'mocha',
	mochaOpts: {
		ui: 'bdd',
		timeout: 60000
	},
	reporters: ['spec'],

	logLevel: 'trace',
	// If you only want to run your tests until a specific amount of tests have failed use bail (default is 0 - don't bail, run all tests).
	bail: 0,
	//baseUrl: 'http://localhost',

	// Default timeout for all waitFor* commands.
	waitforTimeout: 10000,

	// Default timeout in milliseconds for request if browser driver or grid doesn't send response
	connectionRetryTimeout: 120000,
	connectionRetryCount: 3,

	// Test runner services
	// Services take over a specific job you don't want to take care of. They enhance
	// your test setup with almost no effort. Unlike plugins, they don't add new
	// commands. Instead, they hook themselves up into the test process.
	port: 4723,
	//services: [['appium', {args:["--allow-insecure chromedriver_autodownload"]}]],
	services: [['appium', {args:{"logLevel":"debug:debug", "allow-insecure":"chromedriver_autodownload"}}]]
};
