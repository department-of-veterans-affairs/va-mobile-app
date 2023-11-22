import { expect, device, by, element, waitFor } from 'detox'
import { loginToDemoMode, openContactInfo, openProfile } from './utils'

export const ContactInfoE2eIdConstants = {
  CONTACT_INFO_PAGE_ID: 'ContactInfoTestID',
  MAILING_ADDRESS_ID: 'Mailing address 3101 N Fort Valley Rd Flagstaff, AZ, 86001',
  HOME_ADDRESS_ID: 'Home address Add your home address',
  HOME_PHONE_ID: 'homePhoneTestID',
  WORK_PHONE_ID: 'workPhoneTestID',
  MOBILE_PHONE_ID: 'mobilePhoneTestID',
  EMAIL_ADDRESS_ID: 'emailAddressTestID',
  HOW_WE_USE_TEXT: 'How we use your contact information',
  COUNTRY_PICKER_ID: 'countryPickerTestID',
  STREET_ADDRESS_LINE_1_ID: 'streetAddressLine1TestID',
  STREET_ADDRESS_LINE_2_ID: 'streetAddressLine2TestID',
  STREET_ADDRESS_LINE_3_ID: 'streetAddressLine3TestID',
  MILITARY_POST_OFFICE_ID: 'militaryPostOfficeTestID',
  CITY_TEST_ID: 'cityTestID',
  STATE_ID: 'stateTestID',
  ZIP_CODE_ID: 'zipCodeTestID',
  PHONE_NUMBER_EXTENSION_ID: 'phoneNumberExtensionTestID',
  PHONE_NUMBER_ID: 'phoneNumberTestID',
  CANCEL_DELETE_TEXT: device.getPlatform() === 'ios' ? 'Delete Changes' : 'Delete Changes ',
  CANCEL_KEEP_EDITING_TEXT: device.getPlatform() === 'ios' ? 'Keep Editing' : 'Keep Editing ',
  REMOVE_KEEP_TEXT: 'Keep',
  REMOVE_REMOVE_TEXT: 'Remove',
  SAVE_TEXT: 'Save',
  DISMISS_TEXT: 'Dismiss'
}

export async function updateAddress() {
  await waitFor(element(by.id(ContactInfoE2eIdConstants.COUNTRY_PICKER_ID))).toBeVisible().withTimeout(4000)
  await element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).typeText('3101 N Fort Valley Rd')
  await element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).tapReturnKey()
  await waitFor(element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_1_ID))).toBeVisible().withTimeout(4000)
  await waitFor(element(by.id(ContactInfoE2eIdConstants.ZIP_CODE_ID))).toBeVisible().whileElement(by.id('EditAddressTestID')).scroll(100, 'down', NaN, 0.8)
  await element(by.id(ContactInfoE2eIdConstants.CITY_TEST_ID)).typeText('Flagstaff')
  await element(by.id(ContactInfoE2eIdConstants.CITY_TEST_ID)).tapReturnKey()
  await element(by.id(ContactInfoE2eIdConstants.ZIP_CODE_ID)).typeText('86001')
  await element(by.id(ContactInfoE2eIdConstants.ZIP_CODE_ID)).tapReturnKey()
  await waitFor(element(by.id(ContactInfoE2eIdConstants.ZIP_CODE_ID))).toBeVisible().withTimeout(4000)
}

