const { config: android, devConfig: androidDevConfig } = require('./wdio.android.conf');
const { config: ios, devConfig: iosDevConfig } = require('./wdio.ios.conf');
const { config } = require('./wdio.base.conf');

var capabilities

switch ((process.env.TEST_PLATFORM || "").toLowerCase()) {
	case "ios":
		if (!!process.env.CI) {
			capabilities = ios
		} else {
			capabilities = [iosDevConfig]
		}
		break
	case "android":
		if (!!process.env.CI) {
			ecapabilities = android
		} else {
			capabilities = [androidDevConfig]
		}
		break
	default:
		if (!!process.env.CI) {
			capabilities = [].concat(android).concat(ios)
		} else {
			capabilities = [ androidDevConfig, iosDevConfig,]
		}
		break
}

const activeConfig = {...config, capabilities}

exports.config = activeConfig
