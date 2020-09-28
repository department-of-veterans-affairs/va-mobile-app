const { join } = require('path');
const { config } = require('./wdio.base.conf');

const appPath = join(process.cwd(), './ios/output/AdhocVAAssistant/Build/Products/Debug-iphonesimulator/AdhocVAAssistant.app')

config.capabilities = [
	{
		platformName: 'iOS',
		maxInstances: 2,
		'appium:deviceName': 'iPhone 11',
		'appium:automationName': 'XCUITest',
		'appium:noReset': false,
		'appium:newCommandTimeout': 120,
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