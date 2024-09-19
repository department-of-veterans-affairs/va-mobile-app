import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import {
  CommonE2eIdConstants,
  loginToDemoMode,
  openPersonalInformation,
  openProfile,
  toggleRemoteConfigFlag,
} from './utils'

export const PersonalInfoConstants = {
  PERSONAL_INFORMATION_TEXT: 'Personal information',
  HOW_TO_UPDATE_LINK_ID: 'howToFixLegalNameID',
  HOW_TO_FIX_LINK_ID: 'howToFixDOBID',
  LEARN_HOW_LINK_ID: 'learnToChangeLegalNameID',
  NEAREST_CENTER_LINK_ID: 'findNearestVAMedicalCenterID',
  PREFERRED_NAME_ROW_TEXT: 'Preferred name',
  PREFERRED_NAME_ID: 'preferredNameTestID',
  GENDER_IDENTITY_ROW_TEXT: 'Gender identity',
  GENDER_IDENTITY_WHAT_TO_KNOW_TEXT: 'whatToKnowTestID',
  GENDER_IDENTITY_BACK_ID: 'genderIdentityBackID',
  PREFER_NOT_TEXT: 'Prefer not to answer',
}

const scrollToThenTap = async (text: string) => {
  await element(by.id('PersonalInformationTestID')).atIndex(0).scrollTo('bottom')
  try {
    await waitFor(element(by.text(text))).toBeVisible()
    await element(by.text(text)).tap()
  } catch (ex) {
    await waitFor(element(by.id(text))).toBeVisible()
    await element(by.id(text)).tap()
  }
}

const checkLocatorAndContactLinks = async () => {
  await device.disableSynchronization()
  await scrollToThenTap(PersonalInfoConstants.NEAREST_CENTER_LINK_ID)
  await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
  await setTimeout(5000)
  await device.takeScreenshot('PersonalInformationFindVALocations')
  await device.launchApp({ newInstance: false })

  await scrollToThenTap(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)
  await setTimeout(1000)
  await device.takeScreenshot('PersonalInformationPhoneNumber')
  await device.launchApp({ newInstance: false })

  await scrollToThenTap(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)
  await setTimeout(1000)
  await device.takeScreenshot('PersonalInformationTTY')
  await device.launchApp({ newInstance: false })
  await device.enableSynchronization()
}

export async function updateGenderIdentify(genderIdentityOption) {
  it('should update gender identity for ' + genderIdentityOption, async () => {
    await element(by.id('PersonalInformationTestID')).scrollTo('bottom')
    await element(by.text(PersonalInfoConstants.GENDER_IDENTITY_ROW_TEXT)).tap()
    await expect(element(by.text(PersonalInfoConstants.GENDER_IDENTITY_ROW_TEXT)).atIndex(0)).toExist()
    await scrollToThenTap(genderIdentityOption)
    await element(by.text(genderIdentityOption)).tap()
    await element(by.id('genderIdentitySaveID')).tap()
    await expect(element(by.text(genderIdentityOption))).toExist()

    await expect(element(by.text(PersonalInfoConstants.PERSONAL_INFORMATION_TEXT))).toExist()
    await expect(element(by.text('Gender identity saved'))).toExist()
    await expect(element(by.text(genderIdentityOption))).toExist()
    await element(by.text('Dismiss')).tap()

    await element(by.id('PersonalInformationTestID')).scrollTo('bottom')
    await element(by.text(PersonalInfoConstants.GENDER_IDENTITY_ROW_TEXT)).tap()
    await expect(element(by.text('Gender identity saved'))).not.toExist()
    await expect(element(by.label(genderIdentityOption + ' ').withDescendant(by.id('RadioFilled')))).toExist()
    await element(by.id(PersonalInfoConstants.GENDER_IDENTITY_BACK_ID)).tap()
  })
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  await openProfile()
  await openPersonalInformation()
})

describe('Personal Info Screen', () => {
  it('should match design', async () => {
    await expect(element(by.text('Date of birth'))).toExist()
    await expect(element(by.text('January 01, 1950'))).toExist()

    await expect(element(by.text('Preferred name'))).toExist()
    await expect(element(by.text('Sharing your preferred name is optional.'))).toExist()

    await expect(element(by.text('Gender identity'))).toExist()
    await expect(element(by.text('Woman'))).toExist()
  })

  it('should tap links in "How to update" large panel', async () => {
    await element(by.id(PersonalInfoConstants.HOW_TO_UPDATE_LINK_ID)).tap()
    await expect(element(by.text('Profile help'))).toExist()

    await element(by.id(PersonalInfoConstants.LEARN_HOW_LINK_ID)).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('personalInfoLearnHowToWebPage')
    await device.launchApp({ newInstance: false })

    if (device.getPlatform() === 'android') {
      await checkLocatorAndContactLinks()
    }

    await element(by.text('Close')).tap()
  })

  it('should tap links in "How to fix an error" large panel', async () => {
    await element(by.id(PersonalInfoConstants.HOW_TO_FIX_LINK_ID)).tap()
    await expect(element(by.text('Profile help'))).toExist()

    if (device.getPlatform() === 'android') {
      await checkLocatorAndContactLinks()
    }

    await element(by.text('Close')).tap()
  })

  it('should update preferred name', async () => {
    await element(by.text(PersonalInfoConstants.PREFERRED_NAME_ROW_TEXT)).tap()
    await expect(element(by.text(PersonalInfoConstants.PREFERRED_NAME_ROW_TEXT)).atIndex(0)).toExist()
    await element(by.id(PersonalInfoConstants.PREFERRED_NAME_ID)).replaceText('Kimberlee')
    await element(by.id(PersonalInfoConstants.PREFERRED_NAME_ID)).tapReturnKey()
    await element(by.text('Save')).tap()

    await expect(element(by.text(PersonalInfoConstants.PERSONAL_INFORMATION_TEXT)).atIndex(0)).toExist()
    await expect(element(by.text('Preferred name saved'))).toExist()
    await expect(element(by.text('Kimberlee'))).toExist()

    await element(by.text(PersonalInfoConstants.PREFERRED_NAME_ROW_TEXT)).tap()
    await expect(element(by.text('Preferred name saved'))).not.toExist()
    await expect(element(by.text('Kimberlee')).atIndex(0)).toExist()
    await element(by.id('preferredNameBackID')).tap()
  })

  updateGenderIdentify(PersonalInfoConstants.PREFER_NOT_TEXT)
  updateGenderIdentify('Man')
  updateGenderIdentify('Non-Binary')
  updateGenderIdentify('Transgender Man')
  updateGenderIdentify('Transgender Woman')
  updateGenderIdentify('A gender not listed here')

  it('should show "What to know" large panel in gender identity section', async () => {
    await element(by.id('PersonalInformationTestID')).scrollTo('bottom')
    await element(by.text(PersonalInfoConstants.GENDER_IDENTITY_ROW_TEXT)).tap()
    await scrollToThenTap(PersonalInfoConstants.GENDER_IDENTITY_WHAT_TO_KNOW_TEXT)
    await expect(element(by.text('Profile help'))).toExist()
    await element(by.id('whatToKnowBackID')).tap()
    await element(by.id(PersonalInfoConstants.GENDER_IDENTITY_BACK_ID)).tap()
  })
})
