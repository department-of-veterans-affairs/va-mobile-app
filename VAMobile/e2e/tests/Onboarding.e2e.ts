import { by, device, element, expect} from 'detox'
import { loginToDemoMode, checkImages } from './utils'


export const OnboardingE2eIdConstants = {
  VA_ICON_ID: 'VAIconOnboardingLogo'
}

beforeAll(async () => {
  await loginToDemoMode(false)
})

describe('Onboarding Screen', () => {
  it('should show the welcome onboarding content', async () => {
    var onboardingIconCheck = await element(by.id(OnboardingE2eIdConstants.VA_ICON_ID)).takeScreenshot('VAIconOnboarding')
		checkImages(onboardingIconCheck)
    await expect(element(by.text('Welcome, Kimberly'))).toExist()
    await expect(element(by.label('With this app, you can manage your  V-A  health care, benefits, and payments from your phone or tablet.'))).toExist()
    await expect(element(by.text('Skip'))).toExist()
    await expect(element(by.text('Next'))).toExist()
  })

  it('should tap next and show the manage your health care content', async () => {
    await element(by.text('Next')).tap()
    await expect(element(by.text('Manage your health care')))
    await expect(element(by.text('Use our health care tools to manage tasks like these:'))).toExist()
    await expect(element(by.text('Refill your prescriptions'))).toExist()
    await expect(element(by.text('Communicate with your health care team'))).toExist()
    await expect(element(by.text('Review your appointments'))).toExist()
    await expect(element(by.text('Back'))).toExist()
    await expect(element(by.text('Next'))).toExist()
  })

  it('should tap next and show the manage your benefits content', async () => {
    await element(by.text('Next')).tap()
    await expect(element(by.text('Manage your benefits'))).toExist()
    await expect(element(by.text('Use our benefits tools to manage tasks like these:'))).toExist()
    await expect(element(by.text('Review your disability rating'))).toExist()
    await expect(element(by.text('Check the status of your claims and appeals'))).toExist()
    await expect(element(by.label('Download common  V-A  letters'))).toExist()
    await expect(element(by.text('Back'))).toExist()
    await expect(element(by.text('Next'))).toExist()
  })

  it('should tap next and show the manage your payments content', async () => {
    await element(by.text('Next')).tap()
    await expect(element(by.text('Manage your payments'))).toExist()
    await expect(element(by.text('Use our payments tools to manage tasks like these:'))).toExist()
    await expect(element(by.text('Update your direct deposit information'))).toExist()
    await expect(element(by.text('Review the history of payments we’ve sent to you'))).toExist()
    await expect(element(by.text('Back'))).toExist()
    await expect(element(by.text('Done'))).toExist()
  })

  it('should tap back and verify the previous page is displayed', async () => {
    await element(by.text('Back')).tap()
    await expect(element(by.text('Manage your benefits'))).toExist()
    await element(by.text('Back')).tap()
    await expect(element(by.text('Manage your health care'))).toExist()
    await element(by.text('Back')).tap()
    await expect(element(by.text('Welcome, Kimberly'))).toExist()
  })

  it('should tap next and done and verify the home page is displayed', async () => {
    await element(by.text('Next')).tap()
    await element(by.text('Next')).tap()
    await element(by.text('Next')).tap()
    await element(by.text('Done')).tap()
    await expect(element(by.text('Contact VA'))).toExist()
    await expect(element(by.text('Find a VA location'))).toExist()
  })

  it('should reinstall the app, tap skip for the onboarding steps, and verify the home page is displayed', async () => {
    await device.uninstallApp()
    await device.installApp()
    await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } })
    await loginToDemoMode(false)
    await element(by.text('Skip')).tap()
    await expect(element(by.text('Contact VA'))).toExist()
    await expect(element(by.text('Find a VA location'))).toExist()
  })
})
