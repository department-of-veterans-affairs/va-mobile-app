/*
Description:
Detox script that verifies happy path appointment detail screens for key appointment types.
Canceled, pending, and missing-data edge cases are covered by unit tests.
When to update:
This script should be updated when appointment detail screen layouts change significantly.
*/
import { by, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openAppointments, openHealth, toggleRemoteConfigFlag } from './utils'

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await toggleRemoteConfigFlag(CommonE2eIdConstants.TRAVEL_PAY_CONFIG_FLAG_TEXT)
  await loginToDemoMode()
  await openHealth()
  await openAppointments()
  await waitFor(element(by.text('Upcoming')))
    .toExist()
    .withTimeout(10000)
})

describe(':ios: Appointments Screen Expansion', () => {
  it('verify confirmed VA in-person appointment details', async () => {
    await waitFor(element(by.text('At San Francisco VA Health Care System')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(300, 'down')
    await element(by.text('At San Francisco VA Health Care System')).tap()
    await expect(element(by.text('Go to San Francisco VA Health Care System for this appointment.'))).toExist()
    await expect(element(by.text('Primary Care'))).toExist()
    await expect(element(by.text('Jane Smith'))).toExist()
    await expect(element(by.text('Cancel appointment'))).toExist()
    await element(by.text('Back')).tap()
  })

  it('verify confirmed home video appointment details', async () => {
    await waitFor(element(by.text('Sami Alsahhar - HOME - Confirmed')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(300, 'down')
    await element(by.text('Sami Alsahhar - HOME - Confirmed')).tap()
    await expect(element(by.text('Video appointment'))).toExist()
    await expect(element(by.text('You can join 30 minutes before your appointment time.'))).toExist()
    await expect(element(by.text('Mental Health'))).toExist()
    await element(by.text('Back')).tap()
  })
})
