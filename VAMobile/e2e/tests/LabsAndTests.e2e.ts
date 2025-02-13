import { by, element } from 'detox'
import { DateTime } from 'luxon'

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

beforeAll(async () => {
  await loginToDemoMode()
  await openHealth()
  await openMedicalRecords()
  await openLabsAndTestRecords()
})

describe('Labs And Test Screen', () => {
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
