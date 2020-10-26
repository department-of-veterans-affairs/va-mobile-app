const { join } = require('path');
const apkPath = join(process.cwd(), './android/app/build/outputs/apk/integrationtest/debug/app-integrationtest-debug.apk')


exports.devConfig = 	{
	platformName: 'Android',
	maxInstances: 1,
	'appium:chromedriverExecutableDir': join(process.cwd(), './android/tmp'),
	'appium:chromedriverChromeMappingFile': join(process.cwd(), './android/tmp/map.json'),
	'appium:orientation': 'PORTRAIT',
	'appium:automationName': 'UiAutomator2',
	'appium:noReset': true,
	'appium:allowTestPackages':true,
	'appium:newCommandTimeout': 120,
	'appium:app': apkPath
}

exports.config = [
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
		'appium:app': apkPath
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
		'appium:app': apkPath
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
		'appium:app': apkPath
	},

]

