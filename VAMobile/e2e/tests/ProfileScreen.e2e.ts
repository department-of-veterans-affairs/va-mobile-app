import { expect, device, by, element, waitFor } from 'detox'
import { loginToDemoMode, openProfile } from './utils'
import { HomeE2eIdConstants } from './HomeScreen.e2e'

export const ProfileE2eIdConstants = {
  PROFILE_PAGE_ID: 'Profile-page',
  DISABILITY_RATING_ROW_TEXT: 'Disability rating',
  PERSONAL_CONTACT_INFO_ROW_TEXT: 'Personal and contact information',
  MILITARY_INFO_ROW_TEXT: 'Military Information',
  DIRECT_DEPOSIT_ROW_TEXT: 'Direct Deposit',
  LETTERS_ROW_LABEL: 'V-A letters and documents',
  SETTINGS_ROW_TEXT: 'Settings'


  // sign out button
  // Profile banner
}

/** Sadly, all of this is busted because of tab navigation 

beforeAll(async () => {
  await loginToDemoMode()
  await openProfile()
})

describe('Profile Screen', () => {
  it('should show profile list content', async () => {
    await waitFor(element(by.id(ProfileE2eIdConstants.PROFILE_PAGE_ID)))
      .toExist()
      .withTimeout(2000)

    await expect(element(by.text(ProfileE2eIdConstants.DISABILITY_RATING_ROW_TEXT))).toExist()
    await expect(element(by.text(ProfileE2eIdConstants.PERSONAL_CONTACT_INFO_ROW_TEXT))).toExist()
    await expect(element(by.text(ProfileE2eIdConstants.MILITARY_INFO_ROW_TEXT))).toExist()
    await expect(element(by.text(ProfileE2eIdConstants.DIRECT_DEPOSIT_ROW_TEXT))).toExist()
    await expect(element(by.text(ProfileE2eIdConstants.LETTERS_ROW_LABEL))).toExist()
    await expect(element(by.text(HomeE2eIdConstants.PAYMENTS_BTN_ID))).toExist() // homescreen button and profile row text use the same string
    await expect(element(by.text(ProfileE2eIdConstants.SETTINGS_ROW_TEXT))).toExist()
  })

  // Haven't mapped out the profile banner elements yet
  it('should show profile banner elements', async () => {

    await expect(element(by.id(ProfileE2eIdConstants.HOME_HEADER_ID))).toExist()

  })
})


*/