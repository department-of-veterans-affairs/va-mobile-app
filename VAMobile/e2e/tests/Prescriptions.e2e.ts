import { expect, device, by, element, waitFor } from 'detox'
import { loginToDemoMode, changeMockData, openHealth, openPrescriptions, checkImages } from './utils'
import { setTimeout } from "timers/promises"

export const PrescriptionsE2eIdConstants = {
	PRESCRIPTION_REFILL_BUTTON_LABEL: 'Start refill request',
	PRESCRIPTION_TAB_ALL_ID: 'prescriptionAllCountTestID',
	PRESCRIPTION_TAB_PENDING_ID: 'prescriptionPendingCountTestID',
	PRESCRIPTION_TAB_TRACKING_ID: 'prescriptionTrackingCountTestID',
	PRESCRIPTION_FILTER_ID: 'openFilterTestID',
	PRESCRIPTION_FILTER_APPLY_TEXT: 'Apply',
	PRESCRIPTION_FILTER_RESET_ID: 'resetFilterTestID',
	PRESCRIPTION_SORT_ID: 'openSortTestID',
	PRESCRIPTION_REFILL_WARNING_TEXT: 'We can\'t refill some of your prescriptions in the app',
	PRESCRIPTION_ALL_DESCRIPTION_LABEL: 'This list only shows prescriptions filled by  V-A  pharmacies and may not include all your medications.',
	PRESCRIPTION_ALL_NUMBER_OF_PRESCRIPTIONS_TEXT: 'All VA prescriptions (31)',
	PRESCRIPTION_PENDING_NUMBER_OF_PRESCRIPTIONS_TEXT: 'Pending refills (8)',
	PRESCRIPTION_TRACKING_NUMBER_OF_PRESCRIPTION_TEXT: 'Refills with tracking information (5)',
	PRESCRIPTION_STATUS_LABEL_HEADER_TEXT: 'Active: Refill in process',
	PRESCRIPTION_STATUS_LABEL_BODY_LABEL: 'A refill request is being processed by the  V-A  pharmacy. When a prescription is in the Refill in Process status, the Fill Date will show when the prescription will be ready for delivery via mail by a  V-A  Mail Order Pharmacy.',
	PRESCRIPTION_INSTRUCTIONS_TEXT: 'TAKE ONE TABLET BY MOUTH DAILY',
	PRESCRIPTION_REFILLS_LEFT_TEXT: 'Refills left: 2',
	PRESCRIPTION_FILL_DATE_TEXT: 'Fill date: 01/15/2022',
	PRESCRIPTION_VA_FACILITY_TEXT: 'VA facility: DAYT29',
	PRESCRIPTION_DETAILS_LABEL: 'Get prescription details',
	PRESCRIPTION_PENDING_DESCRIPTION_LABEL: 'This list shows refill requests that you have submitted. It also shows refills that the  V-A  pharmacy is processing.',
	PRESCRIPTION_TRACKING_GET_TRACKING_TEXT: 'Get prescription tracking',
	PRESCRIPTION_REFILL_NAME_TEXT: 'AMLODIPINE BESYLATE 10MG TAB',
	PRESCRIPTION_REFILL_DIALOG_YES_TEXT: device.getPlatform() === 'ios' ? 'Request Refill' : 'Request Refill ',
	PRESCRIPTION_REFILL_REQUEST_SUMMARY_LABEL: 'We got your refill requests',
	PRESCRIPTION_REFILL_REQUEST_SUMMARY_HEADER_TEXT: 'Refill request summary',
	PRESCRIPTION_REFILL_REQUEST_SUMMARY_NAME_TEXT: 'AMLODIPINE BESYLATE 10MG TAB',
	PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_1_LABEL: 'We\'re reviewing your refill request. Once approved, the  V-A  pharmacy will process your refill.',
	PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_2_LABEL: 'If you have questions about the status of your refill, contact your provider or local  V-A  pharmacy.',
	PRESCRIPTION_REFILL_REQUEST_SUMMARY_PENDING_BUTTON_LABEL: 'Go to all pending refills',
}

