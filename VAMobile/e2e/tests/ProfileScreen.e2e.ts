/*
Description:
Detox script that follows the profile page test case found in testRail (VA Mobile App > RC Regression Test > Manual > Profile Page - Elements)
When to update:
This script should be updated whenever new menu options are added/changed in the profile page.
*/
import { by, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openProfile } from './utils'

export const ProfileE2eIdConstants = {
  PROFILE_TEXT: 'Profile',
  BANNER_NAME_ID: 'Kimberly Washington',
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

    await expect(element(by.id(CommonE2eIdConstants.PERSONAL_INFO_BUTTON_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.MILITARY_HISTORY_BUTTON_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CONTACT_INFO_BUTTON_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.SETTINGS_BUTTON_ID))).toExist()
  })

  it('should show profile banner elements', async () => {
    await expect(element(by.text(ProfileE2eIdConstants.BANNER_NAME_ID))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.MILITARY_BRANCH_COAST_GUARD))).toExist()
  })
})
