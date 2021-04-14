import { doLogin, logout } from '../utils'
import AppointmentsPageFlow from './AppointmentsPageFlow.test'

describe('appointments', () => {
  before(async () => {
    if (driver.isAndroid) {
      console.log("Resetting app")
      await driver.reset()
    }

    // TODO: replace with another user with appointments
    await doLogin("vets.gov.user+228@gmail.com", "")
  })

  after(async () => {
    if (driver.isIOS) {
      await browser.execute('mobile:clearKeychains')
    }

    await logout()
  })

  AppointmentsPageFlow()
})
