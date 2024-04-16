import { by, device, element, expect } from 'detox'
import { setTimeout } from 'timers/promises'

import { loginToDemoMode, openBenefits, openDisabilityRating } from './utils'

export const DisabilityRatingsIdConstants = {
  COMBINED_DISABILITY_RATING_TEXT: 'Combined disability rating',
  COMBINED_DISABILITY_RATING_BODY_TEXT:
    "This rating doesn't include any disabilities for your claims that are still in process. You can check the status of your disability claims or appeals with the Claim Status tool.",
  INDIVIDUAL_RATING_TEXT: 'Individual ratings',
  INDIVIDUAL_RATING_1_ID:
    '20% Dr Diagnosis (claimed as Heart disease Service-connected disability?  Yes Effective date:  06/06/2017',
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
    await expect(element(by.id(DisabilityRatingsIdConstants.ABOUT_DISABILITY_RATINGS_LINK_ID))).toExist()
    await expect(element(by.text('Learn about VA disability ratings'))).toExist()
    await expect(element(by.text('Need Help?'))).toExist()
  })

  it('verify About VA disability ratings information', async () => {
    await element(by.id(DisabilityRatingsIdConstants.DISABILITY_RATING_PAGE_ID)).scrollTo('bottom')
    await element(by.id(DisabilityRatingsIdConstants.ABOUT_DISABILITY_RATINGS_LINK_ID)).tap()
    await element(by.text('Leave')).tap()
    await setTimeout(5000)
    await device.takeScreenshot('AboutDisabilityRatings')
    await device.launchApp({ newInstance: false })
  })

  it('verify links in the get help section', async () => {
    if (device.getPlatform() === 'android') {
      await element(by.text('800-827-1000')).tap()
      await device.takeScreenshot('DisabilityRatingAndroidCallingScreen')
      await device.launchApp({ newInstance: false })
    }
    if (device.getPlatform() === 'android') {
      await element(by.text('TTY: 711')).tap()
      await device.takeScreenshot('DisabilityRatingTTYAndroidCallingScreen')
      await device.launchApp({ newInstance: false })
    }
  })
})
