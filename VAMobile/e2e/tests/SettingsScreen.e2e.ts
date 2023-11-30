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
  SIGN_OUT_BTN_ID: 'Sign out', 
  SIGN_OUT_CONFIRM_TEXT: device.getPlatform() === 'ios' ? 'Sign Out' : 'Sign Out ',
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

  it('should show Give feedback screen', async () => {
    try {
      await expect(element(by.text('Give feedback'))).toExist()
    } catch (ex) {
      await element(by.text('Developer Screen')).tap()
      await element(by.text('Remote Config')).tap()
      await waitFor(element(by.text('Override Toggles'))).toBeVisible().whileElement(by.id('remoteConfigTestID')).scroll(400, 'down')
      await waitFor(element(by.text('inAppRecruitment'))).toBeVisible().whileElement(by.id('remoteConfigTestID')).scroll(100, 'down')
      await element(by.text('inAppRecruitment')).tap()
      await element(by.id('remoteConfigTestID')).scrollTo('bottom')
      await element(by.text('Apply Overrides')).tap()
      await loginToDemoMode()
      await openProfile()
      await openSettings()
    }
    await element(by.text('Give feedback')).tap()
    await expect(element(by.text('Make this app better for all Veterans'))).toExist()
    await expect(element(by.text('Go to questionnaire'))).toExist()
    await expect(element(by.text('Learn more about the Veteran Usability Project'))).toExist()
  })

  /*it('should tap on "learn more about the veteran usability project" in in app recruitment', async () => {
    await element(by.id('inAppRecruitmentLearnMoreTestID')).tap()
    await element(by.text('OK')).tap()
    await device.takeScreenshot('inAppRecruitmentVeteranUsabilityProject')
    await device.launchApp({ newInstance: false })
  })*/

  it('should tap on "go to questionnaire" in in app recruitment', async () => {
    await element(by.text('Go to questionnaire')).tap()
    await device.takeScreenshot('inAppRecruitmentQuestionnaire')
    await element(by.text('Done')).tap()
    await element(by.text('Close')).tap()
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
    await element(by.text(SettingsE2eIdConstants.SIGN_OUT_BTN_ID)).atIndex(0).tap()
    await expect(element(by.text(SettingsE2eIdConstants.SIGN_OUT_CONFIRM_TEXT))).toExist()
    await element(by.text(CommonE2eIdConstants.CANCEL_PLATFORM_SPECIFIC_TEXT)).tap()
  })

  it('should sign out', async () => {
    await element(by.text(SettingsE2eIdConstants.SIGN_OUT_BTN_ID)).atIndex(0).tap()
    await element(by.text(SettingsE2eIdConstants.SIGN_OUT_CONFIRM_TEXT)).tap()
    await expect(element(by.text(CommonE2eIdConstants.SIGN_IN_BTN_ID))).toExist()
  })
})
