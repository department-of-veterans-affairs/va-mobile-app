import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import { CommonE2eIdConstants } from './utils'

export const SignE2eIdConstants = {
  LOGIN_PAGE_ID: 'Login-page',
  LOA_P1_TEXT:
    'Before we give you access to your VA claim and health care information, we need to make sure you’re you. This helps us protect you from fraud and identity theft.',
  LOA_P2_TEXT: 'If you haven’t yet verified your identity, we’ll help you complete the process when you sign in.',
  LOA_GATE_EXPAND_MSG_ID: 'loaGateExpandMsgID',
  LOA_GATE_READ_MORE_P1:
    'We’ll verify your identity through a secure process from ID.me or Login.gov. This trusted partner provides the strongest identity verification system available.',
  LOA_GATE_READ_MORE_P2: 'To complete the process on your smartphone, you’ll need these items:',
  CONTINUE_SIGN_IN_BTN_ID: 'Continue to sign in1',
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
    await expect(element(by.id(SignE2eIdConstants.LOA_GATE_EXPAND_MSG_ID))).toExist()
    await expect(element(by.id(SignE2eIdConstants.CONTINUE_SIGN_IN_BTN_ID))).toExist()
  })

  it(':ios: should show webview with log in options', async () => {
    await element(by.text('Close')).tap()
    await element(by.id(CommonE2eIdConstants.SIGN_IN_BTN_ID)).tap()
    await element(by.id(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BTN_ID)).tap()
    await element(by.id(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BACK_ID)).tap()
    await element(by.id(SignE2eIdConstants.LOA_GATE_EXPAND_MSG_ID)).tap()
    await expect(element(by.text(SignE2eIdConstants.LOA_GATE_READ_MORE_P1))).toExist()
    await expect(element(by.text(SignE2eIdConstants.LOA_GATE_READ_MORE_P2))).toExist()
    await element(by.id(SignE2eIdConstants.LOA_GATE_EXPAND_MSG_ID)).tap()
    await expect(element(by.text(SignE2eIdConstants.LOA_GATE_READ_MORE_P1))).not.toExist()
    await expect(element(by.text(SignE2eIdConstants.LOA_GATE_READ_MORE_P2))).not.toExist()
    await element(by.id(SignE2eIdConstants.CONTINUE_SIGN_IN_BTN_ID)).tap()
    await setTimeout(7000)
    await device.takeScreenshot('VALoginWebview')
  })
})
