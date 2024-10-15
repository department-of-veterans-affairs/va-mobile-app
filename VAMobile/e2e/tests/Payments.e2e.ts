import { by, device, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants, loginToDemoMode, openPayments, openVAPaymentHistory } from './utils'

export const PaymentsE2eIDConstants = {
  PAYMENTS_YEAR_PICKER_ID: 'selectAYearTestID',
  MISSING_PAYMENTS_LINK_ID: 'missingPaymentsTestID',
  PAYMENT_HISTORY_1_ID: 'Regular Chapter 31 $603.33',
  PAYMENT_HISTORY_2_ID: 'Post-9/11 GI Bill $1,172.60',
  PAYMENT_INFO_INCORRECT_ID: 'paymentInfoIncorrectTestID',
  PAYMENT_MISSING_ID: 'paymentsMissingPanelID',
  PAYMENT_MISSING_CLOSE_ID: 'paymentsMissingCloseID',
  PAYMENT_ISSUE_ID: 'paymentsIssuesPanelID',
  PAYMENT_ISSUE_CLOSE_ID: 'paymentIssuesCloseID',
  PAYMENT_DETAILS_BACK_ID: 'paymentDetailsBackID',
  PAYMENT_HISTORY_SCROLL_ID: 'paymentHistoryTestID',
  SELECT_A_YEAR_CANCEL_ID: 'selectAYearCancelTestID',
  SELECT_A_YEAR_CONFIRM_ID: 'selectAYearConfirmTestID',
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
    await expect(element(by.id(PaymentsE2eIDConstants.PAYMENT_MISSING_ID))).toExist()
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
    await element(by.id(PaymentsE2eIDConstants.PAYMENT_MISSING_CLOSE_ID)).tap()
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
    await expect(element(by.id(PaymentsE2eIDConstants.PAYMENT_ISSUE_ID))).toExist()
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
    await element(by.id(PaymentsE2eIDConstants.PAYMENT_ISSUE_CLOSE_ID)).tap()
    await element(by.id(PaymentsE2eIDConstants.PAYMENT_DETAILS_BACK_ID)).tap()
  })

  it('verify the payment details for direct deposit', async () => {
    await waitFor(element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_2_ID)))
      .toBeVisible()
      .whileElement(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_2_ID)).tap()
    await expect(element(by.text('BANK OF AMERICA, N.A.'))).toExist()
    await expect(element(by.text('********0567'))).toExist()
    await element(by.id(PaymentsE2eIDConstants.PAYMENT_DETAILS_BACK_ID)).tap()
  })

  it('should tap on and cancel the select a year picker', async () => {
    await element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_SCROLL_ID)).scrollTo('top')
    await element(by.id(PaymentsE2eIDConstants.PAYMENTS_YEAR_PICKER_ID)).tap()
    await expect(element(by.text('Select a year'))).toExist()
    await element(by.id(PaymentsE2eIDConstants.SELECT_A_YEAR_CANCEL_ID)).tap()
    await expect(element(by.text('2017')).atIndex(0)).toExist()
  })

  it('should tap on and select 2016 from the select a year picker', async () => {
    await element(by.id(PaymentsE2eIDConstants.PAYMENTS_YEAR_PICKER_ID)).tap()
    await element(by.text('2016')).tap()
    await element(by.id(PaymentsE2eIDConstants.SELECT_A_YEAR_CONFIRM_ID)).tap()
    await expect(element(by.text('2016')).atIndex(0)).toExist()
  })

  it('should verify the next and back page arrows work', async () => {
    await element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_SCROLL_ID)).scrollTo('bottom')
    await element(by.id(CommonE2eIdConstants.NEXT_PAGE_ID)).tap()
    await element(by.id(PaymentsE2eIDConstants.PAYMENT_HISTORY_SCROLL_ID)).scrollTo('bottom')
    await element(by.id(CommonE2eIdConstants.PREVIOUS_PAGE_ID)).tap()
  })
})
