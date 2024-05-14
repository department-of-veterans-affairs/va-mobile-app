import { by, device, element, expect } from 'detox'
import { setTimeout } from 'timers/promises'

import { CommonE2eIdConstants, loginToDemoMode, openAppointments, openHealth, openMessages } from './utils'

export const CernerIdConstants = {
  GO_TO_VA_HEALTH_LINK_ID: 'goToMyVAHealthTestID',
  HEALTH_CATEGORY_ID: 'healthCategoryTestID',
  CERNER_NOTE_HEADING_TEXT: 'Your VA health care team may be using the My VA Health portal',
  CERNER_NOTE_RECORDS_SHOW_TEXT: 'Our records show you’re registered at:',
  CERNER_NOTE_FACILITY_TEXT: 'Cary VA Medical Center (Now using My VA Health)',
  CERNER_NOTE_FACILITY_2_TEXT: 'Cheyenne VA Medical Center (Now using My VA Health)',
  CERNER_NOTE_MESSAGES_TEXT:
    "This facility currently uses our My VA Health portal. You'll need to go there to send your message.",
  CERNER_NOTE_MESSAGES_HEADER_TEXT: "Make sure you're in the right health portal",
}

beforeAll(async () => {
  if (device.getPlatform() === 'android') {
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
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_FACILITY_2_TEXT))).toExist()
    await expect(element(by.id(CernerIdConstants.GO_TO_VA_HEALTH_LINK_ID))).toExist()
  })

  it('verify the correct webpage My Health link is opened', async () => {
    await element(by.id(CernerIdConstants.HEALTH_CATEGORY_ID)).scrollTo('bottom')
    await element(by.id(CernerIdConstants.GO_TO_VA_HEALTH_LINK_ID)).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('cernerVAHealthLink')
    await device.launchApp({ newInstance: false })
  })

  it('should tap on the cerner notification and verify the alert closes', async () => {
    await element(by.text(CernerIdConstants.CERNER_NOTE_HEADING_TEXT)).tap()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_FACILITY_TEXT))).not.toExist()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_FACILITY_2_TEXT))).not.toExist()
  })

  it('verify the cerner notification is present and collapsed', async () => {
    await element(by.id(CernerIdConstants.HEALTH_CATEGORY_ID)).scrollTo('top')
    await openAppointments()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_HEADING_TEXT))).toExist()
    await expect(element(by.text('Our records show you`re registered at:'))).not.toExist()
  })

  it('tap on messages and verify the cerner notification is present and collapsed', async () => {
    await element(by.text('Health')).atIndex(0).tap()
    await openMessages()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_HEADER_TEXT))).toExist()
    await expect(element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_TEXT))).not.toExist()
  })

  it('verify the correct information is displayed for multiple facilities', async () => {
    await element(by.text(CernerIdConstants.CERNER_NOTE_MESSAGES_HEADER_TEXT)).tap()
    await expect(element(by.text('Sending a message to a care team at one of these health facilities?'))).toExist()
    await expect(element(by.text('Cheyenne VA Medical Center'))).toExist()
    await expect(element(by.text('Cary VA Medical Center'))).toExist()
    await expect(
      element(
        by.text(
          "These facilities currently use our My VA Health portal. You'll need to go there to send your message.",
        ),
      ),
    ).toExist()
    await expect(element(by.id(CernerIdConstants.GO_TO_VA_HEALTH_LINK_ID))).toExist()
  })
})
