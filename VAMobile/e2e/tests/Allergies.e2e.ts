/*
Description:
Detox script to verify allergies functionality.
When to update:
This script should be updated whenever new things are added/changed in allergies or if anything is changed in src/store/api/demo/mocks/allergies.json.
*/
import { by, element, expect } from 'detox'

import { checkImages, loginToDemoMode, openAllergyRecords, openHealth, openMedicalRecords } from './utils'

export const AllergiesE2eIdConstants = {
  ALLERGY_1_ID: 'Sulfonamides allergy March 12, 2019',
  ALLERGY_2_ID: 'Penicillins allergy January 10, 2023',
  ALLERGY_3_ID: 'Peanuts allergy May 15, 2022',
  ALLERGY_4_ID: 'Pollen allergy April 10, 2021',
  ALLERGY_5_ID: 'Latex allergy August 20, 2020',
  ALLERGY_6_ID: 'Shellfish allergy November 05, 2021',
  ALLERGY_7_ID: 'Dust allergy December 12, 2020',
  ALLERGIES_DETAILS_BACK_ID: 'allergiesDetailsBackID',
}

beforeAll(async () => {
  await loginToDemoMode()
  await openHealth()
  await openMedicalRecords()
  await openAllergyRecords()
})

describe('Allergies Screen', () => {
  it('should show allergy list content', async () => {
    await expect(element(by.text('Allergies'))).toExist()
    await expect(element(by.id(AllergiesE2eIdConstants.ALLERGY_1_ID))).toExist()
    const defaultAllergyTemplate = await element(by.id(AllergiesE2eIdConstants.ALLERGY_1_ID)).takeScreenshot(
      'defaultAllergyTemplate',
    )
    checkImages(defaultAllergyTemplate)
    const allergy1Text = await element(by.id(AllergiesE2eIdConstants.ALLERGY_1_ID)).getAttributes()
    await expect(element(by.id(AllergiesE2eIdConstants.ALLERGY_2_ID))).toExist()
    await expect(element(by.id(AllergiesE2eIdConstants.ALLERGY_3_ID))).toExist()
    await expect(element(by.id(AllergiesE2eIdConstants.ALLERGY_4_ID))).toExist()
    await expect(element(by.id(AllergiesE2eIdConstants.ALLERGY_5_ID))).toExist()
    await expect(element(by.id(AllergiesE2eIdConstants.ALLERGY_6_ID))).toExist()
    await expect(element(by.id(AllergiesE2eIdConstants.ALLERGY_7_ID))).toExist()
  })

  it('verify details screen fields', async () => {
    await element(by.id(AllergiesE2eIdConstants.ALLERGY_1_ID)).tap()
    await expect(element(by.text('Allergy details'))).toExist()
    await expect(element(by.text('March 12, 2019'))).toExist()
    await expect(element(by.text('Sulfonamides allergy'))).toExist()
    await expect(element(by.text('Medication'))).toExist()
    await expect(element(by.text('Dr. Alicia'))).toExist()
    await expect(element(by.text('None noted'))).toExist()
    await expect(element(by.text('Sulfonamides'))).toExist()
    await expect(
      element(
        by.text(
          'We base this information on your current VA health records. If you have any questions, contact your health care team.',
        ),
      ),
    ).toExist()
  })

  it('should tap on VA allergies and navigate back to the allergies list', async () => {
    await element(by.id(AllergiesE2eIdConstants.ALLERGIES_DETAILS_BACK_ID)).tap()
  })

  it('verify no disclaimer is displayed when all fields are populated', async () => {
    await element(by.id(AllergiesE2eIdConstants.ALLERGY_3_ID)).tap()
    await expect(element(by.text('None noted '))).not.toExist()
    await expect(
      element(
        by.label(
          'We base this information on your current  V-A  health records. If you have any questions, contact your health care team.',
        ),
      ),
    ).not.toExist()
    await element(by.id(AllergiesE2eIdConstants.ALLERGIES_DETAILS_BACK_ID)).tap()
  })

  it('multi-line note for dust allergy', async () => {
    await element(by.id(AllergiesE2eIdConstants.ALLERGY_7_ID)).tap()
    await expect(element(by.text('Even More Dust'))).toExist()
    await element(by.id(AllergiesE2eIdConstants.ALLERGIES_DETAILS_BACK_ID)).tap()
  })
})
