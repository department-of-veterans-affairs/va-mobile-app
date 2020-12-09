import { doLogin, logout } from '../utils'
import ClaimsPageFlow from './ClaimsPageFlow.test'

describe('claims', () => {
  before(async () => {
    if (driver.isAndroid) {
      console.log("Resetting app")
      await driver.reset()
    }
    await doLogin("patient998@id.me", "Password1234!")
  })

  after(async () => {
    if (driver.isIOS) {
      await browser.execute('mobile:clearKeychains')
    }

    await logout()
  })

  ClaimsPageFlow()
})