export async function validateAddresses(addressID, addressType) {
  it('update the ' + addressType + ' address', async () => {
    await element(by.id(ContactInfoE2eIdConstants.CONTACT_INFO_PAGE_ID)).scrollTo('top')
    await waitFor(element(by.id(addressID))).toBeVisible().whileElement(by.id(ContactInfoE2eIdConstants.CONTACT_INFO_PAGE_ID)).scroll(50, 'down')
    await element(by.id(addressID)).tap()
  })

  it(addressType + ': verify error handling', async() => {
    await element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).clearText()
    await waitFor(element(by.id(ContactInfoE2eIdConstants.ZIP_CODE_ID))).toBeVisible().whileElement(by.id('EditAddressTestID')).scroll(100, 'down', NaN, 0.8)
    await element(by.id(ContactInfoE2eIdConstants.CITY_TEST_ID)).clearText()
    await element(by.id(ContactInfoE2eIdConstants.ZIP_CODE_ID)).clearText()
    await element(by.text(ContactInfoE2eIdConstants.SAVE_TEXT)).tap()
    await expect(element(by.text('Please check your mailing address'))).toExist()
    await expect(element(by.text('Street address is required'))).toExist()
    await expect(element(by.text('City is required'))).toExist()
    if(addressType == 'Home') {
      await expect(element(by.text('Country is required'))).toExist()
      await expect(element(by.text('State is required'))).toExist()
    }
  })

  it('should update the ' + addressType + ' address', async () => {
    await element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_2_ID)).typeText('2')
    await element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_2_ID)).tapReturnKey()
    //await waitFor(element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_2_ID))).toBeVisible().withTimeout(4000)
    if(addressType === 'Home') {
      await element(by.id('countryPickerTestID picker required Error - Country is required')).tap()
      await expect(element(by.text('United States'))).toExist()
      await element(by.text('United States')).tap()
      await element(by.text('Done')).tap()
      await waitFor(element(by.id(ContactInfoE2eIdConstants.ZIP_CODE_ID))).toBeVisible().whileElement(by.id('EditAddressTestID')).scroll(100, 'down', NaN, 0.8)
      await element(by.id('stateTestID picker required Error - State is required')).tap()
      await element(by.text('Arizona')).tap()
      await element(by.text('Done')).tap()
      await element(by.id('EditAddressTestID')).scrollTo('top')
    }
    await updateAddress()
  })

  it(addressType + ': verify action sheet for cancel', async () => {
    await element(by.text('Cancel')).tap()
    await expect(element(by.text('Delete changes to your ' + addressType.toLowerCase() + ' address?'))).toExist()
    await expect(element(by.text(ContactInfoE2eIdConstants.CANCEL_DELETE_TEXT))).toExist()
    await expect(element(by.text(ContactInfoE2eIdConstants.CANCEL_KEEP_EDITING_TEXT))).toExist()
  })

  it(addressType + ': verify fields are filled on keep editing', async () => {
    await element(by.text(ContactInfoE2eIdConstants.CANCEL_KEEP_EDITING_TEXT)).tap()
    await expect(element(by.text('United States'))).toExist()
    await expect(element(by.text('3101 N Fort Valley Rd')).atIndex(0)).toExist()
    await expect(element(by.text('2'))).toExist()
    await expect(element(by.text('Flagstaff'))).toExist()
    await expect(element(by.text('Arizona'))).toExist()
    await expect(element(by.text('86001'))).toExist()
  })

  it(addressType + ': verify contact info screen is displayed on delete', async () => {
    await element(by.text('Cancel')).tap()
    await element(by.text(ContactInfoE2eIdConstants.CANCEL_DELETE_TEXT)).tap()
    await expect(element(by.id(addressID))).toExist()
  })

  it('should open and update the ' + addressType + ' address', async () => {
    await element(by.id(ContactInfoE2eIdConstants.CONTACT_INFO_PAGE_ID)).scrollTo('top')
    await waitFor(element(by.id(addressID))).toBeVisible().whileElement(by.id(ContactInfoE2eIdConstants.CONTACT_INFO_PAGE_ID)).scroll(100, 'down')
    await element(by.id(addressID)).tap()
    await element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_2_ID)).typeText('2')
    await element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_2_ID)).tapReturnKey()
    await waitFor(element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_2_ID))).toBeVisible().withTimeout(4000)
    if(addressType === 'Home') {
      await element(by.id(ContactInfoE2eIdConstants.COUNTRY_PICKER_ID)).tap()
      await expect(element(by.text('United States'))).toExist()
      await element(by.text('United States')).tap()
      await element(by.text('Done')).tap()
      await waitFor(element(by.id(ContactInfoE2eIdConstants.ZIP_CODE_ID))).toBeVisible().whileElement(by.id('EditAddressTestID')).scroll(100, 'down', NaN, 0.8)
      await element(by.id(ContactInfoE2eIdConstants.STATE_ID)).tap()
      await element(by.text('Arizona')).tap()
      await element(by.text('Done')).tap()
      await element(by.id('EditAddressTestID')).scrollTo('top')
      await updateAddress()
    }
  })

  it(addressType + ': verify your address screen is displayed on save', async () => {
    await element(by.text(ContactInfoE2eIdConstants.SAVE_TEXT)).tap()
    await expect(element(by.id('verifyYourAddressTestID'))).toExist()
    await element(by.id('verifyYourAddressTestID')).tap()
    await expect(element(by.text('We can\'t confirm the address you entered with the U.S. Postal Service.'))).toExist()
    await element(by.text('Verify your address')).tap()
  })

  it('should tap on edit address and return to the ' + addressType + ' address screen', async () => {
    await element(by.id('Edit this address.')).tap()
    await expect(element(by.text('United States'))).toExist()
    await expect(element(by.text('3101 N Fort Valley Rd')).atIndex(0)).toExist()
    await expect(element(by.text('2'))).toExist()
    await expect(element(by.text('Flagstaff'))).toExist()
    await expect(element(by.text('Arizona'))).toExist()
    await expect(element(by.text('86001'))).toExist()
  })

  it(addressType + ': verify your address screen is displayed on save 2', async () => {
    await element(by.text(ContactInfoE2eIdConstants.SAVE_TEXT)).tap()
    await expect(element(by.id('verifyYourAddressTestID'))).toExist()
  })

  it(addressType + ': verify contact info is displayed when saved', async () => {
    await element(by.id('suggestedAddressTestID')).tap()
    await element(by.id('Use this address')).tap()
    await expect(element(by.text(addressType + ' address saved'))).toExist()
    await element(by.text(ContactInfoE2eIdConstants.DISMISS_TEXT)).tap()
  })

  it('verify that the ' + addressType + ' address has been updated', async () => {
    await expect(element(by.id(addressType + ' address 3101 N Fort Valley Rd, 2 Flagstaff, AZ, 86001'))).toExist()
  })
}

