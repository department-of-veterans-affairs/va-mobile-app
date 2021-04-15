import { doLogin, logout } from '../utils'
import MessagesPageFlow from './MessagesPageFlow.test'

describe('messages', () => {
  before(async () => {
    if (driver.isAndroid) {
      console.log("Resetting app")
      await driver.reset()
    }
    await doLogin("vets.gov.user+263@gmail.com", "")
  })

  after(async () => {
    if (driver.isIOS) {
      await browser.execute('mobile:clearKeychains')
    }

    await logout()
  })

  MessagesPageFlow()
})
