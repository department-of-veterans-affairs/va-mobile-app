import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import { CommonE2eIdConstants } from './utils'

export const SignE2eIdConstants = {
  LOGIN_PAGE_ID: 'Login-page',
  LOA_P1_TEXT:
    'You’ll need to sign in with an identity-verified account through one of our account providers. Identity verification helps us protect all Veterans’ information and prevent scammers from stealing your benefits.',
  LOA_P2_TEXT:
    'Continue to the sign-in page. Follow the instructions to create a Login.gov or ID.me account. Then come back here and sign in. We’ll help you verify your identity for your account.',
  LOA_P3_TEXT: 'Sign in now. We’ll tell you if you need to verify.',
  CONTINUE_SIGN_IN_BTN_ID: 'Continue to sign in',
}

describe('Sign In', () => {
  it('should show sign in page content', async () => {
    try {
      await waitFor(element(by.id(CommonE2eIdConstants.VA_LOGO_ICON_ID)))
        .toExist()
        .withTimeout(120000)
    } catch (ex) {
      await device.uninstallApp()
      await device.installApp()
      await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
      await waitFor(element(by.id(CommonE2eIdConstants.VA_LOGO_ICON_ID)))
        .toExist()
        .withTimeout(60000)
    }

    await element(by.id(CommonE2eIdConstants.SIGN_IN_BTN_ID)).tap()
    await expect(element(by.id(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BTN_ID))).toExist()
    await expect(element(by.text(SignE2eIdConstants.LOA_P1_TEXT))).toExist()
    await expect(element(by.text(SignE2eIdConstants.LOA_P2_TEXT))).toExist()
    await expect(element(by.text(SignE2eIdConstants.LOA_P3_TEXT))).toExist()
    // await expect(element(by.id(SignE2eIdConstants.LOA_GATE_EXPAND_MSG_ID))).toExist()
    await expect(element(by.id(SignE2eIdConstants.CONTINUE_SIGN_IN_BTN_ID))).toExist()
  })

  it(':ios: should show webview with log in options', async () => {
    await element(by.text('Close')).tap()
    await element(by.id(CommonE2eIdConstants.SIGN_IN_BTN_ID)).tap()
    await element(by.id(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BTN_ID)).tap()
    await element(by.id(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BACK_ID)).tap()
    // await element(by.id(SignE2eIdConstants.LOA_GATE_EXPAND_MSG_ID)).tap()
    // await expect(element(by.text(SignE2eIdConstants.LOA_GATE_READ_MORE_P1))).toExist()
    // await expect(element(by.text(SignE2eIdConstants.LOA_GATE_READ_MORE_P2))).toExist()
    // await element(by.id(SignE2eIdConstants.LOA_GATE_EXPAND_MSG_ID)).tap()
    // await expect(element(by.text(SignE2eIdConstants.LOA_GATE_READ_MORE_P1))).not.toExist()
    // await expect(element(by.text(SignE2eIdConstants.LOA_GATE_READ_MORE_P2))).not.toExist()
    await element(by.id(SignE2eIdConstants.CONTINUE_SIGN_IN_BTN_ID)).tap()
    await setTimeout(7000)
    await device.takeScreenshot('VALoginWebview')
  })
})
