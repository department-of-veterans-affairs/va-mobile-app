import { expect, device, by, element } from 'detox'
import { CommonE2eIdConstants, loginToDemoMode, checkImages } from './utils'
import { setTimeout } from "timers/promises"

export const HomeE2eIdConstants = {
	PAYMENTS_BTN_ID: 'Payments',
	VETERAN_STATUS_TEXT: 'Proof of Veteran status',
	LOCATION_FINDER_ROW_ID: 'Find a  V-A  location',
	CONTACT_VA_ROW_ID: 'Contact  V-A ',
	COVID_ROW_ID: 'COVID-19 updates',
	HOME_PAGE_USER_NAME: 'Kimberly Washington',
	HOME_PAGE_MILITARY_BRANCH: 'United States Coast Guard',
	CONTACT_VA_TITLE: 'Call My V-A 4 1 1',
	CONTACT_VA_BODY: 'My V-A 4 1 1 is our main V-A information line. We can help connect you to any of our V-A contact centers.',
	WEBVIEW_ID: 'Webview-web'
}

beforeAll(async () => {
	await loginToDemoMode()
})

describe('Home Screen', () => {
	it('should show primary home page content', async () => {
		await expect(element(by.id(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BTN_ID))).toExist()
		await expect(element(by.text(CommonE2eIdConstants.PROFILE_TAB_BUTTON_TEXT))).toExist()
		await expect(element(by.text(HomeE2eIdConstants.HOME_PAGE_USER_NAME))).toExist()
		await expect(element(by.text(HomeE2eIdConstants.HOME_PAGE_MILITARY_BRANCH))).toExist()
		await expect(element(by.text(HomeE2eIdConstants.VETERAN_STATUS_TEXT))).toExist()
		var militaryBadge = await element(by.id('United States Coast Guard')).takeScreenshot('MilitaryServiceBadgeHome')
		checkImages(militaryBadge)
		await expect(element(by.id(HomeE2eIdConstants.LOCATION_FINDER_ROW_ID))).toExist()
		await expect(element(by.id(HomeE2eIdConstants.CONTACT_VA_ROW_ID))).toExist()
		await expect(element(by.id(HomeE2eIdConstants.COVID_ROW_ID))).toExist()
	})

	it('should verify the nav bar at the bottom of the screen is correct', async () => {
		await expect(element(by.text(CommonE2eIdConstants.PROFILE_TAB_BUTTON_TEXT)))
		await expect(element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT))).toExist()
		await expect(element(by.text(CommonE2eIdConstants.BENEFITS_TAB_BUTTON_TEXT))).toExist()
		await expect(element(by.text(CommonE2eIdConstants.HEALTH_TAB_BUTTON_TEXT))).toExist()
		await expect(element(by.text(CommonE2eIdConstants.PAYMENTS_TAB_BUTTON_TEXT))).toExist()
	})

	it('should tap on profile and verify the profile screen tab items are displayed', async () => {
		await element(by.text(CommonE2eIdConstants.PROFILE_TAB_BUTTON_TEXT)).tap()
		await expect(element(by.text(CommonE2eIdConstants.PERSONAL_INFORMATION_ROW_TEXT))).toExist()
		await expect(element(by.text(CommonE2eIdConstants.CONTACT_INFORMATION_TEXT))).toExist()
		await expect(element(by.text(CommonE2eIdConstants.MILITARY_INFORMATION_ROW_TEXT))).toExist()
		await expect(element(by.text(CommonE2eIdConstants.SETTINGS_ROW_TEXT))).toExist()
	})

	it('should tap on home and verify the home screen tab items are displayed', async () => {
		await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).atIndex(1).tap()
		await expect(element(by.id(HomeE2eIdConstants.LOCATION_FINDER_ROW_ID))).toExist()
		await expect(element(by.id(HomeE2eIdConstants.CONTACT_VA_ROW_ID))).toExist()
		await expect(element(by.id(HomeE2eIdConstants.COVID_ROW_ID))).toExist()
	})

	it('should tap on benefits and verify the benefits screen tab items are displayed', async () => {
		await element(by.text(CommonE2eIdConstants.BENEFITS_TAB_BUTTON_TEXT)).tap()
		await expect(element(by.text(CommonE2eIdConstants.DISABILITY_RATING_ROW_TEXT))).toExist()
		await expect(element(by.text(CommonE2eIdConstants.CLAIMS_BUTTON_TEXT))).toExist()
		await expect(element(by.text(CommonE2eIdConstants.LETTERS_ROW_TEXT))).toExist()
	})

	it('should tap on home and verify the home screen tab items are displayed', async () => {
		await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
		await expect(element(by.id(HomeE2eIdConstants.LOCATION_FINDER_ROW_ID))).toExist()
		await expect(element(by.id(HomeE2eIdConstants.CONTACT_VA_ROW_ID))).toExist()
		await expect(element(by.id(HomeE2eIdConstants.COVID_ROW_ID))).toExist()
	})

	it('should tap on health and verify the health screen tab items are displayed', async () => {
		await element(by.text(CommonE2eIdConstants.HEALTH_TAB_BUTTON_TEXT)).tap()
		await expect(element(by.text(CommonE2eIdConstants.APPOINTMENTS_TAB_BUTTON_TEXT))).toExist()
		await expect(element(by.text(CommonE2eIdConstants.PRESCRIPTIONS_BUTTON_TEXT))).toExist()
		await expect(element(by.text(CommonE2eIdConstants.MESSAGES_ROW_TEXT))).toExist()
		await expect(element(by.text(CommonE2eIdConstants.VACCINE_RECORDS_BUTTON_TEXT))).toExist()
		await expect(element(by.text('COVID-19 updates'))).toExist()
	})

	it('should tap on home and verify the home screen tab items are displayed', async () => {
		await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
		await expect(element(by.id(HomeE2eIdConstants.LOCATION_FINDER_ROW_ID))).toExist()
		await expect(element(by.id(HomeE2eIdConstants.CONTACT_VA_ROW_ID))).toExist()
		await expect(element(by.id(HomeE2eIdConstants.COVID_ROW_ID))).toExist()
	})

	it('should tap on payments and verify the payments screen tab items are displayed', async () => {
		await element(by.text(CommonE2eIdConstants.PAYMENTS_TAB_BUTTON_TEXT)).tap()
		await expect(element(by.text(CommonE2eIdConstants.VA_PAYMENT_HISTORY_BUTTON_TEXT))).toExist()
		await expect(element(by.text(CommonE2eIdConstants.DIRECT_DEPOSIT_ROW_TEXT))).toExist()
	})

	it('should tap on home then contact VA', async () => {
		await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
		await element(by.id(HomeE2eIdConstants.CONTACT_VA_ROW_ID)).tap()
		await expect(element(by.text('Call MyVA411'))).toExist()
		await expect(element(by.text('MyVA411 is our main VA information line. We can help connect you to any of our VA contact centers.'))).toExist()
		if (device.getPlatform() === 'android') {
			await element(by.text('800-698-2411')).tap()
			await setTimeout(5000)
			await device.takeScreenshot('ContactVAAndroidCallingScreen')
			await device.launchApp({newInstance: false})
			await element(by.text('TTY: 711')).tap()
			await setTimeout(5000)
			await device.takeScreenshot('ContactVATTYAndroidCallingScreen')
			await device.launchApp({newInstance: false})
		}
	})

	it('should tap on home then find a VA location', async () => {
		await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).atIndex(0).tap()
		try {
			await element(by.text('Skip this update')).tap()
		} catch (e) {} 
		await element(by.id(HomeE2eIdConstants.LOCATION_FINDER_ROW_ID)).tap()
		await setTimeout(5000)
		await device.takeScreenshot('HomeFindAVALocationScreenshot')
	})

	it('should tap on done then VA Covid-19 updates', async () => {
		await element(by.text('Done')).tap()
		await element(by.id(HomeE2eIdConstants.COVID_ROW_ID)).tap()
		await setTimeout(5000)
		await device.takeScreenshot('HomeCovide19Screenshot')
	})

	it('should tap on done and verify the home screen is displayed', async () => {
		await element(by.text('Done')).tap()
		await expect(element(by.id(HomeE2eIdConstants.LOCATION_FINDER_ROW_ID))).toExist()
		await expect(element(by.id(HomeE2eIdConstants.CONTACT_VA_ROW_ID))).toExist()
		await expect(element(by.id(HomeE2eIdConstants.COVID_ROW_ID))).toExist()
	})
})
