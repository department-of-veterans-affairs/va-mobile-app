import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import { CommonE2eIdConstants, loginToDemoMode, openDismissLeavingAppPopup, openProfile, openSettings } from './utils'

export const SettingsE2eIdConstants = {
  SETTINGS_SCREEN_TEXT: 'Settings',
  MANAGE_ACCT_ROW_TEXT: 'Manage account',
  MANAGE_ACCT_SCREEN_TEXT: 'To confirm or update your sign-in email, go to the website where you manage your account information.',
  NOTIFICATIONS_ROW_TEXT: 'Notifications',
  NOTIFICATIONS_SCREEN_TEXT: 'Select what type of alerts you would like to receive.',
  NOTIFICATIONS_APPOINTMENT_TEXT: 'Appointment Reminders',
  NOTIFICATIONS_MESSAGING_TEXT: 'Secure Message Alerts',
  SHARE_APP_ROW_TEXT: 'Share the app',
  SHARE_APP_SCREEN_TEXT:
    'Download the VA: Health and Benefits on the App Store: https://apps.apple.com/us/app/va-health-and-benefits/id1559609596 or on Google Play: https://play.google.com/store/apps/details?id=gov.va.mobileapp',
  PRIVACY_ROW_TEXT: 'Privacy policy',
}

beforeAll(async () => {
  await loginToDemoMode()
  await openProfile()
  await openSettings()
})

describe('Settings Screen', () => {
  it('should show settings list content', async () => {
    await waitFor(element(by.text(SettingsE2eIdConstants.SETTINGS_SCREEN_TEXT)))
      .toExist()
      .withTimeout(2000)

    await expect(element(by.text(SettingsE2eIdConstants.MANAGE_ACCT_ROW_TEXT))).toExist()
    await expect(element(by.text(SettingsE2eIdConstants.NOTIFICATIONS_ROW_TEXT))).toExist()
    await expect(element(by.text(SettingsE2eIdConstants.SHARE_APP_ROW_TEXT))).toExist()
    await expect(element(by.text(SettingsE2eIdConstants.PRIVACY_ROW_TEXT))).toExist()
  })

  it('should show "Manage account" screen', async () => {
    await element(by.text(SettingsE2eIdConstants.MANAGE_ACCT_ROW_TEXT)).tap()
    await expect(element(by.text(SettingsE2eIdConstants.MANAGE_ACCT_ROW_TEXT)).atIndex(0)).toExist()
    await expect(element(by.text(SettingsE2eIdConstants.MANAGE_ACCT_SCREEN_TEXT))).toExist()
    await element(by.text(SettingsE2eIdConstants.SETTINGS_SCREEN_TEXT)).tap()
  })

  it('should show "Notifications" screen', async () => {
    await element(by.text(SettingsE2eIdConstants.NOTIFICATIONS_ROW_TEXT)).atIndex(0).tap()
    await expect(element(by.text(SettingsE2eIdConstants.NOTIFICATIONS_ROW_TEXT)).atIndex(0)).toExist()
    await expect(element(by.text(SettingsE2eIdConstants.NOTIFICATIONS_SCREEN_TEXT))).toExist()
    await expect(element(by.text(SettingsE2eIdConstants.NOTIFICATIONS_APPOINTMENT_TEXT))).toExist()
    await expect(element(by.text(SettingsE2eIdConstants.NOTIFICATIONS_MESSAGING_TEXT))).toExist()
    await element(by.text(SettingsE2eIdConstants.SETTINGS_SCREEN_TEXT)).tap()
  })

  it('should show "Share the app" screen', async () => {
    if (device.getPlatform() === 'ios') {
      await element(by.text(SettingsE2eIdConstants.SHARE_APP_ROW_TEXT)).tap()
      await expect(element(by.text(SettingsE2eIdConstants.SHARE_APP_SCREEN_TEXT))).toExist()
      await element(by.label('Close')).atIndex(0).tap()
    }
  })

  it('should show Privacy Policy page', async () => {
    await element(by.text(SettingsE2eIdConstants.PRIVACY_ROW_TEXT)).tap()
    await element(by.text('Ok')).tap()
    await setTimeout(5000)
    await device.takeScreenshot('SettingsPrivacyPolicy')
    await device.launchApp({ newInstance: false })
  })

  it('should show and dismiss leaving app popup for privacy', async () => {
    await openDismissLeavingAppPopup(SettingsE2eIdConstants.PRIVACY_ROW_TEXT, true)
  })

  it('should show and dismiss signout popup', async () => {
    await element(by.text(CommonE2eIdConstants.SIGN_OUT_BTN_ID)).tap()
    await expect(element(by.text(CommonE2eIdConstants.SIGN_OUT_CONFIRM_TEXT))).toExist()
    await element(by.text(CommonE2eIdConstants.CANCEL_UNIVERSAL_TEXT)).tap()
  })

  it('should sign out', async () => {
    await element(by.text(CommonE2eIdConstants.SIGN_OUT_BTN_ID)).tap()
    await expect(element(by.text(CommonE2eIdConstants.SIGN_OUT_CONFIRM_TEXT))).toExist()
    await element(by.text('Sign Out')).tap()
    await expect(element(by.text('Sign in'))).toExist()
  })
})