export async function validatePhoneNumbers(phoneID, phoneType) {
  it ('should open the ' + phoneType + ' phone number', async () => {
    await waitFor(element(by.id(phoneID))).toBeVisible().whileElement(by.id(ContactInfoE2eIdConstants.CONTACT_INFO_PAGE_ID)).scroll(100, 'down')
    await element(by.id(phoneID)).tap()
  })

  it(phoneType + ': verify error handling', async() => {
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID)).clearText()
    await element(by.text(ContactInfoE2eIdConstants.SAVE_TEXT)).tap()
    await expect(element(by.text('Check your phone number'))).toExist()
  })

  it('should update the ' + phoneType + ' phone with an extension', async () => {
    if(phoneType === 'Work') {     
      await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID)).typeText('276-608-6180')
      await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID)).tapReturnKey()
      await waitFor(element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID))).toBeVisible().withTimeout(4000)
    } else {
      await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID)).clearText()
      await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID)).typeText('276-608-6180')
      await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID)).tapReturnKey()   
      await waitFor(element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID))).toBeVisible().withTimeout(4000)
    }
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).typeText('1234')
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).tapReturnKey()
    await waitFor(element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_EXTENSION_ID))).toBeVisible().withTimeout(4000)
  })

  it(phoneType + ': verify action sheet for cancel', async () => {
    await waitFor(element(by.text('Cancel'))).toBeVisible().withTimeout(4000)
    await element(by.text('Cancel')).tap()
    await expect(element(by.text('Delete changes to your ' + phoneType.toLowerCase() + ' phone number?'))).toExist()
    await expect(element(by.text(ContactInfoE2eIdConstants.CANCEL_DELETE_TEXT))).toExist()
    await expect(element(by.text(ContactInfoE2eIdConstants.CANCEL_KEEP_EDITING_TEXT))).toExist()
  })

  it(phoneType +  ': verify fields are filled on keep editing', async() => {
    await element(by.text(ContactInfoE2eIdConstants.CANCEL_KEEP_EDITING_TEXT)).tap()
    await expect(element(by.text('276-608-6180')).atIndex(0)).toExist()
    await expect(element(by.text('1234'))).toExist()    
  })

  it(phoneType + ': verify contact info screen is displayed on delete', async () => {
    await element(by.text('Cancel')).tap()
    await element(by.text(ContactInfoE2eIdConstants.CANCEL_DELETE_TEXT)).tap()
    await expect(element(by.id(phoneID))).toExist()
  })

  it('should update the ' + phoneType + ' with an extension', async () => {
    await waitFor(element(by.id(phoneID))).toBeVisible().whileElement(by.id(ContactInfoE2eIdConstants.CONTACT_INFO_PAGE_ID)).scroll(100, 'down')
    await element(by.id(phoneID)).tap()
    if(phoneType === 'Work') { 
      await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID)).typeText('276-608-6180')
      await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID)).tapReturnKey()
      await waitFor(element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID))).toBeVisible().withTimeout(4000)
    } else {
      await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID)).clearText()
      await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID)).typeText('276-608-6180')
      await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID)).tapReturnKey()   
      await waitFor(element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID))).toBeVisible().withTimeout(4000)
    }
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).typeText('1234')
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).tapReturnKey()
    await waitFor(element(by.text(ContactInfoE2eIdConstants.SAVE_TEXT))).toBeVisible().withTimeout(4000)
    await element(by.text(ContactInfoE2eIdConstants.SAVE_TEXT)).tap()
    await expect(element(by.text(phoneType + ' phone saved'))).toExist()
    await waitFor(element(by.text(ContactInfoE2eIdConstants.DISMISS_TEXT))).toBeVisible().withTimeout(4000)
    await element(by.text(ContactInfoE2eIdConstants.DISMISS_TEXT)).tap()
  })
  
  it(phoneType + ': verify user can remove the extension', async () => {
    await waitFor(element(by.id(phoneID))).toBeVisible().whileElement(by.id(ContactInfoE2eIdConstants.CONTACT_INFO_PAGE_ID)).scroll(100, 'down')
    await element(by.id(phoneID)).tap()
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).clearText()
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).tapReturnKey()
    await waitFor(element(by.text(ContactInfoE2eIdConstants.SAVE_TEXT))).toBeVisible().withTimeout(4000)
    await element(by.text(ContactInfoE2eIdConstants.SAVE_TEXT)).tap()
    await expect(element(by.text(phoneType + ' phone saved'))).toExist()
    await waitFor(element(by.text(ContactInfoE2eIdConstants.DISMISS_TEXT))).toBeVisible().withTimeout(4000)
    await element(by.text(ContactInfoE2eIdConstants.DISMISS_TEXT)).tap()
  })
}

