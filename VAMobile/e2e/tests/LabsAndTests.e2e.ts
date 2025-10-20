import { by, element, expect } from 'detox'

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

const resetDateRangeToDefault = async () => {
  await element(by.id(LabsAndTestsE2eIDConstants.DATE_RANGE_PICKER_ID)).tap()
  await element(by.text('Last 90 days')).tap()
  await element(by.id(LabsAndTestsE2eIDConstants.DATE_RANGE_CONFIRM_PICKER_ID)).tap()
}
// These dates must match the dates in the demo data
// Surgical pathology test data with id: 2BCP5BAI6N7NQSAPSVIJ6INQ4A000000
// CH test data with id: e9513940-bf84-4120-ac9c-718f537b00e0
const surgicalPathologyTestDate = getFormattedDate('2024-01-23T18:53:14.000-01:00', 'MMMM dd, yyyy')
const chemHemTestDate = getFormattedDate('2024-01-29T18:53:14.000-01:00', 'MMMM dd, yyyy')
const TEST_IDS = {
  LIST_ID: 'LabsAndTestsButtonsListTestID',
  SURGICAL_PATHOLOGY_TEST_ID: 'Surgical Pathology ' + surgicalPathologyTestDate,
  CHEM_HEM_TEST_ID: 'CH ' + chemHemTestDate,
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
  it('90-day period selection verification', async () => {
    await element(by.id(LabsAndTestsE2eIDConstants.DATE_RANGE_PICKER_ID)).tap()
    // Verify "Last 90 days" option exists (index 0)
    await expect(element(by.text('Last 90 days'))).toExist()
    // Select "Last 90 days" to confirm it works
    await element(by.text('Last 90 days')).tap()
    await element(by.id(LabsAndTestsE2eIDConstants.DATE_RANGE_CONFIRM_PICKER_ID)).tap()
  })
})

describe('Labs And Test Screen', () => {
  beforeAll(async () => {
    await resetDateRangeToDefault()
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
    await expect(element(by.text('Surgical Pathology'))).toExist()
    await expect(element(by.text(surgicalPathologyTestDate))).toExist()
    await expect(element(by.text('Bone Marrow'))).toExist()
    await expect(element(by.text('Left leg'))).toExist()
    await expect(element(by.text('VA TEST LAB'))).toExist()

    // ensure base 64 decoded data is present
    await expect(element(by.text('this is a test'))).toExist()

    // Navigate back to the list
    await element(by.id(TEST_IDS.BACK_BUTTON_ID)).tap()
    // the title should be labs and tests
    await expect(element(by.text(HEADER_TEXT))).toExist()
  })

  it('should list the list of labs and tests', async () => {
    await expect(element(by.text(HEADER_TEXT))).toExist()
    await expect(element(by.id(TEST_IDS.LIST_ID))).toExist()
    await expect(element(by.id(TEST_IDS.SURGICAL_PATHOLOGY_TEST_ID))).toExist()
  })
})

describe('Labs And Test Details Screen with Observations', () => {
  it('navigate to detail screen and show results', async () => {
    await expect(element(by.text(HEADER_TEXT))).toExist()
    await expect(element(by.id(TEST_IDS.CHEM_HEM_TEST_ID))).toExist()
    await element(by.id(TEST_IDS.CHEM_HEM_TEST_ID)).tap()
    // the title should be Details
    await expect(element(by.text('Details'))).toExist()

    await expect(element(by.text('CH'))).toExist()
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
