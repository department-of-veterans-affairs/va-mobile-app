import { doLogin, logout } from '../utils'
import AppointmentsPageFlow from './AppointmentsPageFlow.test'

describe('appointments', () => {
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

  AppointmentsPageFlow()
})
