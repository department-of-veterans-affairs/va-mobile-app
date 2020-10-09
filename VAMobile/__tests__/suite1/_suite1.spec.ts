import { doLogin } from '../utils'
import HomeScreenNavigationTests from './HomeScreenNavigation.test'

describe('suite1', () => {
	before(async () => {
		if (driver.isAndroid) {
			console.log("Resetting app")
			await driver.reset()
		}
		await doLogin("ben.morgan@id.me", "Password1234!")
	})

	after(async () => {
		if (driver.isIOS) {
			await browser.execute('mobile:clearKeychains')
		}
	})

	HomeScreenNavigationTests()

})
