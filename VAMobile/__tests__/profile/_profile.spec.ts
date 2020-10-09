import { doLogin } from '../utils'
import ProfilePageFlow from './ProfilePageFlow'

describe('profile', () => {
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

    ProfilePageFlow()
})