var tempPath

beforeAll(async () => {
  await loginToDemoMode()
  await openHealth()
  await openPrescriptions()
})

export async function validateSort(name, sortBy, sortOrder, firstPrescription, lastPrescription, firstInstance) {
	it('should sort prescription data by ' + name, async () => {
		if (firstInstance) {
			await element(by.id('PrescriptionHistory')).scrollTo('top')
			await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_ID)).tap()
			await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_RESET_ID)).tap()
			await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_APPLY_TEXT)).tap()
		} else {
			await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
			await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
			await element(by.id('previous-page')).tap()
			await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
			await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
			await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
			await element(by.id('previous-page')).tap()
			await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
			await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
			await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
			await element(by.id('previous-page')).tap()
			await element(by.id('PrescriptionHistory')).scrollTo('top')
		}
		await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_SORT_ID)).tap()
		if (firstInstance) {
			tempPath = await element(by.id('sortListTestID')).takeScreenshot('filterSortWrapperBox')
			checkImages(tempPath)
		}
		await element(by.text(sortBy)).tap()
		await element(by.text(sortOrder)).tap()
		await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_APPLY_TEXT)).tap()
		await expect(element(by.text(firstPrescription)).atIndex(0)).toBeVisible()	
		await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
		await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
		await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
		await element(by.id('next-page')).tap()
		await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
		await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
		await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
		await element(by.id('next-page')).tap()
		await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
		await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
		await element(by.id('PrescriptionHistory')).swipe('up', 'fast', 1.0)
		await element(by.id('next-page')).tap()
		await expect(element(by.text(lastPrescription))).toBeVisible()
	})	
}

export async function validateFilter(filterName) {
	it('should filter prescription data by ' + filterName, async () => {
		await element(by.id('PrescriptionHistory')).scrollTo('top')
		await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_ID)).tap()
		if(filterName === 'Transferred' || filterName === 'Unknown') {
			await element(by.id('filterListTestID')).swipe('up', 'fast', 1.0)
		}
		await element(by.text(filterName)).atIndex(0).tap()
		await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_APPLY_TEXT)).tap()
		await expect(element(by.text('Filter by: ' + filterName))).toExist()
		if(filterName === 'Active: Submitted') {
			await expect(element(by.text('There are no matches'))).toExist()
			await expect(element(by.label('We can’t find any  V-A  prescriptions that match your filter selection. Try changing or resetting the filter.'))).toExist()
		} else {
			await expect(element(by.text(filterName)).atIndex(0)).toExist()
		}
	})
}
 
