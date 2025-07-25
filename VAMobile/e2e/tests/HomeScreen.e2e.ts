import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import {
  CommonE2eIdConstants,
  checkImages,
  disableAF,
  enableAF,
  loginToDemoMode,
  toggleRemoteConfigFlag,
  verifyAF,
} from './utils'

export const HomeE2eIdConstants = {
  VETERAN_STATUS_TEXT: 'Veteran Status Card',
  LOCATION_FINDER_TEXT: 'Find a VA location',
  CONTACT_VA_ROW_TEXT: 'Contact us',
  CONTACT_VA_TITLE: 'Call My V-A 4 1 1',
  CONTACT_VA_BODY:
    'My V-A 4 1 1 is our main V-A information line. We can help connect you to any of our V-A contact centers.',
  WEBVIEW_ID: 'Webview-web',
  UPCOMING_APPOINTMENTS_BUTTON_SUBTEXT_TEXT: '6 in the next 30 days',
  PAST_APPOINTMENTS_BUTTON_SUBTEXT_TEXT: '5 eligible for travel reimbursement',
  CLAIMS_BUTTON_SUBTEXT_TEXT: '5 active',
  MESSAGES_BUTTON_SUBTEXT_TEXT: '3 unread',
  PRESCRIPTIONS_BUTTON_SUBTEXT_TEXT: '10 ready to refill',
  ANNOUNCEMENT_BANNER_TEXT: 'Learn about PACT Act on VA.gov',
  DISABILITY_RATING_TITLE_TEXT: 'Disability rating',
  DISABILITY_RATING_SUBTEXT_TEXT: 'Service connected',
  MONTHLY_PAYMENT_TITLE_TEXT: 'Latest payment',
  MONTHLY_PAYMENT_AMOUNT_TEXT: '$1,775.93',
  MONTHLY_PAYMENT_AMOUNT_OBFUSCATED_TEXT: '$••••••••••',
  LATEST_PAYMENT_ROW_ONE_PAYMENT_TYPE: 'Regular Chapter 31',
  LATEST_PAYMENT_ROW_ONE_AMOUNT: '$603.33',
  LATEST_PAYMENT_ROW_TWO_PAYMENT_TYPE: 'Post-9/11 GI Bill',
  LATEST_PAYMENT_ROW_TWO_AMOUNT: '$1,172.60',
}

beforeAll(async () => {
  await toggleRemoteConfigFlag([
    CommonE2eIdConstants.TRAVEL_PAY_CONFIG_FLAG_TEXT,
    CommonE2eIdConstants.TRAVEL_PAY_STATUS_LIST_FLAG_TEXT,
  ])
  await loginToDemoMode()
})