export async function removeContactInfoFeature(contactInfoTypeText, type) {
  it ('should tap remove ' + type + ' and verify remove pop up appears', async () => {
    await element(by.id(ContactInfoE2eIdConstants.CONTACT_INFO_PAGE_ID)).scrollTo('top')
    await waitFor(element(by.id(contactInfoTypeText))).toBeVisible().whileElement(by.id(ContactInfoE2eIdConstants.CONTACT_INFO_PAGE_ID)).scroll(100, 'down')
    await element(by.id(contactInfoTypeText)).tap()
    await element(by.text('Remove ' + type)).tap()
    await expect(element(by.text('Remove your ' + type + '?'))).toExist()
    await expect(element(by.text('We\'ll remove your ' + type + ' from many VA records. You can always add it to your profile again.'))).toExist()
  })

  it('should tap keep and verify the ' + type + ' information appears', async () => {
    await element(by.text(ContactInfoE2eIdConstants.REMOVE_KEEP_TEXT)).tap()
    if(type === 'mobile phone' || type === 'work phone' || type == 'home phone'){
      await expect(element(by.text('276-608-6180')).atIndex(1)).toExist()
    } else if (type === 'home address') {
      await expect(element(by.text('3101 N Fort Valley Rd'))).toExist()
    } else if (type === 'email address') {
      await expect(element(by.text('attended1@gmail.com')).atIndex(1)).toExist()
    }
  })

  it('should remove the ' + type + ' and verify it has been removed', async () => {
    await element(by.text('Remove ' + type)).tap()
    await element(by.text(ContactInfoE2eIdConstants.REMOVE_REMOVE_TEXT)).tap()
    await waitFor(element(by.text(ContactInfoE2eIdConstants.DISMISS_TEXT))).toBeVisible().withTimeout(4000)
    await element(by.text(ContactInfoE2eIdConstants.DISMISS_TEXT)).tap()
    if(type === 'home phone' || type == 'work phone'){
      await expect(element(by.text('Add your ' + type + ' number'))).toExist()
    } else if (type === 'mobile phone') {
      await expect(element(by.text('Add your cell phone number'))).toExist()
    } else {
      await expect(element(by.text('Add your ' + type))).toExist()
    }
  })
}

