import { expect, device, by, element, waitFor } from 'detox'
import { isTypedArray } from 'util/types'
import { loginToDemoMode, openHealth, CommonE2eIdConstants, backButton, openAppointments, changeMockData } from './utils'
import { log } from 'console'
import { setTimeout } from "timers/promises"
import { DateTime } from 'luxon'

var monthsinYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const Appointmentse2eConstants = {
	APPOINTMENT_DESCRIPTION: 'Here are your appointments. This list includes appointments you\'ve requested but not yet confirmed.',
	APPOINTMENT_1_ID: 'Confirmed Thursday, June 2, 2022 8:00 PM EDT Outpatient Clinic',
	APPOINTMENT_2_ID: 'Confirmed Thursday, June 16, 2022 4:26 PM EDT Community Clinic Association',
	APPOINTMENT_3_ID: 'Canceled COVID-19 vaccine Tuesday, September 6, 2022 12:53 PM PDT VA Long Beach Healthcare System In-person',
	APPOINTMENT_4_ID: 'Pending Optometry (routine eye exam) Vilasini Reddy Request type: In-person', 
	APPOINTMENT_5_ID: 'Pending Optometry (routine eye exam) Community care Request type: In-person',
	APPOINTMENT_6_ID: 'Canceled Optometry (routine eye exam) Community care Request type: In-person',
	APPOINTMENT_7_ID: 'Canceled  Community care Request type: In-person',
	APPOINTMENT_8_ID: 'Pending Primary Care Cheyenne VA Medical Center Request type: In-person',
	ADD_TO_CALENDAR_ID: 'addToCalendarTestID',
	GET_DIRECTIONS_ID: 'directionsTestID',
	PHONE_NUMBER_ASSISTANCE_LINK_ID: 'CallVATestID',
	PHONE_NUMBER_ID: 'CallTTYTestID',
	PATIENT_CANCELLATION: 'You canceled this appointment.',
	VA_PAST_APPOINTMENT: 'To schedule another appointment, please visit VA.gov or call your VA medical center.',
	PAST_APPOINTMENT_1_ID: 'Pending Primary Care Community care Request type: In-person',
	PAST_APPOINTMENT_2_ID: 'Canceled Primary Care Cheyenne VA Medical Center Request type: In-person',
	DATE_RANGE_INITIAL_TEXT: 'Past 3 months',
}

const todaysDate = DateTime.local()

const fiveMonthsEarlier = todaysDate.minus({ months: 5 }).startOf('month').startOf('day')
const threeMonthsEarlier = todaysDate.minus({ months: 3 })
const eightMonthsEarlier = todaysDate.minus({ months: 8 }).startOf('month').startOf('day')
const sixMonthsEarlier = todaysDate.minus({ months: 6 }).endOf('month').endOf('day')
const elevenMonthsEarlier = todaysDate.minus({ months: 11 }).startOf('month').startOf('day')
const nineMonthsEarlier = todaysDate.minus({ months: 9 }).endOf('month').endOf('day')
const currentYear = todaysDate.get('year')
const firstDayCurrentYear = todaysDate.set({ month: 1, day: 1, hour: 0, minute: 0, millisecond: 0 })
const lastYearDateTime = todaysDate.minus({ years: 1 })
const lastYear = lastYearDateTime.get('year')
  
beforeAll(async () => {
  await loginToDemoMode()
  await openHealth()
  await openAppointments()
  await waitFor(element(by.text('Upcoming'))).toExist().withTimeout(10000)
})

