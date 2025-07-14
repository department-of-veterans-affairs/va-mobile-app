import { by, device, element, expect } from 'detox'
import { setTimeout } from 'timers/promises'

import { CommonE2eIdConstants, checkImages, loginToDemoMode, openMilitaryInformation, openProfile } from './utils'

export const MilitaryInformationE2eIdConstants = {
  SERVICE_INFORMATION_INCORRECT_ID: 'militaryServiceIncorrectLinkID',
  SERVICE_INFORMATION_INCORRECT_SWIPE: 'IncorrectServiceTestID',
  SERVICE_INFORMATION_INCORRECT_BODY_LABEL_1:
    'Some Veterans have reported seeing military service information in their V-A .gov profiles that doesn’t seem right. When this happens, it’s because there’s an error in the information we’re pulling into V-A .gov from the Defense Enrollment Eligibility Reporting System (D-E-E-R-S).',
  SERVICE_INFORMATION_INCORRECT_BODY_LABEL_2:
    'If the military service information in your profile doesn’t look right, please call the Defense Manpower Data Center (D-M-D-C). They’ll work with you to update your information in D-E-E-R-S.',
  SERVICE_INFORMATION_INCORRECT_BODY_LABEL_3:
    'To reach the D-M-D-C, call Monday through Friday (except federal holidays), 8:00 a.m. to 8:00 p.m. Eastern Time.',
  SERVICE_NOT_AVAILABLE_PAGE_TITLE_TEXT: "We can't access your military information",
  SERVICE_NOT_AVAILABLE_ID: 'noMilitaryAccessTestID',
}

beforeAll(async () => {
  await loginToDemoMode()
})

describe('Military Info Screen', () => {
  it('verify military branch is shown and seal is correct', async () => {
    const militaryBranch = CommonE2eIdConstants.MILITARY_BRANCH_COAST_GUARD
    let tempPath = await element(by.id(`${militaryBranch} Emblem`)).takeScreenshot(militaryBranch + 'ImageTestHome')
    checkImages(tempPath)
    await expect(element(by.text(militaryBranch))).toExist()
    await openProfile()
    tempPath = await element(by.id(`${militaryBranch} Emblem`)).takeScreenshot(militaryBranch + 'ImageTestProfile')
    checkImages(tempPath)
    await expect(element(by.text(militaryBranch))).toExist()
    await openMilitaryInformation()
    await expect(element(by.text(militaryBranch)).atIndex(0)).toExist()
    await expect(element(by.text(CommonE2eIdConstants.MILITARY_PERIOD_OF_SERVICE))).toExist()
  })

  it('should open new screen if military service information is incorrect', async () => {
    await element(by.id(MilitaryInformationE2eIdConstants.SERVICE_INFORMATION_INCORRECT_ID)).tap()
    await expect(
      element(by.label(MilitaryInformationE2eIdConstants.SERVICE_INFORMATION_INCORRECT_BODY_LABEL_1)),
    ).toExist()
    await expect(
      element(by.label(MilitaryInformationE2eIdConstants.SERVICE_INFORMATION_INCORRECT_BODY_LABEL_2)),
    ).toExist()
    await expect(
      element(by.label(MilitaryInformationE2eIdConstants.SERVICE_INFORMATION_INCORRECT_BODY_LABEL_3)),
    ).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID))).toExist()
    await element(by.id(MilitaryInformationE2eIdConstants.SERVICE_INFORMATION_INCORRECT_SWIPE)).swipe('up')
    if (device.getPlatform() === 'android') {
      await device.disableSynchronization()
      await element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).tap()
      await setTimeout(5000)
      await device.enableSynchronization()
      await device.launchApp({ newInstance: false })
    }
  })
})
