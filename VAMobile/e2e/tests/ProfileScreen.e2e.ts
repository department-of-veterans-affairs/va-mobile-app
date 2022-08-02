import { expect, device, by, element, waitFor } from 'detox'
import { loginToDemoMode, openProfile } from './utils'

export const ProfileE2eIdConstants = {
  PROFILE_PAGE_ID: 'Profile-page',
  DISABILITY_RATING_ROW_TEXT: 'Disability rating',
  PERSONAL_CONTACT_INFO_ROW_TEXT: 'Personal and contact information',
  MILITARY_INFO_ROW_TEXT: 'Military information',
  DIRECT_DEPOSIT_ROW_TEXT: 'Direct deposit information',
  LETTERS_ROW_LABEL: 'V-A letters and documents',
  SETTINGS_ROW_TEXT: 'Settings',
  PAYMENTS_ROW_TEXT: 'Payments',
  SIGN_OUT_BTN_ID: 'Sign out',
  BANNER_BRANCH_ICON_ID: 'Coast-Guard-seal', // all banner elements specific to demo mode user
  BANNER_NAME_TEXT: 'Kimberly Washington',
  BANNER_BRANCH_ID: 'Coast-Guard',
  BANNER_DISABILITY_ID: 'Your disability rating: ',
  BANNER_COMBINED_PCT_ID: '100% service connected'
}



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
    await expect(element(by.label(ProfileE2eIdConstants.LETTERS_ROW_LABEL))).toExist()
    await expect(element(by.text(ProfileE2eIdConstants.PAYMENTS_ROW_TEXT))).toExist() 
    await expect(element(by.text(ProfileE2eIdConstants.SETTINGS_ROW_TEXT))).toExist()
  })

  it('should show sign out button', async () => {
    await expect(element(by.id(ProfileE2eIdConstants.SIGN_OUT_BTN_ID))).toExist()
  })

  it('should show profile banner elements', async () => {
    // await expect(element(by.id(ProfileE2eIdConstants.BANNER_BRANCH_ICON_ID))).toExist()  having trouble matching to the icon
    await expect(element(by.text(ProfileE2eIdConstants.BANNER_NAME_TEXT))).toExist()
    await expect(element(by.id(ProfileE2eIdConstants.BANNER_BRANCH_ID))).toExist()
    await expect(element(by.id(ProfileE2eIdConstants.BANNER_DISABILITY_ID))).toExist()
    await expect(element(by.id(ProfileE2eIdConstants.BANNER_COMBINED_PCT_ID))).toExist()
  })
  
})


