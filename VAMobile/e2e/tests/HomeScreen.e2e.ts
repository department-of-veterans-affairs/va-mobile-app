import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import {
  CommonE2eIdConstants,
  checkImages,
  disableAF,
  enableAF,
  loginToDemoMode,
  openDeveloperScreen,
  openProfile,
  openSettings,
  verifyAF,
} from './utils'

export const HomeE2eIdConstants = {
  PAYMENTS_BTN_ID: 'Payments',
  VETERAN_STATUS_TEXT: 'Proof of Veteran status',
  LOCATION_FINDER_ROW_TEXT: 'Find a VA location',
  CONTACT_VA_ROW_TEXT: 'Contact us',
  HOME_PAGE_MILITARY_BRANCH: 'United States Coast Guard',
  CONTACT_VA_TITLE: 'Call My V-A 4 1 1',
  CONTACT_VA_BODY:
    'My V-A 4 1 1 is our main V-A information line. We can help connect you to any of our V-A contact centers.',
  WEBVIEW_ID: 'Webview-web',
  APPOINTMENTS_BUTTON_SUBTEXT_TEXT: '3 in the next 7 days',
  CLAIMS_BUTTON_SUBTEXT_TEXT: '5 active',
  MESSAGES_BUTTON_SUBTEXT_TEXT: '3 unread',
  PRESCRIPTIONS_BUTTON_SUBTEXT_TEXT: '10 ready to refill',
  ANNOUNCEMENT_BANNER_TEXT: 'Learn about PACT Act on VA.gov',
  DISABILITY_RATING_TITLE_TEXT: 'Disability rating',
  DISABILITY_RATING_PERCENT_TEXT: '100%',
  DISABILITY_RATING_SUBTEXT_TEXT: 'service connected',
  MONTHLY_PAYMENT_TITLE_TEXT: 'Monthly compensation payment',
  MONTHLY_PAYMENT_AMOUNT_TEXT: '$3,084.75',
}

beforeAll(async () => {
  await loginToDemoMode()
})

