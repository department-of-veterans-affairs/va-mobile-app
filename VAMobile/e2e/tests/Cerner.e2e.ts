import { expect, device, by, element} from 'detox'
import {loginToDemoMode, openHealth, changeMockData, openAppointments, openMessages } from './utils'
import { setTimeout } from 'timers/promises'

export const CernerIdConstants = {
  GO_TO_VA_HEALTH_LINK_ID: 'goToMyVAHealthTestID',
  HEALTH_CATEGORY_ID: 'healthCategoryTestID',
  CERNER_NOTE_HEADING_TEXT: 'Some of your V\uFEFFA health care team may be using the My V\uFEFFA Health portal',
  CERNER_NOTE_RECORDS_SHOW_TEXT: 'Our records show you’re registered at:',
  CERNER_NOTE_FACILITY_TEXT: 'Cary VA Medical Center (Now using My V\uFEFFA Health)',
  CERNER_NOTE_MESSAGES_TEXT: 'This facility currently uses our My VA Health portal. You\'ll need to go there to send your message.',
  CERNER_NOTE_MESSAGES_HEADER_TEXT: 'Make sure you\'re in the right health portal',
}

beforeAll(async () => {
  if(device.getPlatform() === 'android') {
    await changeMockData('profile.json', ['/v1/user', 'data', 'attributes', 'health', 'isCernerPatient'], true)
    await device.launchApp({newInstance: true})
    await changeMockData('getFacilitiesInfo.json', ['/v0/facilities-info', 'data', 'attributes', {'facilities': 0}, 'cerner'], true, true)
    await device.launchApp({newInstance: true})
    await changeMockData('getFacilitiesInfo.json', ['/v0/facilities-info', 'data', 'attributes', {'facilities': 1}, 'cerner'], false, true)
    await device.launchApp({newInstance: true})
    await loginToDemoMode()
    await openHealth()
  }
})

describe(':android: Cerner Notice', () => {
  it('should match the cerner notice design', async () => {
    await element(by.id(CernerIdConstants.HEALTH_CATEGORY_ID)).swipe('up')
    await element(by.text(CernerIdConstants.CERNER_NOTE_HEADING_TEXT)).tap()
    await element(by.id(CernerIdConstants.HEALTH_CATEGORY_ID)).swipe('up')
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_FACILITY_TEXT))).toExist()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_FACILITY_TEXT))).toExist()
    await expect(element(by.id(CernerIdConstants.GO_TO_VA_HEALTH_LINK_ID))).toExist()
  })

  it('should tap the go to My VA Health link and verify the correct webpage is opened', async () => {
    await element(by.id(CernerIdConstants.GO_TO_VA_HEALTH_LINK_ID)).tap()
    await element(by.text('Ok')).tap()
    await setTimeout(5000)
    await device.takeScreenshot('cernerVAHealthLink')
    await device.launchApp({ newInstance: false })
  })

  it('should tap on the cerner notification and verify the alert closes', async () => {
    await element(by.text(CernerIdConstants.CERNER_NOTE_HEADING_TEXT)).tap()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_FACILITY_TEXT))).not.toExist()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_FACILITY_TEXT))).not.toExist()
  })

  it('should tap on appointments and verify the cerner notification is present and collapsed', async () => {
    await element(by.id(CernerIdConstants.HEALTH_CATEGORY_ID)).scrollTo('top')
    await openAppointments()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_HEADING_TEXT))).toExist()
    await expect(element(by.text('Our records show you`re registered at:'))).not.toExist()
  })

  it('should tap back, tap on messages and verify the cerner notification is present and collapsed', async () => {
    await element(by.text('Health')).atIndex(0).tap()
    await openMessages()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_HEADER_TEXT))).toExist()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_TEXT))).not.toExist()
  })

  it('should tap on the cerner notification and verify the correct information is displayed for one facility', async () => {
    await element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_HEADER_TEXT)).tap()
    await expect(element(by.text('Sending a message to a care team at Cary VA Medical Center?'))).toExist()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_TEXT))).toExist()
    await expect(element(by.id(CernerIdConstants.GO_TO_VA_HEALTH_LINK_ID))).toExist()
  })

  it('should add another facility to the mock data file', async () => {
    //await changeMockData('profile.json', ['/v1/user', 'data', 'attributes', 'health', {'facilities': 1}, 'facilityName'], 'San Francisco VA Medical Center')
    await changeMockData('getFacilitiesInfo.json', ['/v0/facilities-info', 'data', 'attributes', {'facilities': 1}, 'cerner'], true, true)
    await device.launchApp({newInstance: true})
		await loginToDemoMode()
		await openHealth()
    await openMessages()
  })

  it('should tap on the cerner notification and verify the correct information is displayed for multiple facilities', async () => {
    await element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_HEADER_TEXT)).tap()
    await expect(element(by.text('Sending a message to a care team at one of these health facilities?'))).toExist()
    await expect(element(by.text('Cheyenne VA Medical Center'))).toExist()
    await expect(element(by.text('Cary VA Medical Center'))).toExist()
    await expect(element(by.text('These facilities currently use our My VA Health portal. You\'ll need to go there to send your message.'))).toExist()
    await expect(element(by.id(CernerIdConstants.GO_TO_VA_HEALTH_LINK_ID))).toExist()
  })

  it('should remove secure messaging from authorizedServices in the mock data file', async () => {
    await changeMockData('profile.json', ['/v1/user', 'data', 'attributes', 'authorizedServices'], ["appeals", "appointments", "claims", "decisionLetters", "directDepositBenefits", "directDepositBenefitsUpdate", "lettersAndDocuments", "militaryServiceHistory", "userProfileUpdate", "prescriptions"])
    await device.launchApp({newInstance: true})
    await loginToDemoMode()
    await openHealth()
    await openMessages()
  })

  it('should verify that no cerner notification is displayed when the user does not have access to secure messaging', async () => {
    await expect(element(by.text('You\'re not currently enrolled to use Secure Messaging'))).toExist()
  })

  it('should reset mock data', async () => {
		await changeMockData('profile.json', ['/v1/user', 'data', 'attributes', 'health', 'isCernerPatient'], false)
		await device.launchApp({newInstance: true})
    await changeMockData('profile.json', ['/v1/user', 'data', 'attributes', 'authorizedServices'], ["appeals", "appointments", "claims", "decisionLetters", "directDepositBenefits", "directDepositBenefitsUpdate", "lettersAndDocuments", "militaryServiceHistory", "userProfileUpdate", "prescriptions", "secureMessaging"])
    await device.launchApp({newInstance: true})
    //await changeMockData('getFacilitiesInfo.json', ['/v0/facilities-info', 'data', 'attributes', {'facilities': 0}, 'cerner'], false, true)
    //await device.launchApp({newInstance: true})
    await changeMockData('getFacilitiesInfo.json', ['/v0/facilities-info', 'data', 'attributes', {'facilities': 1}, 'cerner'], false, true)
    await device.launchApp({newInstance: true})
  })
})
