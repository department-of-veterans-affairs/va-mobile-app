import { expect, device, by, element, waitFor } from 'detox'
import { CommonE2eIdConstants, loginToDemoMode, backButton } from './utils'

export const HomeE2eIdConstants = {
	GREETING_ID: 'greeting-text',
	PAYMENTS_BTN_ID: 'Payments',
	LOCATION_FINDER_ROW_ID: 'Find a  V-A  location',
	CONTACT_VA_ROW_ID: 'Contact  V-A ',
	COVID_ROW_ID: ' V-A  COVID-19 updates',
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
		await device.takeScreenshot('StartHomeScreen')
		await expect(element(by.text(HomeE2eIdConstants.HOME_PAGE_USER_NAME))).toExist()
		await expect(element(by.text(HomeE2eIdConstants.HOME_PAGE_MILITARY_BRANCH))).toExist()
		await expect(element(by.id(HomeE2eIdConstants.LOCATION_FINDER_ROW_ID))).toExist()
		await expect(element(by.id(HomeE2eIdConstants.CONTACT_VA_ROW_ID))).toExist()
		await expect(element(by.id(HomeE2eIdConstants.COVID_ROW_ID))).toExist()
		await device.takeScreenshot('EndHomeScreen')
	})

})
