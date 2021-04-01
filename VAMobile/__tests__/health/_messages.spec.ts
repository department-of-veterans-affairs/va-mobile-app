import { doLogin, logout } from '../utils'
import MessagesPageFlow from './MessagesPageFlow.test'

describe('appointments', () => {
  //TODO: fix these after the health screen rework

  before(async () => {
    if (driver.isAndroid) {
      console.log("Resetting app")
      await driver.reset()
    }
    await doLogin("vets.gov.user+261@gmail.com", "345SsNrLgPv5")
  })

  after(async () => {
    if (driver.isIOS) {
      await browser.execute('mobile:clearKeychains')
    }

    await logout()
  })

  MessagesPageFlow()
})
