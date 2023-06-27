import { by, device, element, expect, waitFor } from 'detox'
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
}

const scrollToThenTap = async (text: string) => {
  await waitFor(element(by.text(text)))
    .toBeVisible()
    .whileElement(by.id('PersonalInformationTestID'))
    .scroll(500, 'down')
  await element(by.text(text)).tap()
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

    await element(by.text(PersonalInfoConstants.LEARN_HOW_LINK_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('PersonalInformationChangeNameLink')
    await element(by.text('Done')).tap()

    await scrollToThenTap(PersonalInfoConstants.NEAREST_CENTER_LINK_TEXT)
    await setTimeout(5000)
    await device.takeScreenshot('PersonalInformationFindVACenterLink')
    await element(by.text('Done')).tap()

    if (device.getPlatform() === 'android') {
      await scrollToThenTap(PersonalInfoConstants.PHONE_LINK_TEXT)
      await setTimeout(5000)
      await device.takeScreenshot('PersonalInformationPhoneNumber')
      await device.launchApp({ newInstance: false })

      await scrollToThenTap(PersonalInfoConstants.TTY_LINK_TEXT)
      await setTimeout(5000)
      await device.takeScreenshot('PersonalInformationTTY')
      await device.launchApp({ newInstance: false })
    }

    await element(by.text('Close')).tap()
  })

  it('should tap links in "How to fix an error" large panel', async () => {
    await element(by.text(PersonalInfoConstants.HOW_TO_FIX_LINK_TEXT)).tap()
    await expect(element(by.text('Profile help'))).toExist()

    await scrollToThenTap(PersonalInfoConstants.NEAREST_CENTER_LINK_TEXT)
    await setTimeout(5000)
    await device.takeScreenshot('PersonalInformationFindVACenterLink')
    await element(by.text('Done')).tap()

    if (device.getPlatform() === 'android') {
      await scrollToThenTap(PersonalInfoConstants.PHONE_LINK_TEXT)
      await setTimeout(5000)
      await device.takeScreenshot('PersonalInformationPhoneNumber')
      await device.launchApp({ newInstance: false })

      await scrollToThenTap(PersonalInfoConstants.TTY_LINK_TEXT)
      await setTimeout(5000)
      await device.takeScreenshot('PersonalInformationTTY')
      await device.launchApp({ newInstance: false })
    }

    await element(by.text('Close')).tap()
  })

  it('should update preferred name', async () => {
    await element(by.text(PersonalInfoConstants.PREFERRED_NAME_ROW_TEXT)).tap()
    await expect(element(by.text(PersonalInfoConstants.PREFERRED_NAME_ROW_TEXT))).toExist()
    await element(by.id(PersonalInfoConstants.PREFERRED_NAME_ID)).typeText('Kimberlee')
    await element(by.text('Save')).tap()

    await expect(element(by.text(PersonalInfoConstants.PERSONAL_INFORMATION_TEXT))).toExist()
    await expect(element(by.text('Preferred name saved'))).toExist()
    await expect(element(by.text('Kimberlee'))).toExist()

    await element(by.text(PersonalInfoConstants.PREFERRED_NAME_ROW_TEXT)).tap()
    await expect(element(by.text('Preferred name saved'))).not.toExist()
    await expect(element(by.id(PersonalInfoConstants.PREFERRED_NAME_ID))).toHaveValue('Kimberlee')
    await element(by.text('Cancel')).tap()
  })
})
