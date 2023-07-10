import { by, device, element, expect, waitFor, web } from 'detox'
import { setTimeout } from 'timers/promises'

import { loginToDemoMode, openPersonalInformation, openProfile } from './utils'

export const PersonalInfoConstants = {
  PERSONAL_INFORMATION_TEXT: 'Personal information',
  HOW_TO_UPDATE_LINK_TEXT: 'How to update or fix an error in your legal name',
  HOW_TO_FIX_LINK_TEXT: 'How to fix an error in your date of birth',
  LEARN_HOW_LINK_TEXT: 'Learn how to change your legal name on file with the VA',
  NEAREST_CENTER_LINK_TEXT: 'Find nearest VA medical center',
  PHONE_LINK_TEXT: '800-827-1000',
  TTY_LINK_TEXT: 'TTY: 711',
  PREFERRED_NAME_ROW_TEXT: 'Preferred name',
  PREFERRED_NAME_ID: 'preferredNameTestID',
  GENDER_IDENTITY_ROW_TEXT: 'Gender identity',
  GENDER_IDENTITY_WHAT_TO_KNOW_TEXT: 'What to know before you decide to share your gender identity',
  PREFER_NOT_TEXT: 'Prefer not to answer',
}

const scrollToThenTap = async (text: string) => {
  await waitFor(element(by.text(text)))
    .toBeVisible()
    .whileElement(by.id('PersonalInformationTestID'))
    .scroll(500, 'down')
  await element(by.text(text)).tap()
}

const checkLocatorAndContactLinks = async () => {
  await scrollToThenTap(PersonalInfoConstants.NEAREST_CENTER_LINK_TEXT)
  await setTimeout(5000)
  await expect(web.element(by.web.className('title-section'))).toHaveText('Find VA locations')
  await element(by.text('Done')).tap()

  await scrollToThenTap(PersonalInfoConstants.PHONE_LINK_TEXT)
  await setTimeout(1000)
  await device.takeScreenshot('PersonalInformationPhoneNumber')
  await device.launchApp({ newInstance: false })

  await scrollToThenTap(PersonalInfoConstants.TTY_LINK_TEXT)
  await setTimeout(1000)
  await device.takeScreenshot('PersonalInformationTTY')
  await device.launchApp({ newInstance: false })
}

beforeAll(async () => {
  await loginToDemoMode()
  await openProfile()
  await openPersonalInformation()
  await waitFor(element(by.text(PersonalInfoConstants.PERSONAL_INFORMATION_TEXT)))
    .toExist()
    .withTimeout(10000)
})

describe('Personal Information Screen', () => {
  it('should match design', async () => {
    await expect(element(by.text('Date of birth'))).toExist()
    await expect(element(by.text('January 01, 1950'))).toExist()

    await expect(element(by.text('Preferred name'))).toExist()
    await expect(element(by.text('Sharing your preferred name is optional.'))).toExist()

    await expect(element(by.text('Gender identity'))).toExist()
    await expect(element(by.text('Woman'))).toExist()
  })

  it('should tap links in "How to update" large panel', async () => {
    await element(by.text(PersonalInfoConstants.HOW_TO_UPDATE_LINK_TEXT)).tap()
    await expect(element(by.text('Profile help'))).toExist()

    if (device.getPlatform() === 'android') {
      await element(by.text(PersonalInfoConstants.LEARN_HOW_LINK_TEXT)).tap()
      await expect(web.element(by.web.tag('article'))).toHaveText('How to change your legal name on file with VA')
      await element(by.text('Done')).tap()

      await checkLocatorAndContactLinks()
    }

    await element(by.text('Close')).tap()
  })

  it('should tap links in "How to fix an error" large panel', async () => {
    await element(by.text(PersonalInfoConstants.HOW_TO_FIX_LINK_TEXT)).tap()
    await expect(element(by.text('Profile help'))).toExist()

    if (device.getPlatform() === 'android') {
      await checkLocatorAndContactLinks()
    }

    await element(by.text('Close')).tap()
  })

  it('should update preferred name', async () => {
    await element(by.text(PersonalInfoConstants.PREFERRED_NAME_ROW_TEXT)).tap()
    await expect(element(by.text(PersonalInfoConstants.PREFERRED_NAME_ROW_TEXT)).atIndex(0)).toExist()
    await element(by.id(PersonalInfoConstants.PREFERRED_NAME_ID)).typeText('Kimberlee\n')
    await element(by.text('Save')).tap()

    await expect(element(by.text(PersonalInfoConstants.PERSONAL_INFORMATION_TEXT)).atIndex(0)).toExist()
    await expect(element(by.text('Preferred name saved'))).toExist()
    await expect(element(by.text('Kimberlee'))).toExist()

    await element(by.text(PersonalInfoConstants.PREFERRED_NAME_ROW_TEXT)).tap()
    await expect(element(by.text('Preferred name saved'))).not.toExist()
    await expect(element(by.text('Kimberlee')).atIndex(0)).toExist()
    await element(by.text('Cancel')).tap()
  })

  it('should update gender identity', async () => {
    await element(by.text(PersonalInfoConstants.GENDER_IDENTITY_ROW_TEXT)).tap()
    await expect(element(by.text(PersonalInfoConstants.GENDER_IDENTITY_ROW_TEXT)).atIndex(0)).toExist()
    await element(by.text(PersonalInfoConstants.PREFER_NOT_TEXT)).tap()
    await element(by.text('Save')).tap()

    await expect(element(by.text(PersonalInfoConstants.PERSONAL_INFORMATION_TEXT))).toExist()
    await expect(element(by.text('Gender identity saved'))).toExist()
    await expect(element(by.text(PersonalInfoConstants.PREFER_NOT_TEXT))).toExist()
    await element(by.text('Dismiss')).tap()

    await element(by.text(PersonalInfoConstants.GENDER_IDENTITY_ROW_TEXT)).tap()
    await expect(element(by.text('Gender identity saved'))).not.toExist()
    await expect(element(by.label(PersonalInfoConstants.PREFER_NOT_TEXT + ' ').withDescendant(by.id('RadioFilled')))).toExist()
    await element(by.text('Cancel')).tap()
  })

  it('should show "What to know" large panel in gender identity section', async () => {
    await element(by.text(PersonalInfoConstants.GENDER_IDENTITY_ROW_TEXT)).tap()
    await scrollToThenTap(PersonalInfoConstants.GENDER_IDENTITY_WHAT_TO_KNOW_TEXT)
    await expect(element(by.text('Profile help'))).toExist()
    await element(by.text('Close')).tap()
    await element(by.text('Cancel')).tap()
  })
})
