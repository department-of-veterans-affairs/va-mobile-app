const { join } = require('path');
const { config } = require('./wdio.base.conf');

const appPath = join(process.cwd(), './ios/output/Build/Products/Release-iphonesimulator/VAMobile.app')

config.capabilities = [
	{
		platformName: 'iOS',
		maxInstances: 2,
		'appium:deviceName': 'iPhone 11',
		'appium:automationName': 'XCUITest',
		'appium:noReset': false,
		'appium:newCommandTimeout': 240,
		"appium:includeSafariInWebviews": true,
//		"appium:fullContextList": true,
		"appium:webviewConnectTimeout": 20000,
		"appium:ignoreAboutBlankUrl": false,
		'appium:app': appPath
	},
	/*	{
			platformName: 'iOS',
			maxInstances: 2,
			'appium:deviceName': 'iPhone 11 Pro',
			'appium:automationName': 'XCUITest',
			'appium:noReset': false,
			'appium:newCommandTimeout': 120,
			'appium:app': appPath
		},*/
]
exports.config = config;
