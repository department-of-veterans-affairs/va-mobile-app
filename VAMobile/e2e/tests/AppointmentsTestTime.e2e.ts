import { by, element, waitFor } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openAppointments, openHealth, toggleRemoteConfigFlag } from './utils'

export const ApptsTestTimeE2eConstants = {
  APPOINTMENTS_PAST_TAB_ID: 'apptsPastID',
}
beforeAll(async () => {
  // Turns on using alternate (overlapping data on upcoming and past) json for appointments (default off)
  await toggleRemoteConfigFlag(CommonE2eIdConstants.APPOINTMENTS_TEST_TIME)
  await loginToDemoMode()
  await openHealth()
  await openAppointments()
  await waitFor(element(by.text('Upcoming')))
    .toExist()
    .withTimeout(3000)
  // shorter timeout due to short appointments list
})

describe('Upcoming Appointments Screen', () => {
  it('should see in-person appointment that started 59 minutes prior', async () => {
    await waitFor(element(by.text('59 minutes prior - IN-PERSON')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
  })
  it('should see video appointment that started 3 hour prior', async () => {
    await waitFor(element(by.text('3 hours prior video - HOME')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
  })
  it('should not see in-person appointment that started 60 minutes prior', async () => {
    await waitFor(element(by.text('60 minutes prior - IN-PERSON')))
      .not.toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
  })
})

describe('Past Appointments Screen', () => {
  beforeAll(async () => {
    await waitFor(element(by.id(ApptsTestTimeE2eConstants.APPOINTMENTS_PAST_TAB_ID)))
      .toBeVisible()
      .withTimeout(3000)
    // shorter timeout due to short appointments list
    await element(by.id(ApptsTestTimeE2eConstants.APPOINTMENTS_PAST_TAB_ID)).tap()
  })
  it('should see in-person appointment that started 60 minutes prior', async () => {
    await waitFor(element(by.text('60 minutes prior - IN-PERSON')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
  })
  it('should NOT see video appointment that started 3 hours prior', async () => {
    await waitFor(element(by.text('3 hours prior video - HOME')))
      .not.toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
  })
  it('should see video appointment that started 4 hours prior', async () => {
    await waitFor(element(by.text('4 hours prior video - HOME')))
      .toBeVisible()
      .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
      .scroll(200, 'down')
  })
})
