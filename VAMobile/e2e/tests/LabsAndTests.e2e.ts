import { by, element, expect, waitFor } from 'detox'
import { DateTime } from 'luxon'

import { getFormattedDate } from '../../src/utils/dateUtils'
import {
  CommonE2eIdConstants,
  loginToDemoMode,
  openHealth,
  openLabsAndTestRecords,
  openMedicalRecords,
  scrollToElement,
  testForOneOrManyOccurancesOf,
  toggleRemoteConfigFlag,
} from './utils'

export const LabsAndTestsE2eIDConstants = {
  DATE_RANGE_PICKER_ID: 'labsAndTestDateRangePickerTestID',
  DATE_RANGE_CONFIRM_PICKER_ID: 'labsAndTestsDateRangeConfirmID',
  ZERO_HOLD_TIME_ALERT_ID: 'labsAndTestsZeroHoldTimeAlertID',
  MR_HIDE_36_HR_HOLD_TIMES_TOGGLE_TEXT: 'mrHide36HrHoldTimes',
}

const navigateToLabsAndTests = async () => {
  await openHealth()
  await openMedicalRecords()
  await openLabsAndTestRecords()
}

const resetDateRangeToDefault = async () => {
  await element(by.id(LabsAndTestsE2eIDConstants.DATE_RANGE_PICKER_ID)).tap()
  await element(by.id('range-past-3-months')).tap()
  await element(by.id(LabsAndTestsE2eIDConstants.DATE_RANGE_CONFIRM_PICKER_ID)).tap()
}
// Calculate dynamic dates that will always be within the past 3 months
// These calculations ensure the test remains timeless and matches the demo data
const surgicalPathologyTestDate = getFormattedDate(DateTime.now().minus({ days: 1 }).toISO(), 'MMMM dd, yyyy')
const chemHemTestDate = getFormattedDate(DateTime.now().minus({ days: 2 }).toISO(), 'MMMM dd, yyyy')
const TEST_IDS = {
  LIST_ID: 'LabsAndTestsButtonsListTestID',
  SURGICAL_PATHOLOGY_TEST_ID: 'Surgical Pathology - latest ' + surgicalPathologyTestDate,
  CHEM_HEM_TEST_ID: 'CH - latest ' + chemHemTestDate,
  BACK_BUTTON_ID: 'labsAndTestsDetailsBackID',
}
const HEADER_TEXT = 'Labs and tests'

beforeAll(async () => {
  // await toggleRemoteConfigFlag(CommonE2eIdConstants.LABS_AND_TEST_TOGGLE_TEXT)
  await loginToDemoMode()
  await openHealth()
  await openMedicalRecords()
  await openLabsAndTestRecords()
})

describe('Labs And Test Screen - Date Picker', () => {
  beforeEach(async () => {
    // Navigate back to Labs and Tests screen before each test
    await navigateToLabsAndTests()
  })
  it('date range selection verification', async () => {
    await element(by.id(LabsAndTestsE2eIDConstants.DATE_RANGE_PICKER_ID)).tap()

    // Verify "Past 3 months" option exists (default)
    await expect(element(by.id('range-past-3-months'))).toExist()

    // Verify "Past 6 months" option exists
    await expect(element(by.id('range-past-6-months'))).toExist()

    // Verify current year option exists
    const currentYear = DateTime.now().year
    await expect(element(by.id(`range-${currentYear}`))).toExist()

    // Select "Past 3 months" to confirm it works
    await element(by.id('range-past-3-months')).tap()
    await element(by.id(LabsAndTestsE2eIDConstants.DATE_RANGE_CONFIRM_PICKER_ID)).tap()
  })

  it('should show different results when selecting last year', async () => {
    const currentYear = DateTime.now().year
    const lastYear = currentYear - 1

    // First, verify current default selection (past 3 months) shows current records
    await expect(element(by.id(TEST_IDS.SURGICAL_PATHOLOGY_TEST_ID))).toExist()
    await expect(element(by.id(TEST_IDS.CHEM_HEM_TEST_ID))).toExist()

    // Verify last year's records are not visible
    await expect(element(by.text('Blood Work - Last Year'))).not.toExist()
    await expect(element(by.text('X-Ray - Last Year'))).not.toExist()

    // Open the date picker and select last year
    await element(by.id(LabsAndTestsE2eIDConstants.DATE_RANGE_PICKER_ID)).tap()
    await element(by.id(`range-${lastYear}`)).tap()
    await element(by.id(LabsAndTestsE2eIDConstants.DATE_RANGE_CONFIRM_PICKER_ID)).tap()

    // Wait for data to load and verify the date range text updated to show last year

    await waitFor(element(by.text(`Jan 1, ${lastYear} - Dec 31, ${lastYear}`))).toExist()

    // Verify last year's records are now visible
    await expect(element(by.text('Blood Work - Last Year'))).toExist()
    await expect(element(by.text('X-Ray - Last Year'))).toExist()

    // Verify current records are not in the list anymore
    await expect(element(by.id(TEST_IDS.SURGICAL_PATHOLOGY_TEST_ID))).not.toExist()
    await expect(element(by.id(TEST_IDS.CHEM_HEM_TEST_ID))).not.toExist()

    // Reset back to past 3 months for other tests
    await resetDateRangeToDefault()
  })
})

