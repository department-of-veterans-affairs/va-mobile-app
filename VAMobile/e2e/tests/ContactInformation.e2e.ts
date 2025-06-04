import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import { CommonE2eIdConstants, loginToDemoMode, openContactInfo, openProfile, toggleRemoteConfigFlag } from './utils'

export async function updateAddress() {
  await waitFor(element(by.id(CommonE2eIdConstants.COUNTRY_PICKER_ID)))
    .toBeVisible()
    .withTimeout(4000)
  await element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).typeText('3101 N Fort Valley Rd')
  await element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).tapReturnKey()
  await waitFor(element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)))
    .toBeVisible()
    .withTimeout(4000)
  await waitFor(element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.EDIT_ADDRESS_ID))
    .scroll(100, 'down', NaN, 0.8)
  await element(by.id(CommonE2eIdConstants.CITY_TEST_ID)).replaceText('Flagstaff')
  await element(by.id(CommonE2eIdConstants.CITY_TEST_ID)).tapReturnKey()
  await element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)).replaceText('86001')
  await element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)).tapReturnKey()
  await waitFor(element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)))
    .toBeVisible()
    .withTimeout(4000)
}

export async function fillHomeAddressFields() {
  await element(by.id(CommonE2eIdConstants.COUNTRY_PICKER_ID)).tap()
  await expect(element(by.text('United States'))).toExist()
  await element(by.text('United States')).tap()
  await element(by.id(CommonE2eIdConstants.COUNTRY_PICKER_CONFIRM_ID)).tap()
  await element(by.id(CommonE2eIdConstants.CITY_TEST_ID)).replaceText('Flagstaff')
  await element(by.id(CommonE2eIdConstants.CITY_TEST_ID)).tapReturnKey()
  await waitFor(element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)))
    .toBeVisible()
    .whileElement(by.id(CommonE2eIdConstants.EDIT_ADDRESS_ID))
    .scroll(100, 'down', NaN, 0.8)
  await element(by.id(CommonE2eIdConstants.STATE_ID)).tap()
  await element(by.text('Arizona')).tap()
  await element(by.id(CommonE2eIdConstants.STATE_PICKER_CONFIRM_ID)).tap()
  await element(by.id(CommonE2eIdConstants.CITY_TEST_ID)).clearText()
  await element(by.id(CommonE2eIdConstants.EDIT_ADDRESS_ID)).scrollTo('top')
}

