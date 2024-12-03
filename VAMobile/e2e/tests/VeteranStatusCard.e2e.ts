/*
Description:
Detox script that follows the veteran status - home page and veteran status - informational crosscheck test cases found in testRail (VA Mobile App > RC Regression Test > Manual > Home Page Elements)
When to update:
This script should be updated whenever new things are added/changed in military information, disability ratings, veteran status, or home screen or if anything is changed in src/store/api/demo/mocks/profile.json.
*/
import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import {
  CommonE2eIdConstants,
  changeMockData,
  checkImages,
  loginToDemoMode,
  openBenefits,
  openDisabilityRating,
  openMilitaryInformation,
  openProfile,
} from './utils'

export const VeteranStatusCardConstants = {
  VETERAN_STATUS_ID: 'veteranStatusButtonID',
  VETERAN_STATUS_DISABILITY_RATING_TEXT: '100% service connected',
  VETERAN_STATUS_PERIOD_OF_SERVICE_BRANCH_1_TEXT: 'United States Army',
  VETERAN_STATUS_PERIOD_OF_SERVICE_PERIOD_2_TEXT: 'September 01, 1998 – January 01, 2000',
  VETERAN_STATUS_DISCLAIMER_TEXT:
    "You can use this Veteran status to prove you served in the United States Uniformed Services. This status doesn't entitle you to any VA benefits.",
  VETERAN_STATUS_DOB_DISABILITY_ERROR_PHONE_TEXT: '800-827-1000',
  VETERAN_STATUS_PERIOD_OF_SERVICE_ERROR_PHONE_TEXT: '800-538-9552',
  VETERAN_STATUS_CLOSE_ID: 'veteranStatusCloseID',
  BACK_TO_PROFILE_ID: 'backToProfileID',
}

beforeAll(async () => {
  await loginToDemoMode()
})

/*
Validates the veteran status page design
*/
export async function validateVeteranStatusDesign() {
  await expect(element(by.text('Veteran status'))).toExist()
  const veteranStatusCardVAIcon = await element(by.id('VeteranStatusCardVAIcon')).takeScreenshot(
    'veteranStatusCardVAIcon',
  )
  checkImages(veteranStatusCardVAIcon)
  await expect(element(by.id('veteranStatusFullNameTestID'))).toExist()
  await expect(element(by.id('veteranStatusBranchTestID'))).toExist()
  await expect(element(by.id('veteranStatusDisabilityRatingTestID'))).toExist()
  await expect(element(by.id('veteranStatusMilitaryServiceTestID')).atIndex(0)).toExist()
  await expect(element(by.id('veteranStatusDODTestID'))).toExist()
  await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_DISCLAIMER_TEXT))).toExist()
  await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_DOB_DISABILITY_ERROR_PHONE_TEXT))).toExist()
  await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0)).toExist()
  await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_ERROR_PHONE_TEXT))).toExist()
  const veteranStatusCardBranchIcon = await element(by.id('veteranStatusCardBranchEmblem')).takeScreenshot(
    'veteranStatusCardBranchIcon',
  )
  checkImages(veteranStatusCardBranchIcon)
}

/*
Validates the phone and tty links work as expected
*/
export async function tapPhoneAndTTYLinks() {
  it(':android: should tap phone and TTY links', async () => {
    await device.disableSynchronization()
    await element(by.id('veteranStatusTestID')).scrollTo('bottom')

    await element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).atIndex(0).tap()
    await setTimeout(1000)
    await device.takeScreenshot('VeteranStatusDOBorDisabilityErrorPhoneNumber')
    await device.launchApp({ newInstance: false })

    await element(by.id('veteranStatusTestID')).scrollTo('bottom')
    await element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0).tap()
    try {
      await element(by.text(CommonE2eIdConstants.DISMISS_TEXT)).tap()
      await element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).atIndex(0).tap()
    } catch (e) {}
    await setTimeout(2000)
    await device.takeScreenshot('VeteranStatusDOBorDisabilityErrorTTY')
    await device.launchApp({ newInstance: false })

    await waitFor(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_ERROR_PHONE_TEXT)))
      .toBeVisible()
      .whileElement(by.id('veteranStatusTestID'))
      .scroll(200, 'down')
    await element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_ERROR_PHONE_TEXT)).tap()
    await setTimeout(2000)
    await device.takeScreenshot('VeteranStatusPeriodOfServiceErrorPhoneNumber')
    await device.launchApp({ newInstance: false })
    await device.enableSynchronization()
  })
}