describe('Prescriptions Screen', () => { 
	it('should match the prescription page design', async () => {
		tempPath = await element(by.id('filterSortWrapperBoxTestID')).takeScreenshot('filterSortWrapperBox')
		checkImages(tempPath)
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_BUTTON_LABEL))).toExist()
		await expect(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TAB_ALL_ID))).toExist()
		await expect(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TAB_PENDING_ID))).toExist()
		await expect(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TAB_TRACKING_ID))).toExist()
		await expect(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_ID))).toExist()
		await expect(element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_SORT_ID))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_WARNING_TEXT))).toExist()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_DESCRIPTION_LABEL))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_NUMBER_OF_PRESCRIPTIONS_TEXT))).toExist()
		await waitFor(element(by.label('ADEFOVIR DIPIVOXIL 10MG TAB.'))).toBeVisible().whileElement(by.id('PrescriptionHistory')).scroll(100, 'down')
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0)).toBeVisible()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_INSTRUCTIONS_TEXT))).toBeVisible()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILLS_LEFT_TEXT)).atIndex(0)).toBeVisible()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_FILL_DATE_TEXT)).atIndex(0)).toBeVisible()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_VA_FACILITY_TEXT)).atIndex(0)).toBeVisible()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL)).atIndex(0)).toBeVisible()
	})
	
	it('should open the prescription refill warning label and display the correct information', async () => {
		await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_WARNING_TEXT)).tap()
		await expect(element(by.text('We can\'t refill some of your prescriptions in the app'))).toExist()
		await expect(element(by.label('Some  V-A  health facilities use a new electronic health record system.'))).toExist()
		await expect(element(by.label('Prescriptions affected by this change have a "Transferred" status. You can manage your prescriptions at these facilities using the My  V-A  Health portal.'))).toExist()
		await expect(element(by.label('Go to My  V-A  Health'))).toExist()
		await element(by.label('Go to My  V-A  Health')).tap()
		await element(by.text('Ok')).tap()
		await setTimeout(5000)
		await device.takeScreenshot('PrescriptionVAHealthLink')
		await device.launchApp({newInstance: false})
		await element(by.text('We can\'t refill some of your prescriptions in the app')).tap()
	})
	
	it('should open the status label and display the correct information', async () => {
		await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0).tap()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0)).toExist()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_BODY_LABEL))).toExist()
		await element(by.text('Close')).tap()
	})
	
	it('should open prescription details and give the correct information', async () => {
		await waitFor(element(by.label('ADEFOVIR DIPIVOXIL 10MG TAB.'))).toBeVisible().whileElement(by.id('PrescriptionHistory')).scroll(50, 'down')
		await element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL)).atIndex(0).tap()
		await expect(element(by.text('ACETAMINOPHEN 325MG TAB'))).toExist()
		await expect(element(by.label('Prescription number 2 7 2 0 1 9 2 A'))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT))).toExist()
		await expect(element(by.text('TAKE ONE TABLET BY MOUTH DAILY'))).toExist()
		await expect(element(by.text('Refills left'))).toExist()
		await expect(element(by.text('2'))).toExist()
		await expect(element(by.text('Fill date'))).toExist()
		await expect(element(by.text('01/15/2022'))).toExist()
		await expect(element(by.text('Quantity'))).toExist()
		await expect(element(by.text('10'))).toExist()
		await expect(element(by.text('Expires on'))).toExist()
		await expect(element(by.text('10/28/2022'))).toExist()
		await expect(element(by.text('Ordered on'))).toExist()
		await expect(element(by.text('10/27/2021'))).toExist()
		await expect(element(by.text('VA facility'))).toExist()
		await expect(element(by.text('DAYT29'))).toExist()
	})
	
	it('should open the status label from the prescription details and display the correct information', async () => {
		await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0).tap()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0)).toExist()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_BODY_LABEL))).toExist()
		await element(by.text('Close')).tap()
		await element(by.label('Prescriptions')).atIndex(0).tap()
	})
	
	validateFilter('Active')
	validateFilter('Active: On hold')
	validateFilter('Active: Parked')
	validateFilter('Active: Refill in process')
	validateFilter('Active: Submitted')
	validateFilter('Discontinued')
	validateFilter('Expired')
	validateFilter('Transferred')
	validateFilter('Unknown')
	
	it('should reset filters and match the original prescription page design', async () => {
		await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_ID)).tap()
		tempPath = await element(by.id('filterListTestID')).takeScreenshot('filterSortWrapperBox')
		checkImages(tempPath)
		await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_RESET_ID)).tap()
		await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_APPLY_TEXT)).tap()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_DESCRIPTION_LABEL))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_NUMBER_OF_PRESCRIPTIONS_TEXT))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0)).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_INSTRUCTIONS_TEXT))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILLS_LEFT_TEXT)).atIndex(0)).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_FILL_DATE_TEXT)).atIndex(0)).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_VA_FACILITY_TEXT)).atIndex(0)).toExist()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL)).atIndex(0)).toExist()
	})
	
	it('should open filters, press cancel, and match the original prescription page design', async () => {
		await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_ID)).tap()
		await element(by.text('Cancel')).tap()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_DESCRIPTION_LABEL))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_NUMBER_OF_PRESCRIPTIONS_TEXT))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0)).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_INSTRUCTIONS_TEXT))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILLS_LEFT_TEXT)).atIndex(0)).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_FILL_DATE_TEXT)).atIndex(0)).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_VA_FACILITY_TEXT)).atIndex(0)).toExist()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL)).atIndex(0)).toExist()
	})
	
	it('should open sort, press cancel, and match the original prescription page design', async () => {
		await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_SORT_ID)).tap()
		await element(by.text('Cancel')).tap()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_DESCRIPTION_LABEL))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_ALL_NUMBER_OF_PRESCRIPTIONS_TEXT))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0)).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_INSTRUCTIONS_TEXT))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILLS_LEFT_TEXT)).atIndex(0)).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_FILL_DATE_TEXT)).atIndex(0)).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_VA_FACILITY_TEXT)).atIndex(0)).toExist()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL)).atIndex(0)).toExist()
	})
	
	it('should match the prescription pending tab design', async () => {
		await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TAB_PENDING_ID)).tap()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_PENDING_DESCRIPTION_LABEL))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_PENDING_NUMBER_OF_PRESCRIPTIONS_TEXT))).toExist()
	})
	
	it('should open the filter and display the appropriate filters for pending', async () => {
		await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_ID)).tap()
		await expect(element(by.text('All'))).toExist()
		await expect(element(by.text('Active: Refill in process'))).toExist()
		await expect(element(by.text('Active: Submitted'))).toExist()
		await expect(element(by.text('Active')).atIndex(0)).not.toExist()
		await expect(element(by.text('Active: On hold'))).not.toExist()
		await expect(element(by.text('Active: Parked'))).not.toExist()
		await expect(element(by.text('Discontinued'))).not.toExist()
		await expect(element(by.text('Expired'))).not.toExist()
		await expect(element(by.text('Transferred'))).not.toExist()
		await expect(element(by.text('Unknown'))).not.toExist()
		await element(by.text('Cancel')).tap()
	})
	
	it('should display the appropriate prescription status\'s for pending', async () => {
		if(device.getPlatform() === 'android') {
			await changeMockData('prescriptions.json', ['/v0/health/rx/prescriptions', {'data': 1}, 'attributes', 'refillStatus'], 'submitted')
			await device.launchApp({newInstance: true})
			await loginToDemoMode()
			await openHealth()
			await openPrescriptions()
			await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TAB_PENDING_ID)).tap()
			// await expect(element(by.text('Active: Submitted')).atIndex(0)).toExist() Rachael said she would fix this one
		} else {
			await device.launchApp({newInstance: true})
			await loginToDemoMode()
			await openHealth()
			await openPrescriptions()
			await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TAB_PENDING_ID)).tap()
		}
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_STATUS_LABEL_HEADER_TEXT)).atIndex(0)).toExist()
		await expect(element(by.text('Active: On hold'))).not.toExist()
		await expect(element(by.text('Active: Parked'))).not.toExist()
		await expect(element(by.text('Discontinued'))).not.toExist()
		await expect(element(by.text('Expired'))).not.toExist()
		await expect(element(by.text('Non verified'))).not.toExist()
		await expect(element(by.text('Transferred'))).not.toExist()
		await expect(element(by.text('Unknown'))).not.toExist()
	})

	it('should match the prescription tracking tab design', async () => {
		await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TAB_TRACKING_ID)).tap()
		await expect(element(by.label('This list shows refills with current tracking information available.'))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_NUMBER_OF_PRESCRIPTION_TEXT))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_GET_TRACKING_TEXT)).atIndex(0)).toExist()
	})
	
	it('should open prescription tracking and display the correct information', async () => {
		await waitFor(element(by.label('IODOQUINOL 650MG TAB.'))).toBeVisible().whileElement(by.id('PrescriptionHistory')).scroll(50, 'down')
		await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_TRACKING_GET_TRACKING_TEXT)).atIndex(0).tap()
		await expect(element(by.label('Prescription number 3 6 3 6 8 5 6'))).toExist()
		await expect(element(by.text('We share tracking information here for up to 15 days, even if you\'ve received your prescription.'))).toExist()
		await expect(element(by.text('If the delivery service changes, we may change or delete the tracking number. If you have questions, contact your local VA pharmacy.'))).toExist()
		await expect(element(by.text('Tracking number'))).toExist()
		await expect(element(by.label('7 5 3 4 5 3 3 6 3 6 8 5 6'))).toExist()
		await expect(element(by.text('Delivery service: DHL'))).toExist()
		await expect(element(by.label('Date shipped: June 14, 2022'))).toExist()
		await expect(element(by.text('Other prescriptions in this package:'))).toExist()
		await expect(element(by.text('LAMIVUDINE 10MG TAB'))).toExist()
		await expect(element(by.label('Prescription number 2 3 3 6 8 0 0'))).toExist()
		await expect(element(by.text('ZIDOVUDINE 1MG CAP'))).toExist()
		await expect(element(by.label('Prescription number None noted'))).toExist()		
	})
	
	it('should open a webpage to the carriers site if you click on the tracking information', async () => {
		await element(by.label('7 5 3 4 5 3 3 6 3 6 8 5 6')).tap()
		await element(by.text('Ok')).tap()
		await setTimeout(5000)
		await device.takeScreenshot('PrescriptionTrackingWebsite')
		await device.launchApp({newInstance: false})
		await element(by.text('Close')).tap()
	})
	
	it('should open the prescriptions help model and display the correct information', async () => {
		await element(by.text('Help')).tap()
		tempPath = await element(by.id('PrescriptionsHelpTestID')).takeScreenshot('PrescriptionHealth')
		checkImages(tempPath)
		await expect(element(by.text('This list may not include all your medications '))).toExist()
		await expect(element(by.text('Medications not included:'))).toExist()
		await expect(element(by.text('New prescriptions not yet processed by a VA pharmacy'))).toExist()
		await expect(element(by.text('Prescriptions filled at non-VA pharmacies'))).toExist()
		await expect(element(by.text('Prescriptions that are inactive for more than 180 days'))).toExist()
		await expect(element(by.text('Medications administered at a clinic or ER'))).toExist()
		await expect(element(by.text('Self-entered medications'))).toExist()
		await expect(element(by.label('If you have questions about your  V-A  prescriptions, call the  V-A  pharmacy number on your prescription label.'))).toExist()
		await element(by.text('Close')).tap()
	})
	
	it('should open the refill request screen and display the correct information', async () => {
		await element(by.id('PrescriptionHistory')).scrollTo('top')
		await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TAB_ALL_ID)).tap()
		await element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_BUTTON_LABEL)).tap()
		await expect(element(by.text('Refill request'))).toExist()
		await expect(element(by.text('Request refills at least 15 days before you need more medication.'))).toExist()
		await expect(element(by.text('We\'ll mail your refills to the address on file at your local VA Pharmacy.'))).toExist()
		await expect(element(by.text('Prescriptions for refill (10)'))).toExist()
		await expect(element(by.label('0 of 10 selected'))).toExist()
		await expect(element(by.label('Select all'))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_NAME_TEXT)).atIndex(0)).toExist()
		await expect(element(by.label('Prescription number 3 6 3 6 7 1 1 A.')).atIndex(0)).toExist()
		await expect(element(by.label('Refills left: 5.')).atIndex(0)).toExist()
		await expect(element(by.label('Fill date June 06, 2022.')).atIndex(0)).toExist()
		await expect(element(by.label(' V-A  facility: SLC10 TEST LAB.')).atIndex(0)).toExist()
	})

	it('should display an error when you select request refills with nothing selected', async () => {
		await element(by.label('Request refills')).tap()
		await expect(element(by.label('Please select a prescription'))).toExist()		
	})
	
	it('should display an action sheet when a refill is selected and request refill is tapped', async () => {
		await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_NAME_TEXT)).atIndex(0).tap()
		await element(by.text('Request refill')).tap()
		await expect(element(by.text('Request prescription refill?'))).toExist()
		if (device.getPlatform() === 'android') {
			await element(by.text('Cancel ')).tap()
		} else {
			await element(by.label('Cancel')).atIndex(1).tap()
		}	
	})
	
	it('should refill a prescription and display the correct information in the refill request summary screen', async () => {
		await element(by.label('Request refill')).tap()
		await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_DIALOG_YES_TEXT)).tap()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_LABEL))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_HEADER_TEXT))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_NAME_TEXT)).atIndex(0)).toExist()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_1_LABEL))).toExist()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_2_LABEL))).toExist()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_PENDING_BUTTON_LABEL))).toExist()
	})
	
	it('should go to pending refills when the pending refills button is tapped', async () => {
		await element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_PENDING_BUTTON_LABEL)).tap()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_PENDING_DESCRIPTION_LABEL))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_PENDING_NUMBER_OF_PRESCRIPTIONS_TEXT))).toExist()
	})
	
	it('should allow the user to request a refill from the get prescriptions detail screen', async () => {
		await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_TAB_ALL_ID)).tap()
		await element(by.id(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_ID)).tap()
		await element(by.text('Active')).atIndex(0).tap()
		await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_FILTER_APPLY_TEXT)).tap()
		await waitFor(element(by.label('CAPECITABINE 500MG TAB.'))).toBeVisible().whileElement(by.id('PrescriptionHistory')).scroll(50, 'down')
		await element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_DETAILS_LABEL)).atIndex(0).tap()
		await element(by.label('Request refill')).tap()
		await element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_DIALOG_YES_TEXT)).tap()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_LABEL))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_HEADER_TEXT))).toExist()
		await expect(element(by.text(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_NAME_TEXT)).atIndex(0)).toExist()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_1_LABEL))).toExist()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_DESCRIPTION_2_LABEL))).toExist()
		await expect(element(by.label(PrescriptionsE2eIdConstants.PRESCRIPTION_REFILL_REQUEST_SUMMARY_PENDING_BUTTON_LABEL))).toExist()
	})
	
	it('verifies that tapping close brings you to the screen prior to the refill model', async () => {
		await element(by.text('Close')).tap()
		await expect(element(by.text('AMLODIPINE BESYLATE 10MG TAB'))).toExist()
		await element(by.text('Prescriptions')).tap()
	})
	
	validateSort('facility name A to Z', 'Facility name', 'A to Z', 'OLANZAPINE 10MG RAPID DISINTEGRATING TAB', 'ZIDOVUDINE 10MG CAP', true)
	validateSort('facility name Z to A', 'Facility name', 'Z to A', 'ZIDOVUDINE 10MG CAP', 'OLANZAPINE 10MG RAPID DISINTEGRATING TAB', false)
	validateSort('fill date oldest to newest', 'Fill date', 'Oldest to newest', 'PEGFILGRASTIM 6MG/0.6ML', 'LAMIVUDINE 10MG TAB', false)
	validateSort('fill date newest to oldest', 'Fill date', 'Newest to oldest', 'LAMIVUDINE 10MG TAB', 'PEGFILGRASTIM 6MG/0.6ML', false)
	validateSort('medication name A to Z', 'Medication name', 'A to Z', 'ACETAMINOPHEN 325MG TAB', 'ZIPRASIDONE HCL 40MG CAP', false)
	validateSort('medication name Z to A', 'Medication name', 'Z to A', 'ZIPRASIDONE HCL 40MG CAP', 'ACETAMINOPHEN 325MG TAB', false)
	validateSort('refills left high to low', 'Refills left', 'High to low', 'BERNA VACCINE CAP B/P', 'ATORVASTATIN CALCIUM 10MG TAB', false)
	validateSort('refills left low to high', 'Refills left', 'Low to high', 'ATORVASTATIN CALCIUM 10MG TAB', 'BERNA VACCINE CAP B/P', false)
	
	it('should reset mock data', async () => {
		await changeMockData('prescriptions.json', ['/v0/health/rx/prescriptions', {'data': 1}, 'attributes', 'refillStatus'], 'refillinprocess')
		await device.launchApp({newInstance: true})
		await loginToDemoMode()
	    await openHealth()
	    await openPrescriptions()
	})
})