export async function validateAddresses(addressID: string, addressType: string) {
  it('update the ' + addressType + ' address', async () => {
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SCREEN_ID)).scrollTo('top')
    await waitFor(element(by.id(addressID)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.CONTACT_INFO_SCREEN_ID))
      .scroll(50, 'down')
    await element(by.id(addressID)).tap()
  })

  it('should update the ' + addressType + ' address', async () => {
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_STREET_ADDRESS_LINE_2_ID)).replaceText('2')
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_STREET_ADDRESS_LINE_2_ID)).tapReturnKey()
    if (addressType === 'Home') {
      await fillHomeAddressFields()
    }
    await updateAddress()
  })

  it(addressType + ': verify action sheet for cancel', async () => {
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_BACK_ID)).tap()
    await setTimeout(2000)
    await expect(element(by.text('Delete changes to your ' + addressType.toLowerCase() + ' address?'))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.CANCEL_DELETE_CHANGES_BUTTON_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.CANCEL_KEEP_EDITING_TEXT))).toExist()
  })

  it(addressType + ': verify fields are filled on keep editing', async () => {
    await element(by.text(CommonE2eIdConstants.CANCEL_KEEP_EDITING_TEXT)).tap()
    await expect(element(by.text('United States'))).toExist()
    await expect(element(by.text('3101 N Fort Valley Rd')).atIndex(0)).toExist()
    await expect(element(by.text('2'))).toExist()
    await expect(element(by.text('Flagstaff'))).toExist()
    await expect(element(by.text('Arizona'))).toExist()
    await expect(element(by.text('86001'))).toExist()
  })

  it(addressType + ': verify contact info screen is displayed on delete', async () => {
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_BACK_ID)).tap()
    await element(by.text(CommonE2eIdConstants.CANCEL_DELETE_CHANGES_BUTTON_TEXT)).tap()
    await expect(element(by.id(addressID))).toExist()
  })

  it('should open and update the ' + addressType + ' address', async () => {
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SCREEN_ID)).scrollTo('top')
    await waitFor(element(by.id(addressID)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.CONTACT_INFO_SCREEN_ID))
      .scroll(100, 'down')
    await element(by.id(addressID)).tap()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_STREET_ADDRESS_LINE_2_ID)).typeText('2')
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_STREET_ADDRESS_LINE_2_ID)).tapReturnKey()
    await waitFor(element(by.id(CommonE2eIdConstants.CONTACT_INFO_STREET_ADDRESS_LINE_2_ID)))
      .toBeVisible()
      .withTimeout(4000)
    if (addressType === 'Home') {
      await fillHomeAddressFields()
      await updateAddress()
    }
  })

  it(addressType + ': verify your address screen is displayed on save', async () => {
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)).tap()
    await expect(element(by.id(CommonE2eIdConstants.VERIFY_YOUR_ADDRESS_ID))).toExist()
    await element(by.id(CommonE2eIdConstants.VERIFY_YOUR_ADDRESS_ID)).tap()
    await expect(element(by.text("We can't confirm the address you entered with the U.S. Postal Service."))).toExist()
    await element(by.text('Verify your address')).tap()
  })

  it('should tap on edit address and return to the ' + addressType + ' address screen', async () => {
    await element(by.id('Edit address')).tap()
    await expect(element(by.text('United States'))).toExist()
    await expect(element(by.text('3101 N Fort Valley Rd')).atIndex(0)).toExist()
    await expect(element(by.text('2'))).toExist()
    await expect(element(by.text('Flagstaff'))).toExist()
    await expect(element(by.text('Arizona'))).toExist()
    await expect(element(by.text('86001'))).toExist()
  })

  it(addressType + ': verify your address screen is displayed on save 2', async () => {
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)).tap()
    await expect(element(by.id(CommonE2eIdConstants.VERIFY_YOUR_ADDRESS_ID))).toExist()
  })

  it(addressType + ': verify contact info is displayed when saved', async () => {
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SUGGESTED_ADDRESS_ID)).tap()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_USE_THIS_ADDRESS_ID)).tap()
    try {
      await setTimeout(5000)
      await expect(element(by.text(addressType + ' address saved'))).toExist()
      await element(by.text(CommonE2eIdConstants.DISMISS_TEXT)).tap()
    } catch (ex) {}
  })

  it('verify that the ' + addressType + ' address has been updated', async () => {
    await expect(element(by.id(addressType + ' address 3101 N Fort Valley Rd, 2 Flagstaff, AZ, 86001'))).toExist()
  })
}

