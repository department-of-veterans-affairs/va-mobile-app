import { by, element, expect, waitFor } from 'detox'
import { DateTime } from 'luxon'

import * as api from 'store/api'

import { loginToDemoMode, openHealth, openLabsAndTestRecords, openMedicalRecords } from './utils'

const todaysDate = DateTime.local()

const fiveMonthsEarlier = todaysDate.minus({ months: 5 }).startOf('month').startOf('day')
const threeMonthsEarlier = todaysDate.minus({ months: 3 }).endOf('month').endOf('day')

const eightMonthsEarlier = todaysDate.minus({ months: 8 }).startOf('month').startOf('day')
const sixMonthsEarlier = todaysDate.minus({ months: 6 }).endOf('month').endOf('day')

const elevenMonthsEarlier = todaysDate.minus({ months: 11 }).startOf('month').startOf('day')
const nineMonthsEarlier = todaysDate.minus({ months: 9 }).endOf('month').endOf('day')

const fourteenMonthsEarlier = todaysDate.minus({ months: 14 }).startOf('month').startOf('day')
const twelveMonthsEarlier = todaysDate.minus({ months: 12 }).startOf('month').startOf('day')

const resetDateRangeToDefault = async () => {
  await element(by.id('labsAndTestDataRangeTestID')).tap()
  await element(by.text('Past 3 months')).tap()
  await element(by.id('labsAndTestsDateRangeConfirmID')).tap()
}
const TEST_IDS = {
  LIST_ID: 'LabsAndTestsButtonsListTestID',
  SURGICAL_PATHOLOGY_TEST_ID: 'Surgical Pathology March 14, 2025',
  CHEM_HEM_TEST_ID: 'CH January 23, 2025',
  BACK_BUTTON_ID: 'labsAndTestsDetailsBackID',
}
const HEADER_TEXT = 'Labs and tests'

async function scrollToElement(text: string, containerID: string) {
  await waitFor(element(by.text(text)))
    .toBeVisible()
    .whileElement(by.id(containerID))
    .scroll(200, 'down')
}

beforeAll(async () => {
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
    await expect(element(by.text('March 14, 2019'))).toExist()
    await expect(element(by.text('TESTING BONE MARROW'))).toExist()
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
  const noneNoted = 'None noted'

  it('navigate to detail screen and show results', async () => {
    await expect(element(by.text(HEADER_TEXT))).toExist()
    await expect(element(by.id(TEST_IDS.CHEM_HEM_TEST_ID))).toExist()
    await element(by.id(TEST_IDS.CHEM_HEM_TEST_ID)).tap()
    // the title should be Details
    await expect(element(by.text('Details'))).toExist()

    await expect(element(by.text('CH'))).toExist()
    await expect(element(by.text('January 23, 2025'))).toExist()
    await expect(element(by.text('SERUM'))).toExist()
    await expect(element(by.text('CHYSHR TEST LAB'))).toExist()

    // ensure default value is displayed for all empty strings in data fields
    // getAttributes will return an object with a key 'elements' if multiple elements are matched
    const multipleMatchedElements = await element(by.text(noneNoted)).getAttributes()
    if (!('elements' in multipleMatchedElements)) {
      expect(element(by.text(noneNoted))).toExist()
    } else {
      await expect(element(by.text(noneNoted)).atIndex(0)).toExist()
    }

    await expect(element(by.text('ZZGeorge Washington'))).toExist()

    await scrollToElement('CREATININE', 'labsAndTestsDetailsScreen')
    await expect(element(by.text('CREATININE'))).toExist()

    // go back
    await element(by.id('labsAndTestsDetailsBackID')).tap()
    // the title should be labs and tests
    await expect(element(by.text(HEADER_TEXT))).toExist()
  })
})