/*
Validates that the military information is correct
param militaryBranch: String name of the military branch to test
*/
export async function verifyMilitaryInfo(militaryBranch) {
  it(militaryBranch + ': verify the name and branch matches the home/profile page', async () => {
    await changeMockData(
      'profile.json',
      ['/v0/military-service-history', 'data', 'attributes', { serviceHistory: 1 }, 'branchOfService'],
      militaryBranch,
    )
    await element(by.text('Home')).tap()
    await waitFor(element(by.id(VeteranStatusCardConstants.VETERAN_STATUS_ID)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.HOME_SCREEN_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.id(VeteranStatusCardConstants.VETERAN_STATUS_ID)).tap()
    await expect(element(by.text(militaryBranch)).atIndex(1)).toExist()
    await element(by.id(VeteranStatusCardConstants.VETERAN_STATUS_CLOSE_ID)).tap()
    await expect(element(by.id(VeteranStatusCardConstants.VETERAN_STATUS_ID))).toExist()
    await expect(element(by.text(militaryBranch))).toExist()
    await openProfile()
    await element(by.id(VeteranStatusCardConstants.VETERAN_STATUS_ID)).tap()
    await expect(element(by.text(militaryBranch)).atIndex(1)).toExist()
    await element(by.id(VeteranStatusCardConstants.VETERAN_STATUS_CLOSE_ID)).tap()
    await expect(element(by.id(VeteranStatusCardConstants.VETERAN_STATUS_ID))).toExist()
    await expect(element(by.text(militaryBranch))).toExist()
  })
}
describe('Veteran Status Card', () => {
  it('should match design in the home screen', async () => {
    await waitFor(element(by.id(VeteranStatusCardConstants.VETERAN_STATUS_ID)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.HOME_SCREEN_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.id(VeteranStatusCardConstants.VETERAN_STATUS_ID)).tap()
    await validateVeteranStatusDesign()
  })

  tapPhoneAndTTYLinks()

  it('should match design in the profile screen', async () => {
    await element(by.id(VeteranStatusCardConstants.VETERAN_STATUS_CLOSE_ID)).tap()
    await setTimeout(2000)
    await openProfile()
    await element(by.id(VeteranStatusCardConstants.VETERAN_STATUS_ID)).tap()
    await validateVeteranStatusDesign()
  })

  tapPhoneAndTTYLinks()

  it('verify the period of service matches app', async () => {
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_BRANCH_1_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.MILITARY_PERIOD_OF_SERVICE))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.MILITARY_BRANCH_COAST_GUARD)).atIndex(1)).toExist()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_PERIOD_2_TEXT))).toExist()
    await element(by.id(VeteranStatusCardConstants.VETERAN_STATUS_CLOSE_ID)).tap()
    await setTimeout(2000)
    await openMilitaryInformation()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_BRANCH_1_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.MILITARY_PERIOD_OF_SERVICE))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.MILITARY_BRANCH_COAST_GUARD))).toExist()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_PERIOD_2_TEXT))).toExist()
    await element(by.id(VeteranStatusCardConstants.BACK_TO_PROFILE_ID)).tap()
  })

  it('verify the disability rating matches the app', async () => {
    await element(by.id(VeteranStatusCardConstants.VETERAN_STATUS_ID)).tap()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_DISABILITY_RATING_TEXT))).toExist()
    await element(by.id(VeteranStatusCardConstants.VETERAN_STATUS_CLOSE_ID)).tap()
    await openBenefits()
    await openDisabilityRating()
    await expect(element(by.text(CommonE2eIdConstants.DISABILITY_RATING_PERCENT_TEXT)).atIndex(1)).toExist()
  })

  verifyMilitaryInfo('United States Coast Guard')
  verifyMilitaryInfo('United States Army')
  verifyMilitaryInfo('United States Air Force')
  verifyMilitaryInfo('United States Navy')
  verifyMilitaryInfo('United States Marine Corps')
  verifyMilitaryInfo('United States Space Force')

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
