import { by, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, checkImages } from './utils'

export const LoginE2eIdConstants = {
  LOGIN_PAGE_ID: 'Login-page',
  LOGIN_FIND_VA_BUTTON_ID: 'Find a VA location',
  LOGIN_APP_VERSION_ID: 'AppVersionTestID',
}

describe('Login Screen', () => {
  it('should show login page content', async () => {
    await waitFor(element(by.id(LoginE2eIdConstants.LOGIN_PAGE_ID)))
      .toExist()
      .withTimeout(60000)

    await expect(element(by.id(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BTN_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.SIGN_IN_BTN_ID))).toExist()
    await expect(element(by.id(LoginE2eIdConstants.LOGIN_FIND_VA_BUTTON_ID))).toExist()
    const VALogoScreenshot = await element(by.id('VALogo')).takeScreenshot('VALogoLoginScreen')
    checkImages(VALogoScreenshot)
    await expect(element(by.id(LoginE2eIdConstants.LOGIN_APP_VERSION_ID)))
  })
})