export async function validatePhoneNumbers(phoneID: string, phoneType: string) {
  it('should open the ' + phoneType + ' phone number', async () => {
    await waitFor(element(by.id(phoneID)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.CONTACT_INFO_SCREEN_ID))
      .scroll(100, 'down')
    await element(by.id(phoneID)).tap()
  })

  it(phoneType + ': verify error handling', async () => {
    await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_ID)).clearText()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)).tap()
    await expect(element(by.text('Check your phone number'))).toExist()
  })

  it('should update the ' + phoneType + ' phone with an extension', async () => {
    if (phoneType === 'Work') {
      await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_ID)).typeText('276-608-6180')
      await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_ID)).tapReturnKey()
      await waitFor(element(by.id(CommonE2eIdConstants.PHONE_NUMBER_ID)))
        .toBeVisible()
        .withTimeout(4000)
    } else {
      await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_ID)).clearText()
      await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_ID)).typeText('276-608-6180')
      await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_ID)).tapReturnKey()
      await waitFor(element(by.id(CommonE2eIdConstants.PHONE_NUMBER_ID)))
        .toBeVisible()
        .withTimeout(4000)
    }
    await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).typeText('1234')
    await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).tapReturnKey()
    await waitFor(element(by.id(CommonE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)))
      .toBeVisible()
      .withTimeout(4000)
  })

  it(phoneType + ': verify action sheet for cancel', async () => {
    await waitFor(element(by.id(CommonE2eIdConstants.CONTACT_INFO_BACK_ID)))
      .toBeVisible()
      .withTimeout(4000)
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_BACK_ID)).tap()
    await setTimeout(2000)
    await expect(element(by.text('Delete changes to your ' + phoneType.toLowerCase() + ' phone number?'))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.CANCEL_DELETE_CHANGES_BUTTON_TEXT))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.CANCEL_KEEP_EDITING_TEXT))).toExist()
  })

  it(phoneType + ': verify fields are filled on keep editing', async () => {
    await element(by.text(CommonE2eIdConstants.CANCEL_KEEP_EDITING_TEXT)).tap()
    await expect(element(by.text('276-608-6180')).atIndex(0)).toExist()
    await expect(element(by.text('1234'))).toExist()
  })

  it(phoneType + ': verify contact info screen is displayed on delete', async () => {
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_BACK_ID)).tap()
    await setTimeout(2000)
    await element(by.text(CommonE2eIdConstants.CANCEL_DELETE_CHANGES_BUTTON_TEXT)).tap()
    await expect(element(by.id(phoneID))).toExist()
  })

  it('should update the ' + phoneType + ' with an extension', async () => {
    await waitFor(element(by.id(phoneID)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.CONTACT_INFO_SCREEN_ID))
      .scroll(100, 'down')
    await element(by.id(phoneID)).tap()
    if (phoneType === 'Work') {
      await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_ID)).typeText('276-608-6180')
      await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_ID)).tapReturnKey()
      await waitFor(element(by.id(CommonE2eIdConstants.PHONE_NUMBER_ID)))
        .toBeVisible()
        .withTimeout(4000)
    } else {
      await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_ID)).clearText()
      await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_ID)).typeText('276-608-6180')
      await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_ID)).tapReturnKey()
      await waitFor(element(by.id(CommonE2eIdConstants.PHONE_NUMBER_ID)))
        .toBeVisible()
        .withTimeout(4000)
    }
    await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).typeText('1234')
    await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).tapReturnKey()
    await waitFor(element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)))
      .toBeVisible()
      .withTimeout(4000)
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)).tap()
    try {
      await setTimeout(2000)
      await expect(element(by.text(phoneType + ' phone saved'))).toExist()
      await waitFor(element(by.text(CommonE2eIdConstants.DISMISS_TEXT)))
        .toBeVisible()
        .withTimeout(4000)
      await element(by.text(CommonE2eIdConstants.DISMISS_TEXT)).tap()
    } catch (ex) {}
  })

  it(phoneType + ': verify user can remove the extension', async () => {
    await waitFor(element(by.id(phoneID)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.CONTACT_INFO_SCREEN_ID))
      .scroll(100, 'down')
    await element(by.id(phoneID)).tap()
    await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).clearText()
    await element(by.id(CommonE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).tapReturnKey()
    await waitFor(element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)))
      .toBeVisible()
      .withTimeout(4000)
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)).tap()
    try {
      await setTimeout(2000)
      await expect(element(by.text(phoneType + ' phone saved'))).toExist()
      await waitFor(element(by.text(CommonE2eIdConstants.DISMISS_TEXT)))
        .toBeVisible()
        .withTimeout(4000)
      await element(by.text(CommonE2eIdConstants.DISMISS_TEXT)).tap()
    } catch (ex) {}
  })
}

export async function removeContactInfoFeature(contactInfoTypeText: string, type: string) {
  it('should tap remove ' + type + ' and verify remove pop up appears', async () => {
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SCREEN_ID)).scrollTo('top')
    await waitFor(element(by.id(contactInfoTypeText)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.CONTACT_INFO_SCREEN_ID))
      .scroll(100, 'down')
    await element(by.id(contactInfoTypeText)).tap()
    await element(by.text('Remove ' + type)).tap()
    await setTimeout(2000)
    await expect(element(by.text('Remove your ' + type + '?'))).toExist()
    await expect(
      element(
        by.text("We'll remove your " + type + ' from many VA records. You can always add it to your profile again.'),
      ),
    ).toExist()
  })

  it('should tap keep and verify the ' + type + ' information appears', async () => {
    await element(by.text(CommonE2eIdConstants.REMOVE_KEEP_TEXT)).tap()
    if (type === 'mobile phone' || type === 'work phone' || type === 'home phone') {
      await expect(element(by.text('276-608-6180')).atIndex(1)).toExist()
    } else if (type === 'home address') {
      await expect(element(by.text('3101 N Fort Valley Rd'))).toExist()
    } else if (type === 'email address') {
      await expect(element(by.text('attended1@gmail.com')).atIndex(1)).toExist()
    }
  })

  it('should remove the ' + type + ' and verify it has been removed', async () => {
    await element(by.text('Remove ' + type)).tap()
    await setTimeout(2000)
    await element(by.text(CommonE2eIdConstants.REMOVE_REMOVE_TEXT)).tap()
    try {
      await waitFor(element(by.text(CommonE2eIdConstants.DISMISS_TEXT)))
        .toBeVisible()
        .withTimeout(4000)
      await element(by.text(CommonE2eIdConstants.DISMISS_TEXT)).tap()
    } catch (ex) {}
    if (type === 'home phone' || type === 'work phone') {
      await expect(element(by.text('Add your ' + type + ' number'))).toExist()
    } else if (type === 'mobile phone') {
      await expect(element(by.text('Add your cell phone number'))).toExist()
    } else {
      await expect(element(by.text('Add your ' + type))).toExist()
    }
  })
}

