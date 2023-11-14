import { expect, device, by, element, waitFor } from 'detox'
import { isTypedArray } from 'util/types'
import { loginToDemoMode, openProfile, openMilitaryInformation, openDismissLeavingAppPopup, CommonE2eIdConstants, backButton, changeMockData, checkImages } from './utils'
import { log } from 'console'
import { setTimeout } from "timers/promises"

export const MilitaryInformationE2eIdConstants = {
  MILITARY_DATE_TEXT: 'July 13, 1970 – August 31, 1998',
  SERVICE_INFORMATION_INCORRECT_TITLE_TEXT: 'What if my military service information doesn\'t look right?',
  SERVICE_INFORMATION_INCORRECT_BODY_LABEL_1: 'Some Veterans have reported seeing military service information in their V-A .gov profiles that doesn’t seem right. When this happens, it’s because there’s an error in the information we’re pulling into V-A .gov from the Defense Enrollment Eligibility Reporting System (D-E-E-R-S).',
  SERVICE_INFORMATION_INCORRECT_BODY_LABEL_2: 'If the military service information in your profile doesn’t look right, please call the Defense Manpower Data Center (D-M-D-C). They’ll work with you to update your information in D-E-E-R-S.',
  SERVICE_INFORMATION_INCORRECT_BODY_LABEL_3: 'To reach the D-M-D-C, call Monday through Friday (except federal holidays), 8:00 a.m. to 8:00 p.m. Eastern Time.',
  SERVICE_NOT_AVAILABLE_PAGE_TITLE_TEXT: 'We can\'t access your military information',
  SERVICE_NOT_AVAILABLE_PAGE_BODY_LABEL: 'We\'re sorry. We can\'t access your military service records. If you think you should be able to review your service information here, please file a request to change or correct your D-D 2 1 4 or other military records.',
}

beforeAll(async () => {
  await loginToDemoMode()
})

export async function verifyMilitaryInfo(militaryBranch) {
	it('should tap through and verify that ' + militaryBranch + ' is shown on the home, profile, and military information page and that the seal is correct', async () => {
		//changing the JSON file is currently causing issues only on iOS. Commenting out this code until it can be fixed
		//await changeMockData('profile.json', ['/v0/military-service-history', 'data', 'attributes', {'serviceHistory': 0}, 'branchOfService'], militaryBranch)
		//await device.launchApp({newInstance: true})
		//await loginToDemoMode()
		var tempPath = await element(by.id(militaryBranch)).takeScreenshot(militaryBranch + 'ImageTestHome')
		checkImages(tempPath)
		await expect(element(by.text(militaryBranch))).toExist()
		await openProfile()
		tempPath = await element(by.id(militaryBranch)).takeScreenshot(militaryBranch + 'ImageTestProfile')
		checkImages(tempPath)
		await expect(element(by.text(militaryBranch))).toExist()
		await openMilitaryInformation()
		await expect(element(by.text(militaryBranch))).toExist()
		await expect(element(by.text(MilitaryInformationE2eIdConstants.MILITARY_DATE_TEXT))).toExist()
	})
}

describe('Military Information Screen', () => { 
	verifyMilitaryInfo('United States Coast Guard')
	//changing the JSON file is currently causing issues only on iOS. Commenting out this code until it can be fixed
	/*verifyMilitaryInfo('United States Army')
	verifyMilitaryInfo('United States Air Force')
	verifyMilitaryInfo('United States Navy')
	verifyMilitaryInfo('United States Marine Corps')*/

	it('should open new screen if military service information is incorrect', async () => {
		await openProfile()
		await openMilitaryInformation()
		await element(by.text(MilitaryInformationE2eIdConstants.SERVICE_INFORMATION_INCORRECT_TITLE_TEXT)).tap()
		await expect(element(by.text(MilitaryInformationE2eIdConstants.SERVICE_INFORMATION_INCORRECT_TITLE_TEXT)).atIndex(1)).toExist()
		await expect(element(by.label(MilitaryInformationE2eIdConstants.SERVICE_INFORMATION_INCORRECT_BODY_LABEL_1))).toExist()
		await expect(element(by.label(MilitaryInformationE2eIdConstants.SERVICE_INFORMATION_INCORRECT_BODY_LABEL_2))).toExist()
		await expect(element(by.label(MilitaryInformationE2eIdConstants.SERVICE_INFORMATION_INCORRECT_BODY_LABEL_3))).toExist()
		await expect(element(by.id('incorrectServiceDMDCNumberTestID'))).toExist()
		await element(by.id('IncorrectServiceTestID')).swipe('up')
		if (device.getPlatform() === 'android') {
			await element(by.id('incorrectServiceDMDCNumberTestID')).tap()
			await setTimeout(5000)
			var tempPath = await device.takeScreenshot('AndroidCallingScreen')
			await device.launchApp({newInstance: false})
		} 
	})

	//changing the JSON file is currently causing issues only on iOS. Commenting out this code until it can be fixed
	/*it('should show correct information if no military service is available', async () => {
		await changeMockData('profile.json', ['/v0/military-service-history', 'data', 'attributes', 'serviceHistory'], [])
		await device.launchApp({newInstance: true})
		await loginToDemoMode()
		await openProfile()
		await openMilitaryInformation()
		await expect(element(by.text(MilitaryInformationE2eIdConstants.SERVICE_NOT_AVAILABLE_PAGE_TITLE_TEXT))).toExist()
		await expect(element(by.label(MilitaryInformationE2eIdConstants.SERVICE_NOT_AVAILABLE_PAGE_BODY_LABEL))).toExist()
	})
	
	it('should reset mock data', async () => {
		await changeMockData('profile.json', ['/v0/military-service-history', 'data', 'attributes', 'serviceHistory'], [{"branchOfService": "United States Coast Guard", "beginDate": "1970-07-13", "endDate": "1998-08-31", "formattedBeginDate": "July 13, 1970", "formattedEndDate": "August 31, 1998"}])
	})*/
})