describe('Labs And Test Screen', () => {
  beforeAll(async () => {
    await resetDateRangeToDefault()
  })

  beforeEach(async () => {
    // Navigate back to Labs and Tests screen before each test
    await navigateToLabsAndTests()
  })

  it('navigate back and forth between the list and details screen', async () => {
    await expect(element(by.text(HEADER_TEXT))).toExist()
    await expect(element(by.id(TEST_IDS.SURGICAL_PATHOLOGY_TEST_ID))).toExist()
    await element(by.id(TEST_IDS.SURGICAL_PATHOLOGY_TEST_ID)).tap()
    // the title should be details
    await expect(element(by.text('Details'))).toExist()
    // go back
    await element(by.id('labsAndTestsDetailsBackID')).tap()
    // the title should be labs and tests
    await expect(element(by.text(HEADER_TEXT))).toExist()
  })
  it('should be able to click into a lab or test record', async () => {
    // loads the list,
    await expect(element(by.text(HEADER_TEXT))).toExist()
    await expect(element(by.id(TEST_IDS.SURGICAL_PATHOLOGY_TEST_ID))).toExist()
    await element(by.id(TEST_IDS.SURGICAL_PATHOLOGY_TEST_ID)).tap()

    // the title should be details
    await expect(element(by.text('Details'))).toExist()

    // the page should have the correct data
    await expect(element(by.text('Surgical Pathology - latest'))).toExist()
    await expect(element(by.text(surgicalPathologyTestDate))).toExist()
    await expect(element(by.text('Bone Marrow'))).toExist()
    await expect(element(by.text('Right leg'))).toExist()
    await expect(element(by.text('VA TEST LAB'))).toExist()

    // ensure base 64 decoded data is present
    await expect(element(by.text('this is a test'))).toExist()

    // Navigate back to the list
    await element(by.id(TEST_IDS.BACK_BUTTON_ID)).tap()
    // the title should be labs and tests
    await expect(element(by.text(HEADER_TEXT))).toExist()
  })
})

describe('Labs And Test Details Screen with Observations', () => {
  beforeEach(async () => {
    // Navigate back to Labs and Tests screen before each test
    await navigateToLabsAndTests()
  })

  it('navigate to detail screen and show results', async () => {
    await expect(element(by.text(HEADER_TEXT))).toExist()
    await expect(element(by.id(TEST_IDS.CHEM_HEM_TEST_ID))).toExist()
    await element(by.id(TEST_IDS.CHEM_HEM_TEST_ID)).tap()
    // the title should be Details
    await expect(element(by.text('Details'))).toExist()

    await expect(element(by.text('CH - latest'))).toExist()
    await expect(element(by.text(chemHemTestDate))).toExist()
    await expect(element(by.text('CHYSHR TEST LAB'))).toExist()

    await testForOneOrManyOccurancesOf('None noted')
    await testForOneOrManyOccurancesOf('Blood')
    await testForOneOrManyOccurancesOf('Left arm')

    await expect(element(by.text('ZZGeorge Washington'))).toExist()

    await scrollToElement('CREATININE', 'labsAndTestsDetailsScreen')
    await expect(element(by.text('CREATININE'))).toExist()

    // go back
    await element(by.id(TEST_IDS.BACK_BUTTON_ID)).tap()
    // the title should be labs and tests
    await expect(element(by.text(HEADER_TEXT))).toExist()
  })
})