export async function verifyNonUSorMilitaryAddresses(addressID: string, addressType: string) {
  it(addressType + ': should verify non-US address', async () => {
    await element(by.id(addressID)).tap()
    await element(by.id(CommonE2eIdConstants.COUNTRY_PICKER_ID)).tap()
    await element(by.text('Andorra')).tap()
    await element(by.id(CommonE2eIdConstants.COUNTRY_PICKER_CONFIRM_ID)).tap()
    await expect(element(by.text('State (Required)'))).not.toExist()
    await expect(element(by.text('International post code (Required)'))).toExist()
    await element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).typeText('19-21 Carrer de na Maria Pla')
    await element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).tapReturnKey()
    await waitFor(element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.EDIT_ADDRESS_ID))
      .scroll(100, 'down', NaN, 0.8)
    await element(by.id(CommonE2eIdConstants.CITY_TEST_ID)).typeText('Andorra la Vella')
    await element(by.id(CommonE2eIdConstants.CITY_TEST_ID)).tapReturnKey()
    await element(by.id(CommonE2eIdConstants.STATE_ID)).typeText('Andorra la Vella')
    await element(by.id(CommonE2eIdConstants.STATE_ID)).tapReturnKey()
    await element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)).typeText('AD500')
    await element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)).tapReturnKey()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)).tap()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SUGGESTED_ADDRESS_ID)).tap()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_USE_THIS_ADDRESS_ID)).tap()
    await setTimeout(2000)
    await expect(
      element(
        by.id(addressType + ' address 19-21 Carrer de na Maria Pla Andorra la Vella, Andorra la Vella, AD500 Andorra'),
      ),
    ).toExist()
  })

  it(addressType + ': should verify a military base address', async () => {
    await element(
      by.id(addressType + ' address 19-21 Carrer de na Maria Pla Andorra la Vella, Andorra la Vella, AD500 Andorra'),
    ).tap()
    await element(by.id('USMilitaryBaseCheckboxTestID')).tap()
    await expect(element(by.id(CommonE2eIdConstants.CITY_TEST_ID))).not.toExist()
    await element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).typeText('123 Main St')
    await element(by.id(CommonE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).tapReturnKey()
    await waitFor(element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.EDIT_ADDRESS_ID))
      .scroll(100, 'down', NaN, 0.8)
    await element(by.id(CommonE2eIdConstants.MILITARY_POST_OFFICE_ID)).tap()
    await element(by.text('FPO')).tap()
    await element(by.id(CommonE2eIdConstants.MILITARY_POST_OFFICE_PICKER_CONFIRM_ID)).tap()
    await element(by.id(CommonE2eIdConstants.STATE_ID)).tap()
    await element(by.text('Armed Forces Pacific (AP)')).tap()
    await element(by.id(CommonE2eIdConstants.STATE_PICKER_CONFIRM_ID)).tap()
    await element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)).typeText('12345')
    await element(by.id(CommonE2eIdConstants.ZIP_CODE_ID)).tapReturnKey()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)).tap()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SUGGESTED_ADDRESS_ID)).tap()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_USE_THIS_ADDRESS_ID)).tap()
    await setTimeout(2000)
    await expect(element(by.id(addressType + ' address 123 Main St FPO, Armed Forces Pacific (AP) 12345'))).toExist()
  })
}

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  await openProfile()
  await openContactInfo()
})