export async function verifyNonUSorMilitaryAddresses(addressID, addressType) {
  it(addressType + ': should verify non-US address', async() => {
    await element(by.id(addressID)).tap()
    await element(by.id(ContactInfoE2eIdConstants.COUNTRY_PICKER_ID)).tap()
    await element(by.text('Andorra')).tap()
    await element(by.text('Done')).tap()
    await expect(element(by.text('State (Required)'))).not.toExist()
    await expect(element(by.text('International post code (Required)'))).toExist()
    await element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).typeText('19-21 Carrer de na Maria Pla')
    await element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).tapReturnKey()
    await waitFor(element(by.id(ContactInfoE2eIdConstants.ZIP_CODE_ID))).toBeVisible().whileElement(by.id('EditAddressTestID')).scroll(100, 'down', NaN, 0.8)
    await element(by.id(ContactInfoE2eIdConstants.CITY_TEST_ID)).typeText('Andorra la Vella')
    await element(by.id(ContactInfoE2eIdConstants.CITY_TEST_ID)).tapReturnKey()
    await element(by.id('stateTestID')).typeText('Andorra la Vella')
    await element(by.id('stateTestID')).tapReturnKey()
    await element(by.id(ContactInfoE2eIdConstants.ZIP_CODE_ID)).typeText('AD500')
    await element(by.id(ContactInfoE2eIdConstants.ZIP_CODE_ID)).tapReturnKey()
    await element(by.text(ContactInfoE2eIdConstants.SAVE_TEXT)).tap()
    await element(by.id('suggestedAddressTestID')).tap()
    await element(by.id('Use this address')).tap()
    await expect(element(by.id(addressType + ' address 19-21 Carrer de na Maria Pla Andorra la Vella, Andorra la Vella, AD500 Andorra'))).toExist()
  })

  it(addressType + ': should verify a military base address', async() => {
    await element(by.id(addressType + ' address 19-21 Carrer de na Maria Pla Andorra la Vella, Andorra la Vella, AD500 Andorra')).tap()
    await element(by.id('USMilitaryBaseCheckboxTestID')).tap()
    await expect(element(by.id(ContactInfoE2eIdConstants.CITY_TEST_ID))).not.toExist()
    await element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).typeText('123 Main St')
    await element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).tapReturnKey()
    await waitFor(element(by.id(ContactInfoE2eIdConstants.ZIP_CODE_ID))).toBeVisible().whileElement(by.id('EditAddressTestID')).scroll(100, 'down', NaN, 0.8)
    await element(by.id(ContactInfoE2eIdConstants.MILITARY_POST_OFFICE_ID)).tap()
    await element(by.text('FPO')).tap()
    await element(by.text('Done')).tap()
    await element(by.id(ContactInfoE2eIdConstants.STATE_ID)).tap()
    await element(by.text('Armed Forces Pacific (AP)')).tap()
    await element(by.text('Done')).tap()
    await element(by.id(ContactInfoE2eIdConstants.ZIP_CODE_ID)).typeText('12345')
    await element(by.id(ContactInfoE2eIdConstants.ZIP_CODE_ID)).tapReturnKey()
    await element(by.text(ContactInfoE2eIdConstants.SAVE_TEXT)).tap()
    await element(by.id('suggestedAddressTestID')).tap()
    await element(by.id('Use this address')).tap()
    await expect(element(by.id(addressType + ' address 123 Main St FPO, Armed Forces Pacific (AP) 12345'))).toExist()
  })
  
}
beforeAll(async () => {
  await loginToDemoMode()
  await openProfile()
  await openContactInfo()
})

