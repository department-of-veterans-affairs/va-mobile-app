import { expect, device, by, element, waitFor } from 'detox'
import { isTypedArray } from 'util/types'
import { loginToDemoMode, openProfile, openMilitaryInformation, openDismissLeavingAppPopup, CommonE2eIdConstants, backButton, changeMockData, checkImages } from './utils'
import { log } from 'console'
import { setTimeout } from "timers/promises"

export const MilitaryInformationE2eIdConstants = {
  MILITARY_BRANCH_COAST_GUARD: 'United States Coast Guard',
  MILITARY_BRANCH_ARMY: 'United States Army',
  MILITARY_BRANCH_AIR_FORCE: 'United States Air Force',
  MILITARY_BRANCH_NAVY: 'United States Navy',
  MILITARY_BRANCH_MARINE_CORPS: 'United States Marine Corps',
  MILITARY_DATE_TEXT: 'July 13, 1970 - August 31, 1998',
  SERVICE_INFORMATION_INCORRECT_TITLE_TEXT: 'What if my military service information doesn\'t look right?',
  SERVICE_INFORMATION_INCORRECT_BODY_LABEL: 'Some Veterans have reported seeing military service information in their V-A .gov profiles that doesn’t seem right. When this happens, it’s because there’s an error in the information we’re pulling into V-A .gov from the Defense Enrollment Eligibility Reporting System (DEERS).\n\nIf the military service information in your profile doesn’t look right, please call the Defense Manpower Data Center (D-M-D-C). They’ll work with you to update your information in DEERS.\n\nTo reach the D-M-D-C, call Monday through Friday (except federal holidays), 8:00 a.m. to 8:00 p.m. Eastern Time.',
  SERVICE_NOT_AVAILABLE_PAGE_TITLE_TEXT: 'We can\'t access your military information',
  SERVICE_NOT_AVAILABLE_PAGE_BODY_LABEL: 'We\'re sorry. We can\'t access your military service records. If you think you should be able to review your service information here, please file a request to change or correct your D-D 2 1 4 or other military records.',
  SERVICE_INCORRECT_PAGE_PHONE_NUMBER_LABEL: '8 0 0 5 3 8 9 5 5 2, Dials this number via your device’s call function'
}

beforeAll(async () => {
  await loginToDemoMode()
})

export async function verifyMilitaryInfo(militaryBranch) {
	it('should tap through and verify that ' + militaryBranch + ' is shown on the home, profile, and military information page and that the seal is correct', async () => {
		await changeMockData('profile.json', ['/v0/military-service-history', 'data', 'attributes', {'serviceHistory': 0}, 'branchOfService'], militaryBranch)
		await device.launchApp({newInstance: true})
		await loginToDemoMode()
		tempPath = await element(by.id(militaryBranch)).takeScreenshot(militaryBranch + 'ImageTestHome')
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
	verifyMilitaryInfo('United States Army')
	verifyMilitaryInfo('United States Air Force')
	verifyMilitaryInfo('United States Navy')
	verifyMilitaryInfo('United States Marine Corps')

	it('should open new screen if military service information is incorrect', async () => {
		await openProfile()
		await openMilitaryInformation()
		await element(by.text(MilitaryInformationE2eIdConstants.SERVICE_INFORMATION_INCORRECT_TITLE_TEXT)).tap()
		await expect(element(by.text(MilitaryInformationE2eIdConstants.SERVICE_INFORMATION_INCORRECT_TITLE_TEXT)).atIndex(1)).toExist()
		await expect(element(by.label(MilitaryInformationE2eIdConstants.SERVICE_INFORMATION_INCORRECT_BODY_LABEL))).toExist()
		await expect(element(by.label(MilitaryInformationE2eIdConstants.SERVICE_INCORRECT_PAGE_PHONE_NUMBER_LABEL))).toExist()
		await element(by.id('IncorrectServiceTestID')).swipe('up')
		await element(by.label(MilitaryInformationE2eIdConstants.SERVICE_INCORRECT_PAGE_PHONE_NUMBER_LABEL)).tap()
		if (device.getPlatform() === 'android') {
			await setTimeout(5000)
			var tempPath = await device.takeScreenshot('AndroidCallingScreen')
			await device.launchApp({newInstance: false})
		} else {
			await element(by.text(CommonE2eIdConstants.CANCEL_UNIVERSAL_TEXT)).tap()
		}
	})

	
	it('should show correct information if no military service is available', async () => {
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
	})
})