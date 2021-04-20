import { doLogin, logout } from '../utils'
import FileUploadFlow from './FileUploadFlow.test'

describe('fileUpload', () => {
  before(async () => {
    if (driver.isAndroid) {
      console.log('Resetting app')
      await driver.reset()
    }
    await doLogin('vets.gov.user+366@gmail.com', '')
  })

  after(async () => {
    if (driver.isIOS) {
      await browser.execute('mobile:clearKeychains')
    }

    await logout()
  })

  FileUploadFlow()
})
