import { expect, device, by, element, waitFor } from 'detox'
import { CommonE2eIdConstants, loginToDemoMode, openVeteransCrisisLine, checkImages} from './utils'
import { setTimeout } from "timers/promises"

export const VCLE2eIdConstants = {
VETERANS_CRISIS_LINE_PAGE_TEXT: 'Veterans Crisis Line',
VCL_URL_LABEL: 'Veterans Crisis Line .net, Takes you to a resource page. This page will open in your device\'s browser',
VCL_HERE_FOR_YOU_LABEL: 'We’re here anytime, day or night – 24 7'
}

beforeAll(async () => {
	await loginToDemoMode()
	await openVeteransCrisisLine()
})

describe('Veterans Crisis Line', () => {
	it('should show some VCL content', async () => {
		await waitFor(element(by.text(VCLE2eIdConstants.VETERANS_CRISIS_LINE_PAGE_TEXT)))
		  .toExist()
		  .withTimeout(2000)

		await expect(element(by.label(VCLE2eIdConstants.VCL_HERE_FOR_YOU_LABEL))).toExist()
	})
	
	it('should verify that Veterans crisis line phone number is there and clickable', async () => {
		await expect(element(by.id('veteransCrisisLineCrisisCallNumberTestID'))).toExist()
		await element(by.id('veteransCrisisLineCrisisCallNumberTestID')).tap()
		if (device.getPlatform() === 'android') {
			await setTimeout(5000)
			var tempPath = await device.takeScreenshot('AndroidCallingScreen')
			await device.launchApp({newInstance: false})
		} else {
			await element(by.text(CommonE2eIdConstants.CANCEL_UNIVERSAL_TEXT)).tap()
		}
	})
	
	it('should verify that Veterans crisis line text number is there and clickable', async () => {
		await expect(element(by.id('veteransCrisisLineTextNumberTestID'))).toExist()
		await element(by.id('veteransCrisisLineTextNumberTestID')).tap()
		await setTimeout(5000)
		var tempPath = await device.takeScreenshot('PhoneMessagingScreen')
		await device.launchApp({newInstance: false})
	})
	
	it('should verify that Veterans crisis chat option is there and clickable', async () => {
		await expect(element(by.id('veteransCrisisLineConfidentialChatTestID'))).toExist()
		await element(by.id('veteransCrisisLineConfidentialChatTestID')).tap()
		await element(by.text(CommonE2eIdConstants.CANCEL_UNIVERSAL_TEXT)).tap()
		await element(by.id('veteransCrisisLineConfidentialChatTestID')).tap()
		await element(by.text(CommonE2eIdConstants.OK_UNIVERSAL_TEXT)).tap()
		await setTimeout(5000)
		var tempPath = await device.takeScreenshot('ChatScreen')
		await device.launchApp({newInstance: false})
	})
	
	it('should verify that Veterans crisis line TTY phone number is there and clickable', async () => {
		await expect(element(by.id('veteransCrisisLineHearingLossNumberTestID'))).toExist()
		await element(by.id('veteransCrisisLineHearingLossNumberTestID')).tap()
		if (device.getPlatform() === 'android') {
			var tempPath = await device.takeScreenshot('AndroidTTYCallingScreen')
			await device.launchApp({newInstance: false})
		} else {
			await element(by.text(CommonE2eIdConstants.CANCEL_UNIVERSAL_TEXT)).tap()
		}
	})
	
	it('should verify that Veterans crisis line link is there and clickable', async () => {
		await expect(element(by.id('veteransCrisisLineGetMoreResourcesTestID'))).toExist()
		await element(by.id('veteransCrisisLineGetMoreResourcesTestID')).tap()
		await element(by.text(CommonE2eIdConstants.CANCEL_UNIVERSAL_TEXT)).tap()
		await element(by.id('veteransCrisisLineGetMoreResourcesTestID')).tap()
		await element(by.text(CommonE2eIdConstants.OK_UNIVERSAL_TEXT)).tap()
		await setTimeout(5000)
		var tempPath = await device.takeScreenshot('VeteransCrisisLineLink')
		await device.launchApp({newInstance: false})
	})
})