import { by, device, element, expect } from 'detox'
import { setTimeout } from 'timers/promises'

import { CommonE2eIdConstants, loginToDemoMode, openBenefits, openDisabilityRating } from './utils'

export const DisabilityRatingsIdConstants = {
  COMBINED_DISABILITY_RATING_TEXT: 'Combined disability rating',
  COMBINED_DISABILITY_RATING_BODY_TEXT:
    "This rating doesn't include any disabilities for your claims that are still in process. You can check the status of your disability claims or appeals with the Claim Status tool.",
  INDIVIDUAL_RATING_TEXT: 'Individual ratings',
  INDIVIDUAL_RATING_1_ID: '20%',
  INDIVIDUAL_RATING_1_ID_2: 'Dr Diagnosis (claimed as Heart disease',
  INDIVIDUAL_RATING_1_ID_3: 'Service-connected disability?  No',
  INDIVIDUAL_RATING_1_ID_4: 'Effective date:  06/06/2017',
  DISABILITY_RATING_PAGE_ID: 'disabilityRatingTestID',
  ABOUT_DISABILITY_RATINGS_LINK_ID: 'aboutDisabilityRatingsTestID',
}

beforeAll(async () => {
  await loginToDemoMode()
  await openBenefits()
  await openDisabilityRating()
})

describe('Disability Ratings', () => {
  it('should match the disability ratings page design', async () => {
    await expect(element(by.text(DisabilityRatingsIdConstants.COMBINED_DISABILITY_RATING_TEXT))).toExist()
    await expect(element(by.text(DisabilityRatingsIdConstants.COMBINED_DISABILITY_RATING_TEXT))).toExist()
    await expect(element(by.text(DisabilityRatingsIdConstants.INDIVIDUAL_RATING_TEXT))).toExist()
    await expect(element(by.id(DisabilityRatingsIdConstants.INDIVIDUAL_RATING_1_ID))).toExist()
    await expect(element(by.id(DisabilityRatingsIdConstants.INDIVIDUAL_RATING_1_ID_2))).toExist()
    await expect(element(by.id(DisabilityRatingsIdConstants.INDIVIDUAL_RATING_1_ID_3))).toExist()
    await expect(element(by.id(DisabilityRatingsIdConstants.INDIVIDUAL_RATING_1_ID_4))).toExist()
    await expect(element(by.id(DisabilityRatingsIdConstants.ABOUT_DISABILITY_RATINGS_LINK_ID))).toExist()
    await expect(element(by.id(DisabilityRatingsIdConstants.ABOUT_DISABILITY_RATINGS_LINK_ID))).toExist()
    await expect(element(by.id('needHelpIDSection'))).toExist()
  })

  it('verify About VA disability ratings information', async () => {
    await element(by.id(DisabilityRatingsIdConstants.DISABILITY_RATING_PAGE_ID)).scrollTo('bottom')
    await element(by.id(DisabilityRatingsIdConstants.ABOUT_DISABILITY_RATINGS_LINK_ID)).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('AboutDisabilityRatings')
    await device.launchApp({ newInstance: false })
  })

  it('verify links in the get help section', async () => {
    if (device.getPlatform() === 'android') {
      await device.disableSynchronization()
      await element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).tap()
      await device.takeScreenshot('DisabilityRatingAndroidCallingScreen')
      await device.launchApp({ newInstance: false })
    }
    if (device.getPlatform() === 'android') {
      await element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).tap()
      await device.takeScreenshot('DisabilityRatingTTYAndroidCallingScreen')
      await device.launchApp({ newInstance: false })
      await device.enableSynchronization()
    }
  })
})
