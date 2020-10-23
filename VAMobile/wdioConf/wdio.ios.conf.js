const { join } = require('path');
const appPath = join(process.cwd(), './ios/output/Build/Products/Release-iphonesimulator/VAMobile.app')


exports.devConfig = {
	platformName: 'iOS',
	maxInstances: 1,
	'appium:deviceName': 'iPhone 11',
	'appium:automationName': 'XCUITest',
	'appium:noReset': false,
	'appium:newCommandTimeout': 240,
	"appium:includeSafariInWebviews": true,
	"appium:webviewConnectTimeout": 20000,
	"appium:ignoreAboutBlankUrl": false,
	'appium:app': appPath
}

exports.config = [
	{
		platformName: 'iOS',
		maxInstances: 2,
		'appium:deviceName': 'iPhone 10',
		'appium:automationName': 'XCUITest',
		'appium:noReset': false,
		'appium:newCommandTimeout': 240,
		"appium:includeSafariInWebviews": true,
		"appium:webviewConnectTimeout": 20000,
		"appium:ignoreAboutBlankUrl": false,
		'appium:app': appPath
	},
	{
		platformName: 'iOS',
		maxInstances: 2,
		'appium:deviceName': 'iPhone 11',
		'appium:automationName': 'XCUITest',
		'appium:noReset': false,
		'appium:newCommandTimeout': 240,
		"appium:includeSafariInWebviews": true,
		"appium:webviewConnectTimeout": 20000,
		"appium:ignoreAboutBlankUrl": false,
		'appium:app': appPath
	},
]