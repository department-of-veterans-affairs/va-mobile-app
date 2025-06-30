import { by, element, expect } from 'detox'
import { DateTime } from 'luxon'

import { getDateMonthsAgo, getFormattedDate } from '../../src/utils/dateUtils'
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

const todaysDate = DateTime.local()

// Use the utility function to calculate dates
const threeMonthsEarlier = getDateMonthsAgo(3, 'end', 'end')
const fiveMonthsEarlier = getDateMonthsAgo(5, 'start', 'start')

const sixMonthsEarlier = getDateMonthsAgo(6, 'end', 'end')
const eightMonthsEarlier = getDateMonthsAgo(8, 'start', 'start')

const nineMonthsEarlier = getDateMonthsAgo(9, 'end', 'end')
const elevenMonthsEarlier = getDateMonthsAgo(11, 'start', 'start')

const twelveMonthsEarlier = getDateMonthsAgo(12, 'end', 'end')
const fourteenMonthsEarlier = getDateMonthsAgo(14, 'start', 'start')

const resetDateRangeToDefault = async () => {
  await element(by.id('labsAndTestDataRangeTestID')).tap()
  await element(by.text('Past 3 months')).tap()
  await element(by.id('labsAndTestsDateRangeConfirmID')).tap()
}
// These dates must match the dates in the demo data
// Surgical pathology test data with id: 2BCP5BAI6N7NQSAPSVIJ6INQ4A000000
// CH test data with id: e9513940-bf84-4120-ac9c-718f537b00e0
const oneMonthAgo = todaysDate.minus({ months: 1 })
const surgicalPathologyTestDate = getFormattedDate(oneMonthAgo.toISO(), 'MMMM dd, yyyy')
const fortyFiveDaysAgo = todaysDate.minus({ days: 45 })
const chemHemTestDate = getFormattedDate(fortyFiveDaysAgo.toISO(), 'MMMM dd, yyyy')
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
  it('past labs: three months - five months earlier verification', async () => {
    await element(by.id('labsAndTestDataRangeTestID')).tap()
    await element(
      by.text(
        fiveMonthsEarlier.monthShort +
          ' ' +
          fiveMonthsEarlier.year +
          ' - ' +
          threeMonthsEarlier.monthShort +
          ' ' +
          threeMonthsEarlier.year,
      ),
    ).tap()
    await element(by.id('labsAndTestsDateRangeConfirmID')).tap()
  })
  it('past labs: six months - eight months earlier verification', async () => {
    await element(by.id('labsAndTestDataRangeTestID')).tap()
    await element(
      by.text(
        eightMonthsEarlier.monthShort +
          ' ' +
          eightMonthsEarlier.year +
          ' - ' +
          sixMonthsEarlier.monthShort +
          ' ' +
          sixMonthsEarlier.year,
      ),
    ).tap()
    await element(by.id('labsAndTestsDateRangeConfirmID')).tap()
  })

  it('past labs: eleven months - nine months earlier verification', async () => {
    await element(by.id('labsAndTestDataRangeTestID')).tap()
    await element(
      by.text(
        elevenMonthsEarlier.monthShort +
          ' ' +
          elevenMonthsEarlier.year +
          ' - ' +
          nineMonthsEarlier.monthShort +
          ' ' +
          nineMonthsEarlier.year,
      ),
    ).tap()
    await element(by.id('labsAndTestsDateRangeConfirmID')).tap()
  })
  it('past labs: fourteen months - twelve months earlier verification', async () => {
    await element(by.id('labsAndTestDataRangeTestID')).tap()
    await element(
      by.text(
        fourteenMonthsEarlier.monthShort +
          ' ' +
          fourteenMonthsEarlier.year +
          ' - ' +
          twelveMonthsEarlier.monthShort +
          ' ' +
          twelveMonthsEarlier.year,
      ),
    ).tap()
    await element(by.id('labsAndTestsDateRangeConfirmID')).tap()
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
    await element(by.id('labsAndTestsDetailsBackID')).tap()
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
    await element(by.id('labsAndTestsDetailsBackID')).tap()
    // the title should be labs and tests
    await expect(element(by.text(HEADER_TEXT))).toExist()
  })
})