describe('Labs And Tests - Remote Config: mrHide36HrHoldTimes', () => {
  beforeEach(async () => {
    await navigateToLabsAndTests()
  })

  it('should show 36 hour text when flag is disabled (no records scenario)', async () => {
    // Select a date range with no records (e.g., 10 years ago)
    const tenYearsAgo = DateTime.now().year - 10
    await element(by.id(LabsAndTestsE2eIDConstants.DATE_RANGE_PICKER_ID)).tap()
    await element(by.id(`range-${tenYearsAgo}`)).tap()
    await element(by.id(LabsAndTestsE2eIDConstants.DATE_RANGE_CONFIRM_PICKER_ID)).tap()

    // Verify the 36 hour text is displayed when flag is off
    await waitFor(
      element(
        by.text(
          "We're sorry. We update your labs and tests records every 24 hours, but new records can take up to 36 hours to appear.",
        ),
      ),
    )
      .toExist()
      .withTimeout(5000)

    // Reset date range
    await resetDateRangeToDefault()
  })

  it('should hide 36 hour text when flag is enabled (no records scenario)', async () => {
    await toggleRemoteConfigFlag(LabsAndTestsE2eIDConstants.MR_HIDE_36_HR_HOLD_TIMES_TOGGLE_TEXT)
    await navigateToLabsAndTests()

    // Select a date range with no records
    const tenYearsAgo = DateTime.now().year - 10
    await element(by.id(LabsAndTestsE2eIDConstants.DATE_RANGE_PICKER_ID)).tap()
    await element(by.id(`range-${tenYearsAgo}`)).tap()
    await element(by.id(LabsAndTestsE2eIDConstants.DATE_RANGE_CONFIRM_PICKER_ID)).tap()

    // Verify the 36 hour text is NOT displayed when flag is on
    await waitFor(
      element(
        by.text(
          "We're sorry. We update your labs and tests records every 24 hours, but new records can take up to 36 hours to appear.",
        ),
      ),
    )
      .not.toExist()
      .withTimeout(5000)

    // Verify the simplified text IS displayed
    await expect(element(by.text('We update your labs and tests records every 24 hours.'))).toExist()

    // Reset date range and toggle flag back
    await resetDateRangeToDefault()
    await toggleRemoteConfigFlag(LabsAndTestsE2eIDConstants.MR_HIDE_36_HR_HOLD_TIMES_TOGGLE_TEXT)
  })

  it('should show 36 hour availability text when flag is disabled (with records scenario)', async () => {
    await navigateToLabsAndTests()

    // Verify the availability text with "36 hours" is displayed
    await expect(element(by.text('36 hours'))).toExist()

    // Verify the zero hold time alert is NOT displayed
    await expect(element(by.id(LabsAndTestsE2eIDConstants.ZERO_HOLD_TIME_ALERT_ID))).not.toExist()
  })

  it('should show expandable alert when flag is enabled (with records scenario)', async () => {
    await toggleRemoteConfigFlag(LabsAndTestsE2eIDConstants.MR_HIDE_36_HR_HOLD_TIMES_TOGGLE_TEXT)
    await navigateToLabsAndTests()

    // Verify the zero hold time alert is displayed
    await expect(element(by.id(LabsAndTestsE2eIDConstants.ZERO_HOLD_TIME_ALERT_ID))).toExist()

    // Verify the alert heading is visible
    await expect(
      element(by.text('We encourage you to wait for your care team to contact you before reviewing results.')),
    ).toExist()

    // Verify the 36 hour availability text is NOT displayed
    await expect(element(by.text('36 hours'))).not.toExist()
  })

  it('should expand alert when tapped and show additional text', async () => {
    await navigateToLabsAndTests()

    // Verify alert is present
    await expect(element(by.id(LabsAndTestsE2eIDConstants.ZERO_HOLD_TIME_ALERT_ID))).toExist()

    // Tap on the alert to expand it
    await element(by.id(LabsAndTestsE2eIDConstants.ZERO_HOLD_TIME_ALERT_ID)).tap()

    // Verify the expanded content is now visible
    await expect(
      element(by.text('Your team can help you understand what the results mean for your overall health.')),
    ).toExist()

    await expect(
      element(
        by.text(
          'If you do review results on your own, remember that many factors can affect what they mean for you. If you have concerns, contact your care team.',
        ),
      ),
    ).toExist()

    // Tap again to collapse
    await element(by.id(LabsAndTestsE2eIDConstants.ZERO_HOLD_TIME_ALERT_ID)).tap()

    // Toggle flag back off for cleanup
    await toggleRemoteConfigFlag(LabsAndTestsE2eIDConstants.MR_HIDE_36_HR_HOLD_TIMES_TOGGLE_TEXT)
  })
})
