import { by, device, element, expect } from 'detox'
import { setTimeout } from 'timers/promises'

import {
  CommonE2eIdConstants,
  changeMockData,
  checkImages,
  loginToDemoMode,
  openMilitaryInformation,
  openProfile,
} from './utils'

export const MilitaryInformationE2eIdConstants = {
  MILITARY_DATE_TEXT: 'July 13, 1970 – August 31, 1998',
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

export async function verifyMilitaryInfo(militaryBranch: string) {
  it('verify ' + militaryBranch + ' is shown and seal is correct', async () => {
    //changing the JSON file is currently causing issues only on iOS. Commenting out this code until it can be fixed
    await changeMockData(
      'profile.json',
      ['/v0/military-service-history', 'data', 'attributes', { serviceHistory: 1 }, 'branchOfService'],
      militaryBranch,
    )
    let tempPath = await element(by.id(`${militaryBranch} Emblem`)).takeScreenshot(militaryBranch + 'ImageTestHome')
    checkImages(tempPath)
    await expect(element(by.text(militaryBranch))).toExist()
    await openProfile()
    tempPath = await element(by.id(`${militaryBranch} Emblem`)).takeScreenshot(militaryBranch + 'ImageTestProfile')
    checkImages(tempPath)
    await expect(element(by.text(militaryBranch))).toExist()
    await openMilitaryInformation()
    await expect(element(by.text(militaryBranch)).atIndex(0)).toExist()
    await expect(element(by.text(MilitaryInformationE2eIdConstants.MILITARY_DATE_TEXT))).toExist()
  })
}

describe('Military Info Screen', () => {
  verifyMilitaryInfo('United States Coast Guard')
  verifyMilitaryInfo('United States Army')
  verifyMilitaryInfo('United States Air Force')
  verifyMilitaryInfo('United States Navy')
  verifyMilitaryInfo('United States Marine Corps')
  verifyMilitaryInfo('United States Space Force')

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

  it('should show correct information if no military service is available', async () => {
    await changeMockData('profile.json', ['/v0/military-service-history', 'data', 'attributes', 'serviceHistory'], [])
    await device.launchApp({ newInstance: true })
    await loginToDemoMode()
    await openProfile()
    await openMilitaryInformation()
    await expect(element(by.text(MilitaryInformationE2eIdConstants.SERVICE_NOT_AVAILABLE_PAGE_TITLE_TEXT))).toExist()
    await expect(element(by.id(MilitaryInformationE2eIdConstants.SERVICE_NOT_AVAILABLE_ID))).toExist()
  })

  it('should reset mock data', async () => {
    await changeMockData(
      'profile.json',
      ['/v0/military-service-history', 'data', 'attributes', 'serviceHistory'],
      [
        {
          branchOfService: 'United States Army',
          beginDate: '1970-07-13',
          endDate: '1998-08-31',
          formattedBeginDate: 'July 13, 1970',
          formattedEndDate: 'August 31, 1998',
          characterOfDischarge: 'Dishonorable',
          honorableServiceIndicator: 'N',
        },
        {
          branchOfService: 'United States Coast Guard',
          beginDate: '1998-09-01',
          endDate: '2000-01-01',
          formattedBeginDate: 'September 01, 1998',
          formattedEndDate: 'January 01, 2000',
          characterOfDischarge: 'Honorable',
          honorableServiceIndicator: 'Y',
        },
      ],
    )
  })
})
