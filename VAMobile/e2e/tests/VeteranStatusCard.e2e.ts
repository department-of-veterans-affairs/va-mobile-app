import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import { checkImages, loginToDemoMode, openBenefits, openDisabilityRating, openMilitaryInformation, openPersonalInformation, openProfile } from './utils'

export const VeteranStatusCardConstants = {
  VETERAN_STATUS_TEXT: 'Proof of Veteran status',
  VETERAN_STATUS_NAME_TEXT: 'Kimberly Washington',
  VETERAN_STATUS_MILITARY_BRANCH_TEXT: 'United States Coast Guard',
  VETERAN_STATUS_DISABILITY_RATING_TEXT: '100% service connected',
  VETERAN_STATUS_PERIOD_OF_SERVICE_BRANCH_1_TEXT: 'United States Army',
  VETERAN_STATUS_PERIOD_OF_SERVICE_PERIOD_1_TEXT: 'July 13, 1970 – August 31, 1998',
  VETERAN_STATUS_PERIOD_OF_SERVICE_PERIOD_2_TEXT: 'September 01, 1998 – January 01, 2000',
  VETERAN_STATUS_DATE_OF_BIRTH_TEXT: 'January 01, 1950',
  VETERAN_STATUS_DISCLAIMER_TEXT: 'You can use this Veteran status to prove you served in the United States Uniformed Services. This status doesn\'t entitle you to any VA benefits.',
  VETERAN_STATUS_DOB_DISABILITY_ERROR_PHONE_TEXT: '800-827-1000',
  VETERAN_STATUS_DOB_DISABILITY_ERROR_TTY_TEXT: 'TTY: 711',
  VETERAN_STATUS_PERIOD_OF_SERVICE_ERROR_PHONE_TEXT: '800-538-9552',
}

beforeAll(async () => {
  await loginToDemoMode()
})

export async function validateVeteranStatusDesign() {
  await expect(element(by.text('Veteran status'))).toExist()
  var veteranStatusCardVAIcon = await element(by.id('VeteranStatusCardVAIcon')).takeScreenshot('veteranStatusCardVAIcon')
  checkImages(veteranStatusCardVAIcon)
  await expect(element(by.id('veteranStatusFullNameTestID'))).toExist()
  await expect(element(by.id('veteranStatusBranchTestID'))).toExist()
  await expect(element(by.id('veteranStatusDisabilityRatingTestID'))).toExist()
  await expect(element(by.id('veteranStatusMilitaryServiceTestID')).atIndex(0)).toExist()
  await expect(element(by.id('veteranStatusDOBTestID'))).toExist()
  await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_DISCLAIMER_TEXT))).toExist()
  await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_DOB_DISABILITY_ERROR_PHONE_TEXT))).toExist()
  await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_DOB_DISABILITY_ERROR_TTY_TEXT))).toExist()
  await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_ERROR_PHONE_TEXT))).toExist()
  var veteranStatusCardBranchIcon = await element(by.id('VeteranStatusUSCoastGuardTestID')).takeScreenshot('veteranStatusCardBranchIcon')
	checkImages(veteranStatusCardBranchIcon)
}

export async function tapPhoneAndTTYLinks() {
  it(':android: should tap phone and TTY links', async () => {
    await waitFor(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_DOB_DISABILITY_ERROR_PHONE_TEXT))).toBeVisible().whileElement(by.id('veteranStatusTestID')).scroll(200, 'down')
    await element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_DOB_DISABILITY_ERROR_PHONE_TEXT)).tap()
    await setTimeout(1000)
    await device.takeScreenshot('VeteranStatusDOBorDisabilityErrorPhoneNumber')
    await device.launchApp({ newInstance: false })

    await waitFor(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_DOB_DISABILITY_ERROR_TTY_TEXT))).toBeVisible().whileElement(by.id('veteranStatusTestID')).scroll(200, 'down')
    await element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_DOB_DISABILITY_ERROR_TTY_TEXT)).tap()
    try {
      await element(by.text('Dismiss')).tap()
      await element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_ERROR_PHONE_TEXT)).tap()
    } catch (e) {} 
    await setTimeout(7000)
    await device.takeScreenshot('VeteranStatusDOBorDisabilityErrorTTY')
    await device.launchApp({ newInstance: false })

    await waitFor(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_ERROR_PHONE_TEXT))).toBeVisible().whileElement(by.id('veteranStatusTestID')).scroll(200, 'down')
    await element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_ERROR_PHONE_TEXT)).tap()
    await setTimeout(7000)
    await device.takeScreenshot('VeteranStatusPeriodOfServiceErrorPhoneNumber')
    await device.launchApp({ newInstance: false })
  })
}
describe('Veteran Status Card', () => {

  it('should match design in the home screen', async () => {
    await element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_TEXT)).tap()
    await validateVeteranStatusDesign()
  })

  tapPhoneAndTTYLinks()

  it('should match design in the profile screen', async () => {
    await element(by.text('Close')).tap()
    await openProfile()
    await element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_TEXT)).tap()
    await validateVeteranStatusDesign()
  })

  tapPhoneAndTTYLinks()

  it('should verify the period of service matches the period of service in the app', async () => {
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_BRANCH_1_TEXT))).toExist()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_PERIOD_1_TEXT))).toExist()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_MILITARY_BRANCH_TEXT)).atIndex(1)).toExist()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_PERIOD_2_TEXT))).toExist()
    await element(by.text('Close')).tap()
    await openMilitaryInformation()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_BRANCH_1_TEXT))).toExist()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_PERIOD_1_TEXT))).toExist()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_MILITARY_BRANCH_TEXT))).toExist()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_PERIOD_OF_SERVICE_PERIOD_2_TEXT))).toExist()
    await element(by.text('Profile')).tap()
  })

  it('should verify the date of birth matches the dob in the app', async () => {
    await element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_TEXT)).tap()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_DATE_OF_BIRTH_TEXT))).toExist()
    await element(by.text('Close')).tap()
    await openPersonalInformation()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_DATE_OF_BIRTH_TEXT))).toExist()
    await element(by.text('Profile')).tap()
  })

  it('should verify the disability rating matches the disability rating in the app', async () => {
    await element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_TEXT)).tap()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_DISABILITY_RATING_TEXT))).toExist()
    await element(by.text('Close')).tap()
    await openBenefits()
    await openDisabilityRating()
    await expect(element(by.text('100%')).atIndex(1)).toExist()
  })

  it('should verify the name and branch matches the home/profile page', async () => {
    await element(by.text('Home')).tap()
    await element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_TEXT)).tap()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_NAME_TEXT)).atIndex(1)).toExist()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_MILITARY_BRANCH_TEXT)).atIndex(1)).toExist()
    await element(by.text('Close')).tap()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_NAME_TEXT))).toExist()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_MILITARY_BRANCH_TEXT))).toExist()
    await openProfile()
    await element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_TEXT)).tap()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_NAME_TEXT)).atIndex(1)).toExist()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_MILITARY_BRANCH_TEXT)).atIndex(1)).toExist()
    await element(by.text('Close')).tap()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_NAME_TEXT))).toExist()
    await expect(element(by.text(VeteranStatusCardConstants.VETERAN_STATUS_MILITARY_BRANCH_TEXT))).toExist()
  })
})