describe(':ios: Contact Info Screen', () => {
  it('should match the Contact Info page design', async () => {
    await expect(element(by.id(CommonE2eIdConstants.MAILING_ADDRESS_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.HOME_ADDRESS_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.HOME_PHONE_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.WORK_PHONE_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.MOBILE_PHONE_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.EMAIL_ADDRESS_ID))).toExist()
    await expect(element(by.text(CommonE2eIdConstants.HOW_WE_USE_TEXT))).toExist()
  })

  it('verify how we use your contact information link', async () => {
    await expect(element(by.id(CommonE2eIdConstants.HOW_WE_USE_CONTACT_INFO_LINK_ID))).toExist()
    await element(by.id(CommonE2eIdConstants.HOW_WE_USE_CONTACT_INFO_LINK_ID)).tap()
    await expect(element(by.text(CommonE2eIdConstants.HOW_WE_USE_TEXT)).atIndex(0)).toExist()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_CLOSE_ID)).atIndex(0).tap()
  })

  validateAddresses(CommonE2eIdConstants.MAILING_ADDRESS_ID, 'Mailing')
  validateAddresses(CommonE2eIdConstants.HOME_ADDRESS_ID, 'Home')
  removeContactInfoFeature('Home address 3101 N Fort Valley Rd, 2 Flagstaff, AZ, 86001', 'home address')
  validatePhoneNumbers(CommonE2eIdConstants.HOME_PHONE_ID, 'Home')
  removeContactInfoFeature(CommonE2eIdConstants.HOME_PHONE_ID, 'home phone')
  validatePhoneNumbers(CommonE2eIdConstants.WORK_PHONE_ID, 'Work')
  removeContactInfoFeature(CommonE2eIdConstants.WORK_PHONE_ID, 'work phone')
  validatePhoneNumbers(CommonE2eIdConstants.MOBILE_PHONE_ID, 'Mobile')
  removeContactInfoFeature(CommonE2eIdConstants.MOBILE_PHONE_ID, 'mobile phone')

  it('should open the email address', async () => {
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SCREEN_ID)).scrollTo('bottom')
    await element(by.id(CommonE2eIdConstants.EMAIL_ADDRESS_ID)).tap()
  })

  it('email address: verify error handling', async () => {
    await element(by.id(CommonE2eIdConstants.EMAIL_ADDRESS_EDIT_ID)).clearText()
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)).tap()
    await expect(element(by.text('Check your email address'))).toExist()
  })

  it('should update the email address with a +', async () => {
    await element(by.id(CommonE2eIdConstants.EMAIL_ADDRESS_EDIT_ID)).clearText()
    await element(by.id(CommonE2eIdConstants.EMAIL_ADDRESS_EDIT_ID)).typeText('attended1+@gmail.com')
    await element(by.id(CommonE2eIdConstants.EMAIL_ADDRESS_EDIT_ID)).tapReturnKey()
    await waitFor(element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)))
      .toBeVisible()
      .withTimeout(4000)
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)).tap()
    try {
      await setTimeout(5000)
      await expect(element(by.text('Email address saved'))).toExist()
      await element(by.text(CommonE2eIdConstants.DISMISS_TEXT)).tap()
    } catch (ex) {}
  })

  it('should update the email address and remove the +', async () => {
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SCREEN_ID)).scrollTo('bottom')
    await element(by.id(CommonE2eIdConstants.EMAIL_ADDRESS_ID)).tap()
    await element(by.id(CommonE2eIdConstants.EMAIL_ADDRESS_EDIT_ID)).clearText()
    await element(by.id(CommonE2eIdConstants.EMAIL_ADDRESS_EDIT_ID)).typeText('attended1@gmail.com')
    await element(by.id(CommonE2eIdConstants.EMAIL_ADDRESS_EDIT_ID)).tapReturnKey()
    await waitFor(element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)))
      .toBeVisible()
      .withTimeout(4000)
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SAVE_ID)).tap()
    try {
      await setTimeout(5000)
      await expect(element(by.text('Email address saved'))).toExist()
      await element(by.text(CommonE2eIdConstants.DISMISS_TEXT)).tap()
    } catch (ex) {}
    await element(by.id(CommonE2eIdConstants.CONTACT_INFO_SCREEN_ID)).scrollTo('top')
  })

  removeContactInfoFeature(CommonE2eIdConstants.EMAIL_ADDRESS_ID, 'email address')

  verifyNonUSorMilitaryAddresses(CommonE2eIdConstants.HOME_ADDRESS_ID, 'Home')
  verifyNonUSorMilitaryAddresses(CommonE2eIdConstants.MAILING_ADDRESS_2_ID, 'Mailing')
})