describe('Home Screen', () => {
  it(':android: should enable AF use case 3', async () => {
    await enableAF('WG_Home', 'AllowFunction')
    await verifyAF(undefined, 'AllowFunction', undefined)
  })

  it(':android: should disable AF use case 3', async () => {
    await device.uninstallApp()
    await device.installApp()
    await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
    await toggleRemoteConfigFlag([
      CommonE2eIdConstants.TRAVEL_PAY_STATUS_LIST_FLAG_TEXT,
      CommonE2eIdConstants.TRAVEL_PAY_CONFIG_FLAG_TEXT,
    ])
    await loginToDemoMode()
  })

  it('should show primary home page header content', async () => {
    await expect(element(by.id(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BTN_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.PROFILE_HEADER_BUTTON_ID))).toExist()
  })

  it('should verify the nav bar at the bottom of the screen', async () => {
    await expect(element(by.id(CommonE2eIdConstants.PROFILE_HEADER_BUTTON_ID))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.BENEFITS_TAB_BUTTON_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.HEALTH_TAB_BUTTON_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.PAYMENTS_TAB_BUTTON_TEXT))).toExist()
  })

  it('should verify the activity section content', async () => {
    await expect(element(by.text(HomeE2eIdConstants.UPCOMING_APPOINTMENTS_BUTTON_SUBTEXT_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.PAST_APPOINTMENTS_BUTTON_SUBTEXT_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.CLAIMS_BUTTON_SUBTEXT_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.MESSAGES_BUTTON_SUBTEXT_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.PRESCRIPTIONS_BUTTON_SUBTEXT_TEXT))).toExist()
  })

  it('profile tab tap: verify the profile screen tab items', async () => {
    await element(by.id(CommonE2eIdConstants.PROFILE_HEADER_BUTTON_ID)).tap()
    await expect(element(by.id(CommonE2eIdConstants.PERSONAL_INFO_BUTTON_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CONTACT_INFO_BUTTON_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.MILITARY_HISTORY_BUTTON_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.SETTINGS_BUTTON_ID))).toExist()
  })

  it('home tab tap: verify the home screen tab items', async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).atIndex(1).tap()
    await expect(element(by.id(CommonE2eIdConstants.PROFILE_HEADER_BUTTON_ID))).toExist()
  })

  it('benefits tab tap: verify the benefits screen tab items', async () => {
    await element(by.text(CommonE2eIdConstants.BENEFITS_TAB_BUTTON_TEXT)).tap()
    await expect(element(by.id(CommonE2eIdConstants.DISABILITY_RATING_BUTTON_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CLAIMS_LANDING_BUTTON_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.LETTERS_LANDING_BUTTON_ID))).toExist()
  })
  it('health tab tap: verify the health screen tab items', async () => {
    await element(by.text(CommonE2eIdConstants.HEALTH_TAB_BUTTON_TEXT)).tap()
    await expect(element(by.id(CommonE2eIdConstants.APPOINTMENTS_BUTTON_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.TRAVEL_BUTTON_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.PRESCRIPTIONS_BUTTON_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.MESSAGES_INBOX_BUTTON_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.MEDICAL_RECORDS_BUTTON_ID))).toExist()
  })

  it('payments tab tap: verify the payments screen tab items', async () => {
    await element(by.text(CommonE2eIdConstants.PAYMENTS_TAB_BUTTON_TEXT)).tap()
    await expect(element(by.id(CommonE2eIdConstants.PAYMENT_HISTORY_BUTTON_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.DIRECT_DEPOSIT_BUTTON_ID))).toExist()
  })

  it('personalization: verify the health screen subtext', async () => {
    await element(by.text(CommonE2eIdConstants.HEALTH_TAB_BUTTON_TEXT)).tap()
    await expect(element(by.text(HomeE2eIdConstants.UPCOMING_APPOINTMENTS_BUTTON_SUBTEXT_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.MESSAGES_BUTTON_SUBTEXT_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.PRESCRIPTIONS_BUTTON_SUBTEXT_TEXT))).toExist()
  })

  it('personalization: verify the benefits screen subtext', async () => {
    await element(by.text(CommonE2eIdConstants.BENEFITS_TAB_BUTTON_TEXT)).tap()
    await expect(element(by.text(HomeE2eIdConstants.CLAIMS_BUTTON_SUBTEXT_TEXT))).toExist()
  })

  it('taps home then jumps to appointments from appointments button', async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
    await waitFor(element(by.text(HomeE2eIdConstants.UPCOMING_APPOINTMENTS_BUTTON_SUBTEXT_TEXT)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.HOME_SCREEN_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text(HomeE2eIdConstants.UPCOMING_APPOINTMENTS_BUTTON_SUBTEXT_TEXT)).atIndex(0).tap()
    await expect(element(by.text(CommonE2eIdConstants.UPCOMING_APPT_BUTTON_TEXT))).toExist()
  })

  it('taps home then jumps to appointments from past appointments button', async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
    await waitFor(element(by.text(HomeE2eIdConstants.PAST_APPOINTMENTS_BUTTON_SUBTEXT_TEXT)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.HOME_SCREEN_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text(HomeE2eIdConstants.PAST_APPOINTMENTS_BUTTON_SUBTEXT_TEXT)).atIndex(0).tap()
    await expect(element(by.text(CommonE2eIdConstants.UPCOMING_APPT_BUTTON_TEXT))).toExist()
  })

  it('taps home then jumps to claims from claims button', async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
    await waitFor(element(by.text(HomeE2eIdConstants.CLAIMS_BUTTON_SUBTEXT_TEXT)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.HOME_SCREEN_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text(HomeE2eIdConstants.CLAIMS_BUTTON_SUBTEXT_TEXT)).tap()
    await expect(element(by.id(CommonE2eIdConstants.CLAIMS_HISTORY_SCROLL_ID))).toExist()
  })

  it('taps home then jumps to messages from messages button', async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
    await waitFor(element(by.text(HomeE2eIdConstants.MESSAGES_BUTTON_SUBTEXT_TEXT)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.HOME_SCREEN_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text(HomeE2eIdConstants.MESSAGES_BUTTON_SUBTEXT_TEXT)).tap()
    await expect(element(by.id(CommonE2eIdConstants.START_NEW_MESSAGE_BUTTON_ID))).toExist()
  })

  it('taps home then jumps to prescriptions from prescriptions button', async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
    await waitFor(element(by.text(HomeE2eIdConstants.PRESCRIPTIONS_BUTTON_SUBTEXT_TEXT)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.HOME_SCREEN_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text(HomeE2eIdConstants.PRESCRIPTIONS_BUTTON_SUBTEXT_TEXT)).tap()
    await expect(element(by.id(CommonE2eIdConstants.PRESCRIPTION_REFILL_BUTTON_ID))).toExist()
  })

  it('should tap home then show home page about you section content', async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
    try {
      await element(by.text('Skip this update')).tap()
    } catch (e) {}
    await waitFor(element(by.id(CommonE2eIdConstants.HOME_SCREEN_SHOW_COMPENSATION_BUTTON_ID)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.HOME_SCREEN_SCROLL_ID))
      .scroll(200, 'down')
    await expect(element(by.text(CommonE2eIdConstants.MILITARY_BRANCH_COAST_GUARD))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.VETERAN_STATUS_TEXT))).toExist()
    const militaryBadge = await element(by.id('United States Coast Guard Emblem')).takeScreenshot(
      'MilitaryServiceBadgeHome',
    )
    checkImages(militaryBadge)
  })

  it('should reveal disability rating on pressing show', async () => {
    await expect(element(by.text(HomeE2eIdConstants.DISABILITY_RATING_TITLE_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.DISABILITY_RATING_OBFUSCATED_PERCENT_TEXT))).toExist()

    await element(by.id(CommonE2eIdConstants.HOME_SCREEN_SHOW_DISABILITY_BUTTON_ID)).tap()

    await expect(element(by.text(CommonE2eIdConstants.DISABILITY_RATING_PERCENT_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.DISABILITY_RATING_SUBTEXT_TEXT))).toExist()
  })

  it('should reveal latest payment on pressing show', async () => {
    await expect(element(by.text(HomeE2eIdConstants.MONTHLY_PAYMENT_TITLE_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.MONTHLY_PAYMENT_AMOUNT_OBFUSCATED_TEXT))).toExist()

    await element(by.id(CommonE2eIdConstants.HOME_SCREEN_SHOW_COMPENSATION_BUTTON_ID)).tap()

    await expect(element(by.text(HomeE2eIdConstants.MONTHLY_PAYMENT_AMOUNT_TEXT))).toExist()
  })

  it('should show latest payment breakdown', async () => {
    await waitFor(element(by.id(CommonE2eIdConstants.HOME_SCREEN_SEE_LATEST_PAYMENT_DETAILS_BUTTON_ID)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.HOME_SCREEN_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.id(CommonE2eIdConstants.HOME_SCREEN_SEE_LATEST_PAYMENT_DETAILS_BUTTON_ID)).tap()

    await expect(element(by.text(HomeE2eIdConstants.LATEST_PAYMENT_ROW_ONE_PAYMENT_TYPE))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.LATEST_PAYMENT_ROW_ONE_AMOUNT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.LATEST_PAYMENT_ROW_TWO_PAYMENT_TYPE))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.LATEST_PAYMENT_ROW_TWO_AMOUNT))).toExist()
  })

  it('payment breakdown: should navigate to prescription home and then tab to home  ', async () => {
    await element(by.id(CommonE2eIdConstants.LATEST_PAYMENT_GO_TO_PAYMENT_HISTORY_BUTTON_ID)).tap()
    await expect(element(by.id(CommonE2eIdConstants.PAYMENT_HISTORY_SCREEN_ID))).toExist()

    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
    await expect(element(by.text(HomeE2eIdConstants.MONTHLY_PAYMENT_TITLE_TEXT))).toExist()
  })

  it('should show home page VA Resources content', async () => {
    await waitFor(element(by.text(HomeE2eIdConstants.LOCATION_FINDER_TEXT)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.HOME_SCREEN_SCROLL_ID))
      .scroll(200, 'down')
    await expect(element(by.text(HomeE2eIdConstants.LOCATION_FINDER_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.CONTACT_VA_ROW_TEXT))).toExist()
  })

  it('should tap on contact VA', async () => {
    await element(by.text(HomeE2eIdConstants.CONTACT_VA_ROW_TEXT)).tap()
    await expect(element(by.text('Call MyVA411'))).toExist()
    await expect(
      element(
        by.text('MyVA411 is our main VA information line. We can help connect you to any of our VA contact centers.'),
      ),
    ).toExist()
    if (device.getPlatform() === 'android') {
      await device.disableSynchronization()
      await element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).tap()
      await setTimeout(5000)
      await device.takeScreenshot('ContactVAAndroidCallingScreen')
      await device.launchApp({ newInstance: false })
      await element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).tap()
      await setTimeout(5000)
      await device.takeScreenshot('ContactVATTYAndroidCallingScreen')
      await device.launchApp({ newInstance: false })
      await device.enableSynchronization()
    }
  })

  it('should tap on home then find a VA location', async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).atIndex(0).tap()
    try {
      await element(by.text('Skip this update')).tap()
    } catch (e) {}
    await element(by.text(HomeE2eIdConstants.LOCATION_FINDER_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('HomeFindAVALocationScreenshot')
  })

  it('should tap on done and verify announcements banner exists', async () => {
    await element(by.text('Done')).tap()
    await waitFor(element(by.text(HomeE2eIdConstants.ANNOUNCEMENT_BANNER_TEXT)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.HOME_SCREEN_SCROLL_ID))
      .scroll(200, 'down')
    await expect(element(by.text(HomeE2eIdConstants.ANNOUNCEMENT_BANNER_TEXT))).toExist()
  })
})
