import { expect, device, by, element, waitFor } from 'detox'
import { CommonE2eIdConstants, loginToDemoMode, backButton } from './utils'

export const HomeE2eIdConstants = {
	GREETING_ID: 'greeting-text',
	PAYMENTS_BTN_ID: 'Payments',
	LOCATION_FINDER_ROW_LABEL: 'Find a V-A Location, go to V-A Facility Locator',
	CONTACT_VA_ROW_LABEL: 'Contact V-A, go to V-A Contact Information page',
	COVID_ROW_LABEL: 'V﻿A COVID-19 updates, Get the latest COVID-19 updates',
	HOME_PAGE_USER_NAME: 'Kimberly Washington',
	HOME_PAGE_MILITARY_BRANCH: 'United States Coast Guard',
	VETERANS_LINE_ID: 'talk-to-the-veterans-crisis-line-now, Go to Veterans Crisis Line',
	CONTACT_VA_TITLE: 'Call My V-A 4 1 1',
	CONTACT_VA_BODY: 'My V-A 4 1 1 is our main V-A information line. We can help connect you to any of our V-A contact centers.',
	CONTACT_VA_PHONE_NUMBER: '8 0 0 6 9 8 2 4 1 1, Dials this number via your device’s call function',
	CONTACT_VA_TTY: 'TTY: 7 1 1, Dials this number via your device’s call function',
	WEBVIEW_ID: 'Webview-web'
}

beforeAll(async () => {
	await loginToDemoMode()
})

describe('Home Screen', () => {
	it('should show primary home page content', async () => {
		await expect(element(by.label(HomeE2eIdConstants.VETERANS_LINE_ID))).toExist()
		await expect(element(by.text(HomeE2eIdConstants.HOME_PAGE_USER_NAME))).toExist()
		await expect(element(by.text(HomeE2eIdConstants.HOME_PAGE_MILITARY_BRANCH))).toExist()
		await expect(element(by.label(HomeE2eIdConstants.LOCATION_FINDER_ROW_LABEL))).toExist()
		await expect(element(by.label(HomeE2eIdConstants.CONTACT_VA_ROW_LABEL))).toExist()
		await expect(element(by.label(HomeE2eIdConstants.COVID_ROW_LABEL))).toExist()
	})

	it('should open the Contact VA screen when clicked and show the correct info', async () => {
		await element(by.label(HomeE2eIdConstants.CONTACT_VA_ROW_LABEL)).tap()
		await expect(element(by.label(HomeE2eIdConstants.VETERANS_LINE_ID))).toExist()
		await expect(element(by.label(HomeE2eIdConstants.CONTACT_VA_TITLE))).toExist()
		await expect(element(by.label(HomeE2eIdConstants.CONTACT_VA_BODY))).toExist()
		await expect(element(by.label(HomeE2eIdConstants.CONTACT_VA_PHONE_NUMBER))).toExist()
		await expect(element(by.label(HomeE2eIdConstants.CONTACT_VA_TTY))).toExist()
		await backButton()
	})

	it('should open Find a VA location when clicked and show the correct info', async () => {
		await element(by.label(HomeE2eIdConstants.LOCATION_FINDER_ROW_LABEL)).tap()
		await expect(element(by.id(HomeE2eIdConstants.WEBVIEW_ID))).toExist()
		/*if (device.getPlatform() === 'android') {
			const innerElement = web.element(by.web.id(HomeE2eIdConstants.WEBVIEW_ID))
			await expect(innerElement).toHaveText('Find VA locations')
			await expect(element(by.id(HomeE2eIdConstants.WEBVIEW_ID))).toExist()
		} else {
			await expect(element(by.id(HomeE2eIdConstants.WEBVIEW_ID))).toExist()
		}*/
		await backButton()
	})

	it('should open Va Covid-19 updtaes when tapped and show the correct info', async () => {
		await element(by.label(HomeE2eIdConstants.COVID_ROW_LABEL)).tap()
		await expect(element(by.id(HomeE2eIdConstants.WEBVIEW_ID))).toExist()
		/*
		if (device.getPlatform() === 'android') {
			const innerElement = web.element(by.web.id(HomeE2eIdConstants.WEBVIEW_ID))
			await expect(innerElement).toHaveText('Coronavirus FAQs: What Veterans need to know')
			await expect(element(by.id(HomeE2eIdConstants.WEBVIEW_ID))).toExist()
		} else {
			await expect(element(by.id(HomeE2eIdConstants.WEBVIEW_ID))).toExist()
		}*/
		await backButton()
	})
})
