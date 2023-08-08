import { expect, device, by, element } from 'detox'
import { loginToDemoMode, openContactInfo, openProfile } from './utils'

export const ContactInfoE2eIdConstants = {
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
  PHONE_NUMBER_ID: 'phoneNumberTestID'
}

beforeAll(async () => {
  await loginToDemoMode()
  await openProfile()
  await openContactInfo()
})

describe('Contact Info Screen', () => { 	
  it('should match the Contact Info page design', async () => {
		await expect(element(by.id(ContactInfoE2eIdConstants.MAILING_ADDRESS_ID))).toExist()
		await expect(element(by.id(ContactInfoE2eIdConstants.HOME_ADDRESS_ID))).toExist()
    await expect(element(by.id(ContactInfoE2eIdConstants.HOME_PHONE_ID))).toExist()
		await expect(element(by.id(ContactInfoE2eIdConstants.WORK_PHONE_ID))).toExist()
    await expect(element(by.id(ContactInfoE2eIdConstants.MOBILE_PHONE_ID))).toExist()
		await expect(element(by.id(ContactInfoE2eIdConstants.EMAIL_ADDRESS_ID))).toExist()
		await expect(element(by.text(ContactInfoE2eIdConstants.HOW_WE_USE_TEXT))).toExist()
	}) 

  it('should tap on the how we use your contact information link and verify that it opens', async () => {
    await expect(element(by.id('howWeUseContactInfoLinkTestID'))).toExist()
    await element(by.id('howWeUseContactInfoLinkTestID')).tap()
    await expect(element(by.text('How we use your contact information')).atIndex(0)).toExist()
    await element(by.text('Close')).atIndex(0).tap()
  })

  it('should open and update the mailing address', async () => {
    await element(by.id(ContactInfoE2eIdConstants.MAILING_ADDRESS_ID)).tap()
    await element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_2_ID)).replaceText('2')
  })

  it('should tap on the save button and verify your address screen is displayed', async () => {
    await element(by.text('Save')).tap()
    await expect(element(by.id('verifyYourAddressTestID'))).toExist()
    await element(by.id('verifyYourAddressTestID')).tap()
    await expect(element(by.text('We can\'t confirm the address you entered with the U.S. Postal Service.'))).toExist()
    await element(by.text('Verify your address')).tap()
  })

  it('should tap on edit address and return to the mailing address screen', async () => {
    await element(by.id('Edit this address.')).tap()
    await expect(element(by.text('United States'))).toExist()
    await expect(element(by.text('3101 N Fort Valley Rd')).atIndex(0)).toExist()
    await expect(element(by.text('2'))).toExist()
    await expect(element(by.text('Flagstaff'))).toExist()
    await expect(element(by.text('Arizona'))).toExist()
    await expect(element(by.text('86001'))).toExist()
  })

  it('should tap on the save button and verify your address screen is displayed', async () => {
    await element(by.text('Save')).tap()
    await expect(element(by.id('verifyYourAddressTestID'))).toExist()
  })

  it('should tap on use this address and return to the contact information screen', async () => {
    await element(by.id('suggestedAddressTestID')).tap()
    await element(by.id('Use this address')).tap()
    await expect(element(by.text('Mailing address saved'))).toExist()
    await element(by.text('Dismiss')).tap()
  })

  it('should open the home address', async () => {
    await element(by.text('Home address')).tap()
  })

  it('should select the I live on a U.S. military base... checkbox and verify that the correct fields are displayed', async () => {
    await element(by.id('USMilitaryBaseCheckboxTestID')).tap()
    await expect(element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_1_ID))).toExist()
    await expect(element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_2_ID))).toExist()
    await expect(element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_3_ID))).toExist()
    await expect(element(by.id(ContactInfoE2eIdConstants.MILITARY_POST_OFFICE_ID))).toExist()
    await expect(element(by.id(ContactInfoE2eIdConstants.STATE_ID))).toExist()
    await expect(element(by.text('Country (Required)'))).not.toBeVisible()
  })

  it('should unselect I live on a U.S military base... checkbox and update the home address', async () => {
    await element(by.id('USMilitaryBaseCheckboxTestID')).tap()
    await element(by.id(ContactInfoE2eIdConstants.COUNTRY_PICKER_ID)).tap()
    await element(by.text('United States')).tap()
    await element(by.text('Done')).tap()
    await element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).clearText()
    await element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_1_ID)).replaceText('3101 N Fort Valley Rd')
    await element(by.id(ContactInfoE2eIdConstants.STREET_ADDRESS_LINE_2_ID)).replaceText('2')
    await element(by.id('EditAddressTestID')).scrollTo('bottom')
    await element(by.id(ContactInfoE2eIdConstants.CITY_TEST_ID)).replaceText('Flagstaff')
    await element(by.id('stateTestID')).tap()
    await element(by.text('Arizona')).tap()
    await element(by.text('Done')).tap()
    await element(by.id(ContactInfoE2eIdConstants.ZIP_CODE_ID)).replaceText('86001')
    await element(by.text('Save')).tap()
    await element(by.id('suggestedAddressTestID')).tap()
    await element(by.id('Use this address')).tap()
    await expect(element(by.text('Home address saved'))).toExist()
    await element(by.text('Dismiss')).tap()
  })

  it ('should open the home phone number', async () => {
    await element(by.id(ContactInfoE2eIdConstants.HOME_PHONE_ID)).tap()
  })

  it('should update the home phone with an extension', async () => {
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID)).replaceText('276-608-6180')
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).replaceText('1234')
    await element(by.text('Save')).tap()
    await expect(element(by.text('Home phone saved'))).toExist()
    await element(by.text('Dismiss')).tap()
  })
  
  it('should update the home phone number and remove the extension', async () => {
    await element(by.id(ContactInfoE2eIdConstants.HOME_PHONE_ID)).tap()
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).clearText()
    await element(by.text('Save')).tap()
    await expect(element(by.text('Home phone saved'))).toExist()
    await element(by.text('Dismiss')).tap()
  })

  it ('should open the work phone number', async () => {
    await element(by.id(ContactInfoE2eIdConstants.WORK_PHONE_ID)).tap()
  })

  it('should update the work phone with an extension', async () => {
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID)).replaceText('276-608-6180')
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).replaceText('1234')
    await element(by.text('Save')).tap()
    await expect(element(by.text('Work phone saved'))).toExist()
    await element(by.text('Dismiss')).tap()
  })

  it('should update the work phone number and remove the extension', async () => {
    await element(by.id(ContactInfoE2eIdConstants.WORK_PHONE_ID)).tap()
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).clearText()
    await element(by.text('Save')).tap()
    await expect(element(by.text('Work phone saved'))).toExist()
    await element(by.text('Dismiss')).tap()
  })

  it ('should open the mobile phone number', async () => {
    await device.launchApp({newInstance: true})
    await loginToDemoMode()
    await openProfile()
    await openContactInfo()
    await element(by.id('ContactInfoTestID')).scrollTo('bottom')
    await element(by.id(ContactInfoE2eIdConstants.MOBILE_PHONE_ID)).tap()
  })

  it('should update the mobile phone with an extension', async () => {
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_ID)).replaceText('276-608-6180')
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).replaceText('1234')
    await element(by.text('Save')).tap()
    await expect(element(by.text('Mobile phone saved'))).toExist()
    await element(by.text('Dismiss')).tap()
  })

  it('should update the mobile phone number and remove the extension', async () => {
    await element(by.id('ContactInfoTestID')).scrollTo('bottom')
    await element(by.id(ContactInfoE2eIdConstants.MOBILE_PHONE_ID)).tap()
    await element(by.id(ContactInfoE2eIdConstants.PHONE_NUMBER_EXTENSION_ID)).clearText()
    await element(by.text('Save')).tap()
    await expect(element(by.text('Mobile phone saved'))).toExist()
    await element(by.text('Dismiss')).tap()
  })

  it ('should open the email address', async () => {
    await element(by.id('ContactInfoTestID')).scrollTo('bottom')
    await element(by.id(ContactInfoE2eIdConstants.EMAIL_ADDRESS_ID)).tap()
  })

  it('should update the email address with a +', async () => {
    await element(by.id('emailAddressEditTestID')).replaceText('attended1+@gmail.com')
    await element(by.text('Save')).tap()
    await expect(element(by.text('Email address saved'))).toExist()
    await element(by.text('Dismiss')).tap()
  })

  it('should update the email address and remove the +', async () => {
    await element(by.id('ContactInfoTestID')).scrollTo('bottom')
    await element(by.id(ContactInfoE2eIdConstants.EMAIL_ADDRESS_ID)).tap()
    await element(by.id('emailAddressEditTestID')).replaceText('attended1@gmail.com')
    await element(by.text('Save')).tap()
    await expect(element(by.text('Email address saved'))).toExist()
    await element(by.text('Dismiss')).tap()
  })
})