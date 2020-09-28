const { join } = require('path');
const { config } = require('./wdio.base.conf');

config.capabilities = [
	{
		platformName: 'Android',
		maxInstances: 1,
		'appium:chromedriverExecutableDir': join(process.cwd(), './android/tmp'),
		'appium:chromedriverChromeMappingFile': join(process.cwd(), './android/tmp/map'),
		'appium:deviceName': 'Android Emulator',
		'appium:platformVersion': '8',
		'appium:orientation': 'PORTRAIT',
		'appium:automationName': 'UiAutomator2',
		'appium:noReset': true,
		'appium:newCommandTimeout': 240,
		'appium:app': join(process.cwd(), './android/app/build/outputs/apk/debug/app-debug.apk')
	},
	{
		platformName: 'Android',
		maxInstances: 1,
		'appium:deviceName': 'Android Emulator',
		'appium:platformVersion': '9',
		'appium:orientation': 'PORTRAIT',
		'appium:automationName': 'UiAutomator2',
		'appium:noReset': true,
		'appium:newCommandTimeout': 240,
		'appium:app': join(process.cwd(), './android/app/build/outputs/apk/debug/app-debug.apk')
	},
	{
		platformName: 'Android',
		maxInstances: 1,
		'appium:deviceName': 'Android Emulator',
		'appium:platformVersion': '10',
		'appium:orientation': 'PORTRAIT',
		'appium:automationName': 'UiAutomator2',
		'appium:noReset': true,
		'appium:newCommandTimeout': 240,
		'appium:app': join(process.cwd(), './android/app/build/outputs/apk/debug/app-debug.apk')
	}
]

exports.config = config;