import { by, element, expect } from 'detox'
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
  await toggleRemoteConfigFlag(CommonE2eIdConstants.LABS_AND_TEST_TOGGLE_TEXT)
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
