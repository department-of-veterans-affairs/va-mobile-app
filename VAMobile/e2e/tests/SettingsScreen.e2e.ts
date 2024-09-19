import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import { CommonE2eIdConstants, loginToDemoMode, openDismissLeavingAppPopup, openProfile, openSettings } from './utils'

export const SettingsE2eIdConstants = {
  SETTINGS_SCREEN_TEXT: 'Settings',
  MANAGE_ACCT_ROW_ID: 'accountSecurityID',
  MANAGE_ACCT_SCREEN_TEXT:
    'To access or update your sign-in information, go to the website where you manage your account information. Any updates you make there will automatically update on the mobile app.',
  NOTIFICATIONS_ROW_ID: 'notificationsID',
  NOTIFICATIONS_SCREEN_TEXT: "We'll send these notifications to your device.",
  NOTIFICATIONS_APPOINTMENT_TEXT: 'Appointment reminders',
  NOTIFICATIONS_MESSAGING_TEXT: 'New secure messages',
  NOTIFICATIONS_SCREEN_SUBTEXT:
    "Your privacy is important to us. We won't show any personal information in your notifications.",
  NOTIFICATIONS_LINK_ID: 'noficationSettingsLinkID',
  SHARE_APP_ROW_ID: 'shareAppID',
  SHARE_APP_SCREEN_TEXT:
    'Download the VA: Health and Benefits on the App Store: https://apps.apple.com/us/app/va-health-and-benefits/id1559609596 or on Google Play: https://play.google.com/store/apps/details?id=gov.va.mobileapp',
  PRIVACY_ROW_ID: 'privacyPolicyID',
  SIGN_OUT_BTN_ID: 'Sign out',
  SIGN_OUT_CONFIRM_TEXT: device.getPlatform() === 'ios' ? 'Sign Out' : 'Sign Out ',
  BACK_TO_SETTINGS_SCREEN_ID: 'backToSettingsScreenID',
  ACCOUNT_SETTINGS_SCREEN_ID: 'accountSecurityScreenID',
  IN_APP_RECRUITMENT_ID: 'inAppRecruitmentID',
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

    await expect(element(by.id(SettingsE2eIdConstants.MANAGE_ACCT_ROW_ID))).toExist()
    await expect(element(by.id(SettingsE2eIdConstants.NOTIFICATIONS_ROW_ID))).toExist()
    await expect(element(by.id(SettingsE2eIdConstants.SHARE_APP_ROW_ID))).toExist()
    await expect(element(by.id(SettingsE2eIdConstants.PRIVACY_ROW_ID))).toExist()
  })

  it('should show "Manage account" screen', async () => {
    await element(by.id(SettingsE2eIdConstants.MANAGE_ACCT_ROW_ID)).tap()
    await expect(element(by.id(SettingsE2eIdConstants.ACCOUNT_SETTINGS_SCREEN_ID))).toExist()
    await expect(element(by.text(SettingsE2eIdConstants.MANAGE_ACCT_SCREEN_TEXT))).toExist()
    await element(by.id(SettingsE2eIdConstants.BACK_TO_SETTINGS_SCREEN_ID)).tap()
  })

  it('should show "Notifications" screen', async () => {
    await element(by.id(SettingsE2eIdConstants.NOTIFICATIONS_ROW_ID)).tap()
    await expect(element(by.text(SettingsE2eIdConstants.NOTIFICATIONS_SCREEN_TEXT))).toExist()
    await expect(element(by.text(SettingsE2eIdConstants.NOTIFICATIONS_APPOINTMENT_TEXT))).toExist()
    await expect(element(by.text(SettingsE2eIdConstants.NOTIFICATIONS_MESSAGING_TEXT))).toExist()
    await expect(element(by.text(SettingsE2eIdConstants.NOTIFICATIONS_SCREEN_SUBTEXT))).toExist()
    await expect(element(by.id(SettingsE2eIdConstants.NOTIFICATIONS_LINK_ID))).toExist()
    await element(by.id(SettingsE2eIdConstants.BACK_TO_SETTINGS_SCREEN_ID)).tap()
  })

  it('should show "Share the app" screen', async () => {
    if (device.getPlatform() === 'ios') {
      await element(by.id(SettingsE2eIdConstants.SHARE_APP_ROW_ID)).tap()
      await device.takeScreenshot('ShareTheAppScreenshot')
      await device.launchApp({ newInstance: true })
      await loginToDemoMode()
      await openProfile()
      await openSettings()
    }
  })

  it('should show Give feedback screen', async () => {
    await element(by.id(SettingsE2eIdConstants.IN_APP_RECRUITMENT_ID)).tap()
    await expect(element(by.text('Make this app better for all Veterans'))).toExist()
    await expect(element(by.text('Go to questionnaire'))).toExist()
    await expect(element(by.text('Learn more about the Veteran Usability Project'))).toExist()
  })

  it('should tap on "go to questionnaire" in in app recruitment', async () => {
    await element(by.text('Go to questionnaire')).tap()
    await device.takeScreenshot('inAppRecruitmentQuestionnaire')
    await element(by.text('Done')).tap()
    await element(by.id(SettingsE2eIdConstants.BACK_TO_SETTINGS_SCREEN_ID)).tap()
  })

  it('should show Privacy Policy page', async () => {
    await element(by.id(SettingsE2eIdConstants.PRIVACY_ROW_ID)).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('SettingsPrivacyPolicy')
    await device.launchApp({ newInstance: false })
  })

  it('should show and dismiss leaving app popup for privacy', async () => {
    await openDismissLeavingAppPopup(SettingsE2eIdConstants.PRIVACY_ROW_ID, false)
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
