import { doLogin, logout } from '../utils'
import AppointmentsPageFlow from './AppointmentsPageFlow.test'

describe('appointments', () => {
  //TODO: fix these after the health screen rework

  before(async () => {
    if (driver.isAndroid) {
      console.log("Resetting app")
      await driver.reset()
    }
    await doLogin("vets.gov.user+228@gmail.com", "200SsNrLgPv5")
  })

  after(async () => {
    if (driver.isIOS) {
      await browser.execute('mobile:clearKeychains')
    }

    await logout()
  })

  AppointmentsPageFlow()
})