describe(':ios: Contact Info Screen', () => { 	
  it('should match the Contact Info page design', async () => {
		await expect(element(by.id(ContactInfoE2eIdConstants.MAILING_ADDRESS_ID))).toExist()
		await expect(element(by.id(ContactInfoE2eIdConstants.HOME_ADDRESS_ID))).toExist()
    await expect(element(by.id(ContactInfoE2eIdConstants.HOME_PHONE_ID))).toExist()
		await expect(element(by.id(ContactInfoE2eIdConstants.WORK_PHONE_ID))).toExist()
    await expect(element(by.id(ContactInfoE2eIdConstants.MOBILE_PHONE_ID))).toExist()
		await expect(element(by.id(ContactInfoE2eIdConstants.EMAIL_ADDRESS_ID))).toExist()
		await expect(element(by.text(ContactInfoE2eIdConstants.HOW_WE_USE_TEXT))).toExist()
	}) 

  it('verify how we use your contact information link', async () => {
    await expect(element(by.id('howWeUseContactInfoLinkTestID'))).toExist()
    await element(by.id('howWeUseContactInfoLinkTestID')).tap()
    await expect(element(by.text('How we use your contact information')).atIndex(0)).toExist()
    await element(by.text('Close')).atIndex(0).tap()
  })

  validateAddresses(ContactInfoE2eIdConstants.MAILING_ADDRESS_ID, 'Mailing')
  validateAddresses(ContactInfoE2eIdConstants.HOME_ADDRESS_ID, 'Home')
  validatePhoneNumbers(ContactInfoE2eIdConstants.HOME_PHONE_ID, 'Home')
  validatePhoneNumbers(ContactInfoE2eIdConstants.WORK_PHONE_ID, 'Work')
  validatePhoneNumbers(ContactInfoE2eIdConstants.MOBILE_PHONE_ID, 'Mobile')

  it ('should open the email address', async () => {
    await element(by.id(ContactInfoE2eIdConstants.CONTACT_INFO_PAGE_ID)).scrollTo('bottom')
    await element(by.id(ContactInfoE2eIdConstants.EMAIL_ADDRESS_ID)).tap()
  })

  it('email address: verify error handling', async() => {
    await element(by.id('emailAddressEditTestID')).clearText()
    await element(by.text(ContactInfoE2eIdConstants.SAVE_TEXT)).tap()
    await expect(element(by.text('Check your email address'))).toExist()
  })

  it('should update the email address with a +', async () => {
    await element(by.id('emailAddressEditTestID')).clearText()
    await element(by.id('emailAddressEditTestID')).typeText('attended1+@gmail.com')
    await element(by.id('emailAddressEditTestID')).tapReturnKey()
    await waitFor(element(by.text(ContactInfoE2eIdConstants.SAVE_TEXT))).toBeVisible().withTimeout(4000)
    await element(by.text(ContactInfoE2eIdConstants.SAVE_TEXT)).tap()
    await expect(element(by.text('Email address saved'))).toExist()
    await element(by.text(ContactInfoE2eIdConstants.DISMISS_TEXT)).tap()
  })

  it('should update the email address and remove the +', async () => {
    await element(by.id(ContactInfoE2eIdConstants.CONTACT_INFO_PAGE_ID)).scrollTo('bottom')
    await element(by.id(ContactInfoE2eIdConstants.EMAIL_ADDRESS_ID)).tap()
    await element(by.id('emailAddressEditTestID')).clearText()
    await element(by.id('emailAddressEditTestID')).typeText('attended1@gmail.com')
    await element(by.id('emailAddressEditTestID')).tapReturnKey()
    await waitFor(element(by.text(ContactInfoE2eIdConstants.SAVE_TEXT))).toBeVisible().withTimeout(4000)
    await element(by.text(ContactInfoE2eIdConstants.SAVE_TEXT)).tap()
    await expect(element(by.text('Email address saved'))).toExist()
    await element(by.text(ContactInfoE2eIdConstants.DISMISS_TEXT)).tap()
    await element(by.id(ContactInfoE2eIdConstants.CONTACT_INFO_PAGE_ID)).scrollTo('top')
  })

  removeContactInfoFeature('Home address 3101 N Fort Valley Rd, 2 Flagstaff, AZ, 86001', 'home address')
  removeContactInfoFeature(ContactInfoE2eIdConstants.WORK_PHONE_ID, 'work phone')
  removeContactInfoFeature(ContactInfoE2eIdConstants.HOME_PHONE_ID, 'home phone')
  removeContactInfoFeature(ContactInfoE2eIdConstants.MOBILE_PHONE_ID, 'mobile phone')
  removeContactInfoFeature(ContactInfoE2eIdConstants.EMAIL_ADDRESS_ID, 'email address')

  verifyNonUSorMilitaryAddresses(ContactInfoE2eIdConstants.HOME_ADDRESS_ID, 'Home')
  verifyNonUSorMilitaryAddresses('Mailing address 3101 N Fort Valley Rd, 2 Flagstaff, AZ, 86001', 'Mailing')
})