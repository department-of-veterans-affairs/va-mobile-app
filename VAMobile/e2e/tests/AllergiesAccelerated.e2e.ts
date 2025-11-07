/*
Description:
Detox script to verify allergies functionality.
When to update:
This script should be updated whenever new things are added/changed in allergies or if anything is changed in src/store/api/demo/mocks/allergies.json.
*/
import { by, element, expect } from 'detox'

import { checkImages, loginToDemoMode, openAllergyRecords, openHealth, openMedicalRecords } from './utils'

export const AllergiesE2eIdConstants = {
  ALLERGY_1_ID: 'Penicillins allergy January 10, 2023',
  ALLERGY_2_ID: 'Coconut (substance) allergy November 08, 2024',
  ALLERGY_3_ID: 'Radish (substance) allergy January 01, 1966',
  ALLERGY_4_ID: 'Dust allergy December 22, 2020',
  ALLERGY_5_ID: 'Grass pollen (substance) allergy January 01, 2022',
  ALLERGY_6_ID: 'Penicillin allergy January 01, 2002',
  ALLERGY_7_ID: 'ASPIRIN allergy ',
  ALLERGY_8_ID: 'TRAZODONE allergy ',
  ALLERGIES_DETAILS_BACK_ID: 'allergiesDetailsBackID',
}

beforeAll(async () => {
  await loginToDemoMode()
  await openHealth()
  await openMedicalRecords()
  await openAllergyRecords()
})

describe('Allergies Screen with OH data', () => {
  it('should show V1 allergy list content', async () => {
    await expect(element(by.text('Allergies'))).toExist()
    await expect(element(by.id(AllergiesE2eIdConstants.ALLERGY_8_ID))).toExist()
    const acceleratedAllergyTemplate = await element(by.id(AllergiesE2eIdConstants.ALLERGY_8_ID)).takeScreenshot(
      'acceleratedAllergyTemplate',
    )
    checkImages(acceleratedAllergyTemplate)
    const allergy1Text = await element(by.id(AllergiesE2eIdConstants.ALLERGY_7_ID)).getAttributes()
    await expect(element(by.id(AllergiesE2eIdConstants.ALLERGY_1_ID))).toExist()
    await expect(element(by.id(AllergiesE2eIdConstants.ALLERGY_2_ID))).toExist()
    await expect(element(by.id(AllergiesE2eIdConstants.ALLERGY_3_ID))).toExist()
    await expect(element(by.id(AllergiesE2eIdConstants.ALLERGY_4_ID))).toExist()
    await expect(element(by.id(AllergiesE2eIdConstants.ALLERGY_5_ID))).toExist()
    await expect(element(by.id(AllergiesE2eIdConstants.ALLERGY_6_ID))).toExist()
    await expect(element(by.id(AllergiesE2eIdConstants.ALLERGY_7_ID))).toExist()
  })

  it('verify V1 details screen fields', async () => {
    await element(by.id(AllergiesE2eIdConstants.ALLERGY_2_ID)).tap()
    await expect(element(by.text('Details'))).toExist()
    await expect(element(by.text('November 08, 2024'))).toExist()
    await expect(element(by.text('Coconut (substance) allergy'))).toExist()
    await expect(element(by.text('Food'))).toExist()
    await expect(element(by.text(' Victoria A Borland'))).toExist()
    await expect(element(by.text('Pruritus'))).toExist()
    await expect(element(by.text('Delirium'))).toExist()
    await expect(element(by.text('This allergy duplicates an allergy entered into VistA'))).toExist()
    await expect(
      element(
        by.text(
          'We base this information on your current VA health records. If you have any questions, contact your health care team.',
        ),
      ),
    ).toExist()
  })

  it('should tap on VA allergies and navigate back to the V1 allergies list', async () => {
    await element(by.id(AllergiesE2eIdConstants.ALLERGIES_DETAILS_BACK_ID)).tap()
  })

  it('verify disclaimer is displayed even when all V1 fields are populated', async () => {
    await element(by.id(AllergiesE2eIdConstants.ALLERGY_7_ID)).tap()
    await expect(element(by.text('None noted '))).not.toExist()
    await expect(
      element(
        by.label(
          'We base this information on your current  V-A  health records. If you have any questions, contact your health care team.',
        ),
      ),
    ).toExist()
    await element(by.id(AllergiesE2eIdConstants.ALLERGIES_DETAILS_BACK_ID)).tap()
  })

  it('multi-line note for Dust allergy', async () => {
    await element(by.id(AllergiesE2eIdConstants.ALLERGY_4_ID)).tap()
    await expect(element(by.text('Even More Dust'))).toExist()
    await element(by.id(AllergiesE2eIdConstants.ALLERGIES_DETAILS_BACK_ID)).tap()
  })
})
