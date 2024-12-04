import { by, device, element, expect } from 'detox'

import { CommonE2eIdConstants, checkImages, loginToDemoMode } from './utils'

export const OnboardingE2eIdConstants = {
  VA_ICON_ID: 'VAIconOnboardingLogo',
  DONE_NEXT_BUTTON_ID: 'onboardingDoneNextButtonID',
  NOTIFICATIONS_PAGE_HEADER: 'Stay updated with app notifications',
}

beforeAll(async () => {
  await loginToDemoMode(false)
})

describe('Onboarding Screen', () => {
  it('should show the welcome onboarding content', async () => {
    const onboardingIconCheck = await element(by.id(OnboardingE2eIdConstants.VA_ICON_ID)).takeScreenshot(
      'VAIconOnboarding',
    )
    checkImages(onboardingIconCheck)
    await expect(element(by.text('Welcome, Kimberly'))).toExist()
    await expect(
      element(
        by.label(
          'With this app, you can manage your  V-A  health care, benefits, and payments from your phone or tablet.',
        ),
      ),
    ).toExist()
    await expect(element(by.id(CommonE2eIdConstants.SKIP_BACK_BUTTON_ID))).toExist()
    await expect(element(by.id(OnboardingE2eIdConstants.DONE_NEXT_BUTTON_ID))).toExist()
  })

  it('should tap next and show the manage your health care content', async () => {
    await element(by.id(OnboardingE2eIdConstants.DONE_NEXT_BUTTON_ID)).tap()
    await expect(element(by.text('Manage your health care')))
    await expect(element(by.text('Use our health care tools to manage tasks like these:'))).toExist()
    await expect(element(by.text('Refill your prescriptions'))).toExist()
    await expect(element(by.text('Communicate with your health care team'))).toExist()
    await expect(element(by.text('Review your appointments'))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.SKIP_BACK_BUTTON_ID))).toExist()
    await expect(element(by.id(OnboardingE2eIdConstants.DONE_NEXT_BUTTON_ID))).toExist()
  })

  it('should tap next and show the manage your benefits content', async () => {
    await element(by.id(OnboardingE2eIdConstants.DONE_NEXT_BUTTON_ID)).tap()
    await expect(element(by.text('Manage your benefits'))).toExist()
    await expect(element(by.text('Use our benefits tools to manage tasks like these:'))).toExist()
    await expect(element(by.text('Review your disability rating'))).toExist()
    await expect(element(by.text('Check the status of your claims and appeals'))).toExist()
    await expect(element(by.label('Download common  V-A  letters'))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.SKIP_BACK_BUTTON_ID))).toExist()
    await expect(element(by.id(OnboardingE2eIdConstants.DONE_NEXT_BUTTON_ID))).toExist()
  })

  it('should tap next and show the manage your payments content', async () => {
    await element(by.id(OnboardingE2eIdConstants.DONE_NEXT_BUTTON_ID)).tap()
    await expect(element(by.text('Manage your payments'))).toExist()
    await expect(element(by.text('Use our payments tools to manage tasks like these:'))).toExist()
    await expect(element(by.text('Update your direct deposit information'))).toExist()
    await expect(element(by.text('Review the history of payments we’ve sent to you'))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.SKIP_BACK_BUTTON_ID))).toExist()
    await expect(element(by.id(OnboardingE2eIdConstants.DONE_NEXT_BUTTON_ID))).toExist()
  })

  it('should tap back and verify the previous page is displayed', async () => {
    await element(by.id(CommonE2eIdConstants.SKIP_BACK_BUTTON_ID)).tap()
    await expect(element(by.text('Manage your benefits'))).toExist()
    await element(by.id(CommonE2eIdConstants.SKIP_BACK_BUTTON_ID)).tap()
    await expect(element(by.text('Manage your health care'))).toExist()
    await element(by.id(CommonE2eIdConstants.SKIP_BACK_BUTTON_ID)).tap()
    await expect(element(by.text('Welcome, Kimberly'))).toExist()
  })

  it('verify the notifications page is displayed after tapping done', async () => {
    await element(by.id(OnboardingE2eIdConstants.DONE_NEXT_BUTTON_ID)).tap()
    await element(by.id(OnboardingE2eIdConstants.DONE_NEXT_BUTTON_ID)).tap()
    await element(by.id(OnboardingE2eIdConstants.DONE_NEXT_BUTTON_ID)).tap()
    await element(by.id(OnboardingE2eIdConstants.DONE_NEXT_BUTTON_ID)).tap()
    await expect(element(by.text(OnboardingE2eIdConstants.NOTIFICATIONS_PAGE_HEADER))).toExist()
  })

  it('verify the notifications page is displayed after skipping', async () => {
    await device.uninstallApp()
    await device.installApp()
    await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
    await loginToDemoMode(false)
    await element(by.id(CommonE2eIdConstants.SKIP_BACK_BUTTON_ID)).tap()
    await expect(element(by.text(OnboardingE2eIdConstants.NOTIFICATIONS_PAGE_HEADER))).toExist()
  })

  it('verify the home page is displayed after tapping turn on notifications', async () => {
    await element(by.text('Turn on notifications')).tap()
    await expect(element(by.text(CommonE2eIdConstants.HOME_ACTIVITY_HEADER_TEXT))).toExist()
  })
})
