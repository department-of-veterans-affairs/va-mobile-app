import { by, device, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openPayments, openVAPaymentHistory } from './utils'

export const PaymentsE2eIDConstants = {
  PAYMENTS_YEAR_PICKER_ID: 'selectAYearTestID',
  MISSING_PAYMENTS_LINK_ID: 'missingPaymentsTestID',
  PAYMENT_HISTORY_1_ID: 'Regular Chapter 31 $603.33',
  PAYMENT_HISTORY_2_ID: 'Post-9/11 GI Bill $1,172.60',
  PAYMENT_INFO_INCORRECT_ID: 'paymentInfoIncorrectTestID',
}

beforeAll(async () => {
  await loginToDemoMode()
  await openPayments()
  await openVAPaymentHistory()
})

describe('Payments Screen', () => {
  it('should match the Payments history page design', async () => {
    await expect(element(by.id(PaymentsE2eIDConstants.MISSING_PAYMENTS_LINK_ID))).toExist()
    await expect(element(by.id(PaymentsE2eIDConstants.PAYMENTS_YEAR_PICKER_ID))).toExist()
    await expect(element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_1_ID)).atIndex(0)).toExist()
    await expect(element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_2_ID))).toExist()
  })

  it("verify what if I'm missing a payment information", async () => {
    await element(by.id(PaymentsE2eIDConstants.MISSING_PAYMENTS_LINK_ID)).tap()
    await expect(element(by.id('paymentsMissingPanelID'))).toExist()
    if (device.getPlatform() === 'android') {
      await device.disableSynchronization()
      await element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).tap()
      await device.takeScreenshot('PaymentsMissingAndroidCallingScreen')
      await device.launchApp({ newInstance: false })
      await element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).tap()
      await device.takeScreenshot('PaymentsMissingAndroidCallingScreenTTY')
      await device.launchApp({ newInstance: false })
      await device.enableSynchronization()
    }
    await element(by.id('paymentsMissingCloseID')).tap()
  })

  it('payment details: verify the payment details for paper check', async () => {
    await element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_1_ID)).atIndex(0).tap()
    await expect(element(by.text('June 1, 2017'))).toExist()
    await expect(element(by.text('Regular Chapter 31'))).toExist()
    await expect(element(by.text('$603.33'))).toExist()
    await expect(element(by.text('Paper Check'))).toExist()
    await expect(element(by.id(PaymentsE2eIDConstants.PAYMENT_INFO_INCORRECT_ID))).toExist()
  })

  it("verify what if my payment information doesn't look right info", async () => {
    await element(by.id(PaymentsE2eIDConstants.PAYMENT_INFO_INCORRECT_ID)).tap()
    await expect(element(by.id('paymentsIssuesPanelID'))).toExist()
    if (device.getPlatform() === 'android') {
      await device.disableSynchronization()
      await element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID)).tap()
      await device.takeScreenshot('PaymentsMissingAndroidCallingScreen')
      await device.launchApp({ newInstance: false })
      await element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID)).tap()
      await device.takeScreenshot('PaymentsMissingAndroidCallingScreenTTY')
      await device.launchApp({ newInstance: false })
      await device.enableSynchronization()
    }
    await element(by.id('paymentIssuesCloseID')).tap()
    await element(by.id('paymentDetailsBackID')).tap()
  })

  it('verify the payment details for direct deposit', async () => {
    await waitFor(element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_2_ID)))
      .toBeVisible()
      .whileElement(by.id('paymentHistoryTestID'))
      .scroll(200, 'down')
    await element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_2_ID)).tap()
    await expect(element(by.text('BANK OF AMERICA, N.A.'))).toExist()
    await expect(element(by.text('********0567'))).toExist()
    await element(by.id('paymentDetailsBackID')).tap()
  })

  it('should tap on and cancel the select a year picker', async () => {
    await element(by.id('paymentHistoryTestID')).scrollTo('top')
    await element(by.id(PaymentsE2eIDConstants.PAYMENTS_YEAR_PICKER_ID)).tap()
    await expect(element(by.text('Select a year'))).toExist()
    await element(by.id('selectAYearCancelTestID')).tap()
    await expect(element(by.text('2017')).atIndex(0)).toExist()
  })

  it('should tap on and select 2016 from the select a year picker', async () => {
    await element(by.id(PaymentsE2eIDConstants.PAYMENTS_YEAR_PICKER_ID)).tap()
    await element(by.text('2016')).tap()
    await element(by.id('selectAYearConfirmTestID')).tap()
    await expect(element(by.text('2016')).atIndex(0)).toExist()
  })

  it('should verify the next and back page arrows work', async () => {
    await element(by.id('paymentHistoryTestID')).scrollTo('bottom')
    await element(by.id('next-page')).tap()
    await element(by.id('paymentHistoryTestID')).scrollTo('bottom')
    await element(by.id('previous-page')).tap()
  })
})
