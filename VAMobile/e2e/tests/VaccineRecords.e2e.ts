import { expect, by, element } from 'detox'
import { loginToDemoMode, checkImages, openHealth, openVaccineRecords } from './utils'

export const VaccinesE2eIdConstants = {
  VACCINE_1_ID: 'COVID-19 vaccine January 14, 2021',
  VACCINE_3_ID: 'FLU vaccine May 10, 2018',
  VACCINE_5_ID: 'PneumoPPV vaccine April 28, 2016',
  VACCINE_6_ID: 'FLU vaccine April 28, 2016',
}

beforeAll(async () => {
  await loginToDemoMode()
  await openHealth()
  await openVaccineRecords()
})

describe('Vaccine Records Screen', () => { 
  it('should show vaccine records list content', async () => {
    await expect(element(by.text('VA vaccines'))).toExist()
    await expect(element(by.id(VaccinesE2eIdConstants.VACCINE_1_ID))).toExist()
    var defaultVaccineTemplate = await element(by.id(VaccinesE2eIdConstants.VACCINE_1_ID)).takeScreenshot('defaultVaccineTemplate')
    checkImages(defaultVaccineTemplate)
    await expect(element(by.id(VaccinesE2eIdConstants.VACCINE_3_ID))).toExist()
    await expect(element(by.id(VaccinesE2eIdConstants.VACCINE_5_ID))).toExist()
    await expect(element(by.id(VaccinesE2eIdConstants.VACCINE_6_ID))).toExist()
  })
  
  it('should tap on a COVID-19 record and verify the correct information on the screen is displayed', async () => {
    await element(by.id(VaccinesE2eIdConstants.VACCINE_1_ID)).tap()
    await expect(element(by.text('January 14, 2021'))).toExist()
    await expect(element(by.text('COVID-19 vaccine'))).toExist()
    await expect(element(by.id('Type And Dosage COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose'))).toExist()
    await expect(element(by.id('Manufacturer Moderna US, Inc.'))).toExist()
    await expect(element(by.id('Series status None noted')))
    await expect(element(by.text('Cheyenne VA Medical Center'))).toExist()
    await expect(element(by.text('2360 East Pershing Boulevard'))).toExist()
    await expect(element(by.text('Cheyenne, WY 82001-5356'))).toExist()
    await expect(element(by.text('Reaction'))).toExist()
    await expect(element(by.text('None noted')).atIndex(1)).toExist()
    await expect(element(by.id('Notes Dose #2 of 2 of COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose vaccine administered.'))).toExist()
    await expect(element(by.label('We base this information on your current  V-A  health records. If you have any questions, contact your health care team.'))).toExist()
  })

  it('should tap on VA vaccines and navigate back to the vaccines list', async () => {
    await element(by.text('VA vaccines')).tap()
  })
  
  it('should tap on a non COVID-19 record and verify that no manufacturer info is displayed', async () => {
    await element(by.id(VaccinesE2eIdConstants.VACCINE_3_ID)).tap()
    await expect(element(by.text('Manufacturer'))).not.toExist()
    await element(by.text('VA vaccines')).tap()
  })
})