describe('Home Screen', () => {
  it(':android: should enable AF use case 3', async () => {
    try {
      await expect(element(by.text('Update app to fix issue'))).toExist()
      await device.disableSynchronization()
      await element(by.text('800-698-2411').withAncestor(by.id('AFUseCase2TestID'))).tap()
      await setTimeout(5000)
      await device.takeScreenshot('Home Screen AFUseCase2PhoneNumber')
      await device.launchApp({ newInstance: false })
      await element(by.text('TTY: 711').withAncestor(by.id('AFUseCase2TestID'))).tap()
      await setTimeout(5000)
      await device.takeScreenshot('Home Screen AFUseCase2TTY')
      await device.launchApp({ newInstance: false })
      await device.enableSynchronization()
      await expect(element(by.text('Update now'))).toExist()
    } catch (e) {
      await openProfile()
      await openSettings()
      await openDeveloperScreen()
      await waitFor(element(by.text('Remote Config')))
        .toBeVisible()
        .whileElement(by.id('developerScreenTestID'))
        .scroll(200, 'down')
      await element(by.text('Remote Config')).tap()
      await enableAF('WG_Home', 'AllowFunction')
      await device.launchApp({ newInstance: true })
      await loginToDemoMode()
      try {
        await element(by.text('Skip this update')).tap()
      } catch (e) {}
      await verifyAF(undefined, 'AllowFunction', undefined)
    }
  })

  it(':android: should disable AF use case 3', async () => {
    await disableAF(undefined, 'WG_Home', undefined, 'AllowFunction')
  })

  it('should show primary home page header content', async () => {
    await expect(element(by.text(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BTN_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.PROFILE_TAB_BUTTON_TEXT))).toExist()
  })

  it('should verify the nav bar at the bottom of the screen', async () => {
    await expect(element(by.text(CommonE2eIdConstants.PROFILE_TAB_BUTTON_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.BENEFITS_TAB_BUTTON_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.HEALTH_TAB_BUTTON_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.PAYMENTS_TAB_BUTTON_TEXT))).toExist()
  })

  it('should verify the activity section content', async () => {
    await expect(element(by.text(HomeE2eIdConstants.APPOINTMENTS_BUTTON_SUBTEXT_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.CLAIMS_BUTTON_SUBTEXT_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.MESSAGES_BUTTON_SUBTEXT_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.PRESCRIPTIONS_BUTTON_SUBTEXT_TEXT))).toExist()
  })

  it('profile tab tap: verify the profile screen tab items', async () => {
    await element(by.text(CommonE2eIdConstants.PROFILE_TAB_BUTTON_TEXT)).tap()
    await expect(element(by.text(CommonE2eIdConstants.PERSONAL_INFORMATION_ROW_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.CONTACT_INFORMATION_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.MILITARY_INFORMATION_ROW_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.SETTINGS_ROW_TEXT))).toExist()
  })

  it('home tab tap: verify the home screen tab items', async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).atIndex(1).tap()
    await expect(element(by.text(CommonE2eIdConstants.PROFILE_TAB_BUTTON_TEXT))).toExist()
  })

  it('benefits tab tap: verify the benefits screen tab items', async () => {
    await element(by.text(CommonE2eIdConstants.BENEFITS_TAB_BUTTON_TEXT)).tap()
    await expect(element(by.text(CommonE2eIdConstants.DISABILITY_RATING_ROW_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.CLAIMS_BUTTON_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.LETTERS_ROW_TEXT))).toExist()
  })

  it('health tab tap: verify the health screen tab items', async () => {
    await element(by.text(CommonE2eIdConstants.HEALTH_TAB_BUTTON_TEXT)).tap()
    await expect(element(by.text(CommonE2eIdConstants.APPOINTMENTS_TAB_BUTTON_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.PRESCRIPTIONS_BUTTON_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.MESSAGES_ROW_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.VACCINE_RECORDS_BUTTON_TEXT))).toExist()
  })

  it('payments tab tap: verify the payments screen tab items', async () => {
    await element(by.text(CommonE2eIdConstants.PAYMENTS_TAB_BUTTON_TEXT)).tap()
    await expect(element(by.text(CommonE2eIdConstants.VA_PAYMENT_HISTORY_BUTTON_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.DIRECT_DEPOSIT_ROW_TEXT))).toExist()
  })

  it('personalization: verify the health screen subtext', async () => {
    await element(by.text(CommonE2eIdConstants.HEALTH_TAB_BUTTON_TEXT)).tap()
    await expect(element(by.text(HomeE2eIdConstants.APPOINTMENTS_BUTTON_SUBTEXT_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.MESSAGES_BUTTON_SUBTEXT_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.PRESCRIPTIONS_BUTTON_SUBTEXT_TEXT))).toExist()
  })

  it('personalization: verify the benefits screen subtext', async () => {
    await element(by.text(CommonE2eIdConstants.BENEFITS_TAB_BUTTON_TEXT)).tap()
    await expect(element(by.text(HomeE2eIdConstants.CLAIMS_BUTTON_SUBTEXT_TEXT))).toExist()
  })

  it('taps home then jumps to appointments from appointments button', async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
    await element(by.text(HomeE2eIdConstants.APPOINTMENTS_BUTTON_SUBTEXT_TEXT)).atIndex(0).tap()
    await expect(element(by.text(CommonE2eIdConstants.UPCOMING_APPT_BUTTON_TEXT))).toExist()
  })

  it('taps home then jumps to claims from claims button', async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
    await element(by.text(HomeE2eIdConstants.CLAIMS_BUTTON_SUBTEXT_TEXT)).tap()
    await expect(element(by.text(CommonE2eIdConstants.CLAIMS_HISTORY_BUTTON_TEXT))).toExist()
  })

  it('taps home then jumps to messages from messages button', async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
    await waitFor(element(by.text(HomeE2eIdConstants.MESSAGES_BUTTON_SUBTEXT_TEXT)))
      .toBeVisible()
      .whileElement(by.id('homeScreenID'))
      .scroll(200, 'down')
    await element(by.text(HomeE2eIdConstants.MESSAGES_BUTTON_SUBTEXT_TEXT)).tap()
    await expect(element(by.id(CommonE2eIdConstants.START_NEW_MESSAGE_BUTTON_ID))).toExist()
  })

  it('taps home then jumps to prescriptions from prescriptions button', async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
    await waitFor(element(by.text(HomeE2eIdConstants.PRESCRIPTIONS_BUTTON_SUBTEXT_TEXT)))
      .toBeVisible()
      .whileElement(by.id('homeScreenID'))
      .scroll(200, 'down')
    await element(by.text(HomeE2eIdConstants.PRESCRIPTIONS_BUTTON_SUBTEXT_TEXT)).tap()
    await expect(element(by.text(CommonE2eIdConstants.PRESCRIPTION_REFILL_BUTTON_TEXT))).toExist()
  })

  it('should tap home then show home page about you section content', async () => {
    await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
    try {
      await element(by.text('Skip this update')).tap()
    } catch (e) {}
    await waitFor(element(by.text(HomeE2eIdConstants.MONTHLY_PAYMENT_AMOUNT_TEXT)))
      .toBeVisible()
      .whileElement(by.id('homeScreenID'))
      .scroll(200, 'down')
    await expect(element(by.text(HomeE2eIdConstants.HOME_PAGE_MILITARY_BRANCH))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.VETERAN_STATUS_TEXT))).toExist()
    const militaryBadge = await element(by.id('United States Coast Guard')).takeScreenshot('MilitaryServiceBadgeHome')
    checkImages(militaryBadge)
    await expect(element(by.text(HomeE2eIdConstants.DISABILITY_RATING_TITLE_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.DISABILITY_RATING_PERCENT_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.DISABILITY_RATING_SUBTEXT_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.MONTHLY_PAYMENT_TITLE_TEXT))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.MONTHLY_PAYMENT_AMOUNT_TEXT))).toExist()
  })

  it('should show home page VA Resources content', async () => {
    await waitFor(element(by.text(HomeE2eIdConstants.LOCATION_FINDER_ROW_TEXT)))
      .toBeVisible()
      .whileElement(by.id('homeScreenID'))
      .scroll(200, 'down')
    await expect(element(by.text(HomeE2eIdConstants.LOCATION_FINDER_ROW_TEXT))).toExist()
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
      await element(by.text('800-698-2411')).tap()
      await setTimeout(5000)
      await device.takeScreenshot('ContactVAAndroidCallingScreen')
      await device.launchApp({ newInstance: false })
      await element(by.text('TTY: 711')).tap()
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
    await element(by.text(HomeE2eIdConstants.LOCATION_FINDER_ROW_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('HomeFindAVALocationScreenshot')
  })

  it('should tap on done and verify announcements banner exists', async () => {
    await element(by.text('Done')).tap()
    await waitFor(element(by.text(HomeE2eIdConstants.ANNOUNCEMENT_BANNER_TEXT)))
      .toBeVisible()
      .whileElement(by.id('homeScreenID'))
      .scroll(200, 'down')
    await expect(element(by.text(HomeE2eIdConstants.ANNOUNCEMENT_BANNER_TEXT))).toExist()
  })
})
