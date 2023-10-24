import { expect, device, by, element, waitFor } from 'detox'
import { CommonE2eIdConstants, loginToDemoMode, openProfile } from './utils'

export const ProfileE2eIdConstants = {
  PROFILE_TEXT: 'Profile',
  DISABILITY_RATING_ROW_TEXT: 'Disability rating',
  PERSONAL_INFO_ROW_TEXT: 'Personal information',
  CONTACT_INFO_ROW_TEXT: 'Contact information',
  MILITARY_INFO_ROW_TEXT: 'Military information',
  BANNER_NAME_ID: 'Kimberly Washington',
  BANNER_BRANCH_ID: 'United States Coast Guard',
}



beforeAll(async () => {
  await loginToDemoMode()
  await openProfile()
})

describe('Profile Screen', () => {
  it('should show profile list content', async () => {
    await waitFor(element(by.text(ProfileE2eIdConstants.PROFILE_TEXT)))
      .toExist()
      .withTimeout(6000)

    await expect(element(by.text(ProfileE2eIdConstants.PERSONAL_INFO_ROW_TEXT))).toExist()
    await expect(element(by.text(ProfileE2eIdConstants.MILITARY_INFO_ROW_TEXT))).toExist() 
    await expect(element(by.text(ProfileE2eIdConstants.CONTACT_INFO_ROW_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.SETTINGS_ROW_TEXT))).toExist()
  })

  it('should show profile banner elements', async () => {
    await expect(element(by.text(ProfileE2eIdConstants.BANNER_NAME_ID))).toExist()
    await expect(element(by.text(ProfileE2eIdConstants.BANNER_BRANCH_ID))).toExist()
  })
  
})


