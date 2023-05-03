import { expect, device, by, element, waitFor } from 'detox'
import { isTypedArray } from 'util/types'
import { loginToDemoMode, openProfile, openSettings, openDismissLeavingAppPopup, CommonE2eIdConstants } from './utils'

export const SettingsE2eIdConstants = {
  SETTINGS_PAGE_TEXT: 'Settings',
  MANAGE_ACCT_ROW_TEXT: 'Manage account',
//biometrics toggle has dynamic text/ID, can't be covered by detox in current state
  NOTIFICATIONS_ROW_TEXT: 'Notifications',
  SHARE_APP_ROW_TEXT: 'Share the app',
  PRIVACY_ROW_TEXT: 'Privacy policy',
  MANAGE_ACCT_PAGE_TEXT: 'Manage your account page'
}

beforeAll(async () => {
  await loginToDemoMode()
  await openProfile()
  await openSettings()
})

describe('Settings Screen', () => { 
  it('should show settings list content', async () => {
    await waitFor(element(by.text(SettingsE2eIdConstants.SETTINGS_PAGE_TEXT)))
      .toExist()
      .withTimeout(2000)

    await expect(element(by.text(SettingsE2eIdConstants.MANAGE_ACCT_ROW_TEXT))).toExist()
    await expect(element(by.text(SettingsE2eIdConstants.NOTIFICATIONS_ROW_TEXT))).toExist()
    await expect(element(by.text(SettingsE2eIdConstants.SHARE_APP_ROW_TEXT))).toExist()
    await expect(element(by.text(SettingsE2eIdConstants.PRIVACY_ROW_TEXT))).toExist()
  })

  it('should show sign out button', async () => {
    await expect(element(by.id(CommonE2eIdConstants.SIGN_OUT_BTN_ID))).toExist()
  })

  it('should show and dismiss leaving app popup for privacy', async () => {
    await openDismissLeavingAppPopup(SettingsE2eIdConstants.PRIVACY_ROW_TEXT, true)
  })

  it('should show and dismiss signout popup', async () => {
    await element(by.text(CommonE2eIdConstants.SIGN_OUT_BTN_ID)).tap()
    await expect(element(by.text(CommonE2eIdConstants.SIGN_OUT_CONFIRM_TEXT))).toExist()
    await element(by.text(CommonE2eIdConstants.CANCEL_UNIVERSAL_TEXT)).tap()
  })

  /** Sidelined while we have back buttons that have no unique identifiers, no ancestors, no descendants
   * 
   * 
  it('should open, show, and close manage accounts page', async () => {
    await element(by.text(SettingsE2eIdConstants.MANAGE_ACCT_ROW_TEXT)).tap()
    await expect(element(by.text(SettingsE2eIdConstants.MANAGE_ACCT_PAGE_TEXT))).toExist()
    await element(by.text(CommonE2eIdConstants.BACK_BTN_LABEL).withAncestor(by.text(SettingsE2eIdConstants.MANAGE_ACCT_PAGE_TEXT))).tap()
    await expect(element(by.id(SettingsE2eIdConstants.SETTINGS_PAGE_ID))).toExist()
  })
  */

})