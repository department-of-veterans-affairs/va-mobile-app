import { CommonE2eIdConstants } from './utils'
import { by, element, expect, waitFor } from 'detox'

export const SignE2eIdConstants = {
  LOGIN_PAGE_ID: 'Login-page',
  LOA_GATE_EXPAND_MSG_TEXT: "Read more if you haven't yet verified",
  LOA_GATE_READ_MORE_P1:
    "We'll verify your identity through a secure process from ID.me or Login.gov. This trusted partner provides the strongest identity verification system available.",
  LOA_GATE_READ_MORE_P2: "To complete the process on your smartphone, you'll need these items:",
  CONTINUE_SIGN_IN_BTN_ID: 'Continue to sign in',
}

describe('Sign In', () => {
  it('should show webview with log in options', async () => {
    await waitFor(element(by.id(SignE2eIdConstants.LOGIN_PAGE_ID)))
      .toExist()
      .withTimeout(2000)

    await element(by.id(CommonE2eIdConstants.SIGN_IN_BTN_ID)).tap()
    await element(by.label(CommonE2eIdConstants.BACK_BTN_LABEL)).tap()
    await element(by.id(CommonE2eIdConstants.SIGN_IN_BTN_ID)).tap()
    await element(by.id(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BTN_ID)).tap()
    await element(by.text('Done')).tap()
    await element(by.text(SignE2eIdConstants.LOA_GATE_EXPAND_MSG_TEXT)).tap()
    // await expect(element(by.text(SignE2eIdConstants.LOA_GATE_READ_MORE_P1)).atIndex(1)).toExist()
    // await expect(element(by.text(SignE2eIdConstants.LOA_GATE_READ_MORE_P2))).toExist()
    await element(by.text(SignE2eIdConstants.LOA_GATE_EXPAND_MSG_TEXT)).tap()
    await element(by.id(SignE2eIdConstants.CONTINUE_SIGN_IN_BTN_ID)).tap()
  })
})
