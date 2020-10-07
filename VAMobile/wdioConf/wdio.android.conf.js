const { join } = require('path');
const { config } = require('./wdio.base.conf');

config.capabilities = [

	/*{
		platformName: 'Android',
		maxInstances: 1,
		'appium:chromedriverExecutableDir': join(process.cwd(), './android/tmp'),
		'appium:chromedriverChromeMappingFile': join(process.cwd(), './android/tmp/map.json'),
		'appium:platformVersion': '8',
		'appium:orientation': 'PORTRAIT',
		'appium:automationName': 'UiAutomator2',
		'appium:noReset': true,
		'appium:allowTestPackages':true,
		'appium:newCommandTimeout': 120,
		'appium:app': join(process.cwd(), './android/app/build/outputs/apk/debug/app-debug.apk')
	},*/
	{
		platformName: 'Android',
		maxInstances: 1,
		'appium:chromedriverExecutableDir': join(process.cwd(), './android/tmp'),
		'appium:chromedriverChromeMappingFile': join(process.cwd(), './android/tmp/map.json'),
		'appium:platformVersion': '8.1',
		'appium:orientation': 'PORTRAIT',
		'appium:automationName': 'UiAutomator2',
		'appium:noReset': true,
		'appium:allowTestPackages':true,
		'appium:newCommandTimeout': 120,
		'appium:app': join(process.cwd(), './android/app/build/outputs/apk/debug/app-debug.apk')
	},
	{
		platformName: 'Android',
		maxInstances: 1,
		'appium:chromedriverExecutableDir': join(process.cwd(), './android/tmp'),
		'appium:chromedriverChromeMappingFile': join(process.cwd(), './android/tmp/map.json'),
		'appium:platformVersion': '9',
		'appium:orientation': 'PORTRAIT',
		'appium:automationName': 'UiAutomator2',
		'appium:noReset': true,
		'appium:allowTestPackages':true,
		'appium:newCommandTimeout': 120,
		'appium:app': join(process.cwd(), './android/app/build/outputs/apk/debug/app-debug.apk')
	},
	{
		platformName: 'Android',
		maxInstances: 1,
		'appium:chromedriverExecutableDir': join(process.cwd(), './android/tmp'),
		'appium:chromedriverChromeMappingFile': join(process.cwd(), './android/tmp/map.json'),
		'appium:platformVersion': '10',
		'appium:orientation': 'PORTRAIT',
		'appium:automationName': 'UiAutomator2',
		'appium:allowTestPackages':true,
		'appium:noReset': true,
		'appium:newCommandTimeout': 120,
		'appium:app': join(process.cwd(), './android/app/build/outputs/apk/debug/app-debug.apk')
	},

]

exports.config = config;