describe('Appointments Screen', () => { 
	it('should match the appointments page design', async () => {
		await expect(element(by.text(Appointmentse2eConstants.APPOINTMENT_DESCRIPTION))).toExist()
		await expect(element(by.id(Appointmentse2eConstants.APPOINTMENT_1_ID))).toExist()
		await expect(element(by.id(Appointmentse2eConstants.APPOINTMENT_2_ID))).toExist()
		await expect(element(by.id(Appointmentse2eConstants.APPOINTMENT_3_ID))).toExist()
		await expect(element(by.id(Appointmentse2eConstants.APPOINTMENT_4_ID))).toExist()
		await expect(element(by.id(Appointmentse2eConstants.APPOINTMENT_5_ID))).toExist()
		await expect(element(by.id(Appointmentse2eConstants.APPOINTMENT_6_ID))).toExist()
		await expect(element(by.id(Appointmentse2eConstants.APPOINTMENT_7_ID))).toExist()
		await expect(element(by.id(Appointmentse2eConstants.APPOINTMENT_8_ID))).toExist()
	})
	
	it('should open appointment details and give the correct information', async () => {
		await element(by.id(Appointmentse2eConstants.APPOINTMENT_1_ID)).tap()
		await expect(element(by.text('Community care'))).toExist()
		await expect(element(by.id('Thursday, June 2, 2022 8:00 PM EDT'))).toExist()
		await expect(element(by.id(Appointmentse2eConstants.ADD_TO_CALENDAR_ID)).atIndex(0)).toExist()
		await expect(element(by.id('Outpatient Clinic 2341 North Ave Commerce, CA 90022'))).toExist()
		await expect(element(by.id(Appointmentse2eConstants.GET_DIRECTIONS_ID)).atIndex(0)).toExist()
		await expect(element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ID)).atIndex(0)).toExist()
		await expect(element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ASSISTANCE_LINK_ID)).atIndex(0)).toExist()
		await expect(element(by.text('instructions to veteran.  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx123'))).toExist()
		await expect(element(by.text('Do you need to cancel?'))).toExist()
		await expect(element(by.text('Call your community care provider. You can\'t cancel community care appointments online.'))).toExist()
		await expect(element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ID)).atIndex(1)).toExist()
		await expect(element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ASSISTANCE_LINK_ID)).atIndex(1)).toExist()
	})
	
	it('should tap and open the appointment details links', async() => {
		if (device.getPlatform() === 'android') {
			await element(by.id(Appointmentse2eConstants.ADD_TO_CALENDAR_ID)).atIndex(0).tap()
			await device.takeScreenshot('appointmentCalendar')
			await device.launchApp({newInstance: false})
			
			await element(by.id(Appointmentse2eConstants.GET_DIRECTIONS_ID)).atIndex(0).tap()
			await element(by.text(CommonE2eIdConstants.OK_UNIVERSAL_TEXT)).tap()
			await device.takeScreenshot('appointmentGetDirections')
			await device.launchApp({newInstance: false})
			
			await element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ID)).atIndex(0).tap()
			await device.takeScreenshot('appointmentVALocationPhoneNumber')
			await device.launchApp({newInstance: false})
			
			await element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ASSISTANCE_LINK_ID)).atIndex(0).tap()
			await device.takeScreenshot('apointmentVALocationTTY')
			await device.launchApp({newInstance: false})
			
			await element(by.id('UpcomingApptDetailsTestID')).scrollTo('bottom')
			
			await element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ID)).atIndex(1).tap()
			await device.takeScreenshot('appointmentCancelPhoneNumber')
			await device.launchApp({newInstance: false})
			
			await element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ASSISTANCE_LINK_ID)).atIndex(1).tap()
			await device.takeScreenshot('appointmentCancelTTY')
			await device.launchApp({newInstance: false})
		}		
	})
	
	it('should cancel an appointment and dismiss the dialog', async() => {
		await element(by.text('Appointments')).tap()
		await waitFor(element(by.id(Appointmentse2eConstants.APPOINTMENT_4_ID))).toBeVisible().whileElement(by.id('appointmentsTestID')).scroll(100, 'down')
		await element(by.id(Appointmentse2eConstants.APPOINTMENT_4_ID)).tap()
		await element(by.id('UpcomingApptDetailsTestID')).scrollTo('bottom')
		await element(by.id('Cancel request')).tap()
		if (device.getPlatform() === 'android') {
			await element(by.text('YES, CANCEL')).tap()
		} else {
			await element(by.text('Yes, Cancel Request')).tap()
		}
		await expect(element(by.text('Pending request canceled'))).toExist()
		await element(by.text('Dismiss')).tap()
	})
	
	it('should tap on the canceled appointment and verify the appointment details/links', async() => {
		await waitFor(element(by.id('Canceled Optometry (routine eye exam) Vilasini Reddy Request type: In-person'))).toBeVisible().whileElement(by.id('appointmentsTestID')).scroll(50, 'down')
		await element(by.id('Canceled Optometry (routine eye exam) Vilasini Reddy Request type: In-person')).tap()
		await expect(element(by.text('Test clinic 2 canceled this appointment.'))).toExist()
		await expect(element(by.text('Canceled request for Optometry (routine eye exam) appointment'))).toExist()
		await expect(element(by.text('Vilasini Reddy'))).toExist()
		await expect(element(by.id('Test clinic 2 123 Sesame St. Cheyenne, VA 20171'))).toExist()
		
		if (device.getPlatform() == 'android') {
			await element(by.id(Appointmentse2eConstants.GET_DIRECTIONS_ID)).atIndex(0).tap()
			await element(by.text(CommonE2eIdConstants.OK_UNIVERSAL_TEXT)).tap()
			await setTimeout(5000)
			await device.takeScreenshot('appointmentGetDirections')
			await device.launchApp({newInstance: false})
			await expect(element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ID)).atIndex(0)).toExist()
			await setTimeout(5000)
			await device.takeScreenshot('appointmentVALocationPhoneNumber')
			await device.launchApp({newInstance: false})
			
			await expect(element(by.id(Appointmentse2eConstants.PHONE_NUMBER_ASSISTANCE_LINK_ID)).atIndex(0)).toExist()
			await setTimeout(5000)
			await device.takeScreenshot('apointmentVALocationTTY')
			await device.launchApp({newInstance: false})
		}
		await element(by.id('UpcomingApptDetailsTestID')).scrollTo('bottom')
		
		await expect(element(by.text('Preferred date and time'))).toExist()
		await expect(element(by.text('10/01/2022 in the afternoon'))).toExist()
		await expect(element(by.text('10/01/2022 in the afternoon'))).toExist()
		await expect(element(by.text('Preferred type of appointment'))).toExist()
		await expect(element(by.text('Office visit'))).toExist()
		await expect(element(by.text('Your contact details'))).toExist()
		await expect(element(by.text('Email: samatha.girla@va.gov'))).toExist()
		await expect(element(by.text('Phone Number: (703) 652-0000'))).toExist()
		await expect(element(by.text('Call: Afternoon,Evening,Morning'))).toExist()
		await element(by.text('Appointments')).tap()
		await expect(element(by.id(Appointmentse2eConstants.APPOINTMENT_1_ID))).toExist()
	})
	
	it('should tap on and show past appointments', async() => {
		await element(by.id('appointmentsTestID')).scrollTo('top')
		await element(by.id('Past')).tap()
		await expect(element(by.id(Appointmentse2eConstants.PAST_APPOINTMENT_1_ID))).toExist()
		await expect(element(by.id(Appointmentse2eConstants.PAST_APPOINTMENT_2_ID))).toExist()
		if (device.getPlatform() === 'android') {
		  await expect(element(by.text(Appointmentse2eConstants.DATE_RANGE_INITIAL_TEXT)).atIndex(0)).toExist()
	    } else {
		  await expect(element(by.text(Appointmentse2eConstants.DATE_RANGE_INITIAL_TEXT))).toExist()
		}
	})
	
	it('should show the same date field after cancelling', async() => {		
		await element(by.id('getDateRangeTestID')).tap()
		if(device.getPlatform() === 'android') {
			await element(by.text('Past 3 months')).atIndex(0).tap()
			await element(by.text('Cancel')).tap()
		    await expect(element(by.text('Past 3 months')).atIndex(0)).toExist()
		} else {
			await element(by.text('Cancel')).tap()
			await expect(element(by.text('Past 3 months'))).toExist()
		}
	})
	
	it('should show appointments from three months earlier to five months earlier', async() => {		
		await element(by.id('getDateRangeTestID')).tap()
		await element(by.text(fiveMonthsEarlier.monthShort + ' ' +  fiveMonthsEarlier.year + ' - ' +  threeMonthsEarlier.monthShort + ' ' + threeMonthsEarlier.year)).tap()
		await element(by.text('Done')).tap()
	})
	
	it('should show appointments from six months earlier to eight months earlier', async() => {		
		await element(by.id('getDateRangeTestID')).tap()
		await element(by.text(eightMonthsEarlier.monthShort + ' ' +  eightMonthsEarlier.year + ' - ' +  sixMonthsEarlier.monthShort + ' ' + sixMonthsEarlier.year)).tap()
		await element(by.text('Done')).tap()
	})
	
	it('should show appointments from eleven months earlier to nine months earlier', async() => {		
		await element(by.id('getDateRangeTestID')).tap()
		await element(by.text(elevenMonthsEarlier.monthShort + ' ' +  elevenMonthsEarlier.year + ' - ' +  nineMonthsEarlier.monthShort + ' ' + nineMonthsEarlier.year)).tap()
		await element(by.text('Done')).tap()
	})
	
	it('should show appointments for all of the current year', async() => {		
		await element(by.id('getDateRangeTestID')).tap()
		await element(by.text('All of ' + currentYear)).tap()
		await element(by.text('Done')).tap()
	})
	
	it('should show appointments for all of the previous year', async() => {		
		await element(by.id('getDateRangeTestID')).tap()
		await element(by.text('All of ' + lastYear)).tap()
		await element(by.text('Done')).tap()
	})
})
