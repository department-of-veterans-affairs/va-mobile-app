import { expect, by, element, waitFor } from 'detox'
import { CommonE2eIdConstants,  checkImages } from './utils'

export const LoginE2eIdConstants = {
  LOGIN_PAGE_ID: 'Login-page',
  LOGIN_FIND_VA_BUTTON_ID: 'findVALocationTestID',
  LOGIN_APP_VERSION_ID: 'AppVersionTestID',
}

describe('Login Screen', () => {
  it('should show login page content', async () => {
    await waitFor(element(by.id(LoginE2eIdConstants.LOGIN_PAGE_ID)))
      .toExist()
      .withTimeout(2000)

    await expect(element(by.id(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BTN_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.SIGN_IN_BTN_ID))).toExist()
    await expect(element(by.id(LoginE2eIdConstants.LOGIN_FIND_VA_BUTTON_ID))).toExist() 
    var VAIconScreenshot = await element(by.id("VAIcon")).takeScreenshot('VAIconLoginScreen')
		checkImages(VAIconScreenshot)
    await expect(element(by.id(LoginE2eIdConstants.LOGIN_APP_VERSION_ID)))
  })
})
