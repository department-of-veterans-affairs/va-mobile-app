/*
Description:
Detox script that follows the Personal Information, Personal Info - Personal Info - Preferred Name test cases found in testRail (VA Mobile App > RC Regression Test > Manual > Profile Page - Elements)
When to update:
This script should be updated whenever new things are added/changed in personal information, preferred name or if anything is changed in src/store/api/demo/mocks/personalInformation.json or src/store/api/demo/mocks/demographics.json.
*/
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
  HOW_TO_UPDATE_ID: 'howDoIUpdateTestID',
  HOW_TO_UPDATE_LINK_ID: 'howToFixLegalNameID',
  HOW_TO_UPDATE_CLOSE_ID: 'howDoIUpdateCloseTestID',
  WHAT_TO_KNOW_ID: 'whatToKnowID',
  WHAT_TO_KNOW_CLOSE_ID: 'whatToKnowBackID',
  HOW_TO_FIX_LINK_ID: 'howToFixDOBID',
  LEARN_HOW_LINK_ID: 'learnToChangeLegalNameID',
  NEAREST_CENTER_LINK_ID: 'findNearestVAMedicalCenterID',
  PREFERRED_NAME_HEADER_TEXT: 'Preferred name',
  PREFERRED_NAME_ROW_ID: 'preferredNameRowID',
  PREFERRED_NAME_ID: 'preferredNameTestID',
  PREFERRED_NAME_BACK_ID: 'preferredNameBackID',
  PREFER_NOT_TEXT: 'Prefer not to answer',
  PERSONAL_INFO_SCROLL_ID: 'PersonalInformationTestID',
}

/** This function will scroll to and tap the link.
 * @param text: String text of either the text of the link (if id is false) or the testID of the link (if id is true)
 * @param scrollID: String text of the testID of the page with the scrollView
 * @param id: Boolean value for whether the link is searching by.text or by.id
 * */
const scrollToThenTap = async (text: string, scrollID?: string, id?: boolean) => {
  if (scrollID != undefined) {
    await element(by.id(scrollID)).atIndex(0).scrollTo('bottom')
  } else {
    await element(by.id(PersonalInfoConstants.PERSONAL_INFO_SCROLL_ID)).atIndex(0).scrollTo('bottom')
  }
  if (id) {
    await waitFor(element(by.id(text))).toBeVisible()
    await element(by.id(text)).tap()
  } else {
    await waitFor(element(by.text(text))).toBeVisible()
    await element(by.text(text)).tap()
  }
}

/** This function will check the nearest VA center and call links. This script is only run on the Android simulator because the iOS simulator does not have phone capabilities
 * @param scrollID: String text of the testID of the page with the scrollView
 * */
const checkLocatorAndContactLinks = async (scrollID?: string) => {
  await device.disableSynchronization()
  await scrollToThenTap(PersonalInfoConstants.NEAREST_CENTER_LINK_ID, scrollID, true)
  await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
  await setTimeout(5000)
  await device.takeScreenshot('PersonalInformationFindVALocations')
  await device.launchApp({ newInstance: false })

  await scrollToThenTap(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID, undefined, true)
  await setTimeout(1000)
  await device.takeScreenshot('PersonalInformationPhoneNumber')
  await device.launchApp({ newInstance: false })

  await scrollToThenTap(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID, undefined, true)
  await setTimeout(1000)
  await device.takeScreenshot('PersonalInformationTTY')
  await device.launchApp({ newInstance: false })
  await device.enableSynchronization()
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

    await expect(element(by.text(PersonalInfoConstants.PREFERRED_NAME_HEADER_TEXT))).toExist()
    await expect(element(by.text('Sharing your preferred name is optional.'))).toExist()
  })

  it('should tap links in "How to update" large panel', async () => {
    await element(by.id(PersonalInfoConstants.HOW_TO_UPDATE_LINK_ID)).tap()
    await expect(element(by.id(PersonalInfoConstants.HOW_TO_UPDATE_ID))).toExist()

    await element(by.id(PersonalInfoConstants.LEARN_HOW_LINK_ID)).tap()
    await setTimeout(2000)
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('personalInfoLearnHowToWebPage')
    await device.launchApp({ newInstance: false })

    if (device.getPlatform() === 'android') {
      await checkLocatorAndContactLinks(PersonalInfoConstants.HOW_TO_UPDATE_ID)
    }

    await element(by.id(PersonalInfoConstants.HOW_TO_UPDATE_CLOSE_ID)).tap()
  })

  it('should tap links in "How to fix an error" large panel', async () => {
    await element(by.id(PersonalInfoConstants.HOW_TO_FIX_LINK_ID)).tap()
    await expect(element(by.id(PersonalInfoConstants.HOW_TO_UPDATE_ID))).toExist()

    if (device.getPlatform() === 'android') {
      await checkLocatorAndContactLinks(PersonalInfoConstants.HOW_TO_UPDATE_ID)
    }

    await element(by.id(PersonalInfoConstants.HOW_TO_UPDATE_CLOSE_ID)).tap()
  })

  it('should update preferred name', async () => {
    await element(by.id(PersonalInfoConstants.PREFERRED_NAME_ROW_ID)).tap()
    await expect(element(by.text(PersonalInfoConstants.PREFERRED_NAME_HEADER_TEXT)).atIndex(0)).toExist()
    await element(by.id(PersonalInfoConstants.PREFERRED_NAME_ID)).replaceText('Kimberlee')
    await element(by.id(PersonalInfoConstants.PREFERRED_NAME_ID)).tapReturnKey()
    await element(by.text(CommonE2eIdConstants.SAVE_TEXT)).tap()

    await expect(element(by.text(PersonalInfoConstants.PERSONAL_INFORMATION_TEXT)).atIndex(0)).toExist()
    await expect(element(by.text('Preferred name saved'))).toExist()
    await expect(element(by.text('Kimberlee'))).toExist()

    await element(by.id(PersonalInfoConstants.PREFERRED_NAME_ROW_ID)).tap()
    await expect(element(by.text('Preferred name saved'))).not.toExist()
    await expect(element(by.text('Kimberlee')).atIndex(0)).toExist()
    await element(by.id(PersonalInfoConstants.PREFERRED_NAME_BACK_ID)).tap()
  })
})
