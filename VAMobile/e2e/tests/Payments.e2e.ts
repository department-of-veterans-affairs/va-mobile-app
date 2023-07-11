import { expect, device, by, element, waitFor } from 'detox'
import { CommonE2eIdConstants, loginToDemoMode, backButton, openPayments, openVAPaymentHistory } from './utils'

export const PaymentsE2eIDConstants = {
	PAYMENTS_YEAR_PICKER_ID: 'selectAYearTestID',
	MISSING_PAYMENTS_LINK_ID: 'missingPaymentsTestID',
	PAYMENT_HISTORY_1_ID: '2017-06-01 Regular Chapter 31 $603.33',
	PAYMENT_HISTORY_2_ID: '2017-03-01 Post-9/11 GI Bill $1,172.60',
	PAYMENT_INFO_INCORRECT_ID: 'paymentInfoIncorrectTestID',
}

beforeAll(async () => {
	await loginToDemoMode()
	await openPayments()
	await openVAPaymentHistory()
})

describe('Home Screen', () => {
	it('should match the Payments history page design', async () => {
		await expect(element(by.id(PaymentsE2eIDConstants.MISSING_PAYMENTS_LINK_ID))).toExist()
		await expect(element(by.id(PaymentsE2eIDConstants.PAYMENTS_YEAR_PICKER_ID))).toExist()
		await expect(element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_1_ID))).toExist()
		await expect(element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_2_ID))).toExist()
	})
	
	it('should tap on what if I\'m missing a payment and display the correct information', async () => {
		await element(by.id(PaymentsE2eIDConstants.MISSING_PAYMENTS_LINK_ID)).tap()
		await expect(element(by.text('What if I\'m missing a payment?')).atIndex(1)).toExist()
		if (device.getPlatform() === 'android') {
			await element(by.text('800-827-1000')).tap()
			var tempPath = await device.takeScreenshot('PaymentsMissingAndroidCallingScreen')
			await device.launchApp({newInstance: false})
		} 
		if (device.getPlatform() === 'android') {
			await element(by.text('TTY: 711')).tap()
			var tempPath = await device.takeScreenshot('PaymentsMissingAndroidCallingScreenTTY')
			await device.launchApp({newInstance: false})
		}
		await element(by.text('Close')).tap() 
	})

	it('should tap on a payment and verify the payment details for paper check', async () => {
		await element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_1_ID)).tap()
		await expect(element(by.text('June 1, 2017'))).toExist()
		await expect(element(by.text('Regular Chapter 31'))).toExist()
		await expect(element(by.text('$603.33'))).toExist()
		await expect(element(by.text('Paper Check'))).toExist()
		await expect(element(by.id(PaymentsE2eIDConstants.PAYMENT_INFO_INCORRECT_ID))).toExist()
	})

	it('should tap on what if my payment information doesn\'t look right and display the correct information', async () => {
		await element(by.id(PaymentsE2eIDConstants.PAYMENT_INFO_INCORRECT_ID)).tap()
		await expect(element(by.text('What if my payment information doesn\'t look right?')).atIndex(1)).toExist()
		if (device.getPlatform() === 'android') {
			await element(by.text('800-827-1000')).tap()
			var tempPath = await device.takeScreenshot('PaymentIncorrectAndroidCallingScreen')
			await device.launchApp({newInstance: false})
		} 
		if (device.getPlatform() === 'android') {
			await element(by.text('TTY: 711')).tap()
			var tempPath = await device.takeScreenshot('PaymentIncorrectAndroidCallingScreenTTY')
			await device.launchApp({newInstance: false})
		}
		await element(by.text('Close')).tap() 
		await element(by.text('History')).tap()
	})

	it('should tap on a payment and verify the payment details for direct deposit', async () => {
		await waitFor(element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_2_ID))).toBeVisible().whileElement(by.id('paymentHistoryTestID')).scroll(200, 'down')
		await element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_2_ID)).tap()
		await expect(element(by.text('BANK OF AMERICA, N.A.'))).toExist()
		await expect(element(by.text('********0567'))).toExist()
		await element(by.text('History')).tap()
	})

	it('should tap on and cancel the select a year picker', async () => {
		await element(by.id('paymentHistoryTestID')).scrollTo('top')
		await element(by.id(PaymentsE2eIDConstants.PAYMENTS_YEAR_PICKER_ID)).tap()
		await expect(element(by.text('Select a year'))).toExist()
		await element(by.text('Cancel')).tap()
		await expect(element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_1_ID))).toExist()
	})

	it('should tap on and select 2016 from the select a year picker', async () => {
		await element(by.id(PaymentsE2eIDConstants.PAYMENTS_YEAR_PICKER_ID)).tap()
		await element(by.text('2016')).tap()
		await element(by.text('Done')).tap()
		await expect(element(by.id('2016-12-30 Regular Chapter 31 $603.33'))).toExist()
	})

	it('should verify the next and back page arrows work', async () => {
		await element(by.id('paymentHistoryTestID')).scrollTo('bottom')
		await element(by.id('next-page')).tap()
		await expect(element(by.id('2016-04-01 Regular Chapter 31 $603.33'))).toExist()
		await element(by.id('paymentHistoryTestID')).scrollTo('bottom')
		await element(by.id('previous-page')).tap()
		await expect(element(by.id('2016-12-30 Regular Chapter 31 $603.33'))).toExist()
		await device.uninstallApp()
	})
})
