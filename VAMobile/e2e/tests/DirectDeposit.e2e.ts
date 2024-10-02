import { by, device, element, expect, waitFor } from 'detox'
import { Dir } from 'fs'
import { setTimeout } from 'timers/promises'

import { CommonE2eIdConstants, loginToDemoMode, openDirectDeposit, openPayments } from './utils'

export const DirectDepositConstants = {
  SCREEN_TITLE: 'Direct deposit',
  PAYMENTS_SCREEN_TITLE: 'Payments',
  INFORMATION_HEADING: 'Direct deposit information',
  ACCOUNT_TEXT: 'Account',
  EDIT_ACCOUNT_TEXT: 'Edit account',
  CONFIRM_CHECKBOX_TEXT: 'I confirm that this information is correct. (Required)',
  CHECKING_EXAMPLE_LABEL:
    'You can find your 9-digit routing number on the bottom left side of a check. You can find your account number in the bottom center of a check.',
  WHERE_CAN_I_FIND_ID: 'directDepositFindTheseNumbersID',
  CANCEL_CONFIRM_TEXT: 'Delete changes to your direct deposit information?',
  CANCEL_CONFIRM_BUTTON_TEXT: device.getPlatform() === 'ios' ? 'Delete Changes' : 'Delete Changes ',
  SAVE_ID: 'directDepositSaveID',
  BACK_ID: 'directDepositBackID',
  DIRECT_DEPOSIT_EDIT_SCROLL_ID: 'DirectDepositEditAccount',
  ACCOUNT_TYPE_CONFIRM_ID: 'accountTypeConfirmID',
  DIRECT_DEPOSIT_EDIT_ACCOUNT_ID: 'accountType',
  DIRECT_DEPOSIT_EDIT_ROUTING_NUM_ID: 'routingNumber',
  DIRECT_DEPOSIT_PAGE_BACK_ID: 'directDepositPageBackID',
}

const scrollToThenTap = async (text: string, id?: boolean) => {
  if (id) {
    await waitFor(element(by.id(text)))
      .toBeVisible()
      .whileElement(by.id(DirectDepositConstants.DIRECT_DEPOSIT_EDIT_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.id(text)).tap()
  } else {
    await waitFor(element(by.text(text)))
      .toBeVisible()
      .whileElement(by.id(DirectDepositConstants.DIRECT_DEPOSIT_EDIT_SCROLL_ID))
      .scroll(200, 'down')
    await element(by.text(text)).tap()
  }
}

beforeAll(async () => {
  await loginToDemoMode()
  await openPayments()
  await openDirectDeposit()
})

describe('Direct Deposit Screen', () => {
  it('should match design', async () => {
    await expect(element(by.text(DirectDepositConstants.SCREEN_TITLE))).toExist()
    await expect(element(by.text(DirectDepositConstants.INFORMATION_HEADING))).toExist()
    await expect(element(by.text(DirectDepositConstants.ACCOUNT_TEXT))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID))).toExist()
  })

  it('should check direct deposit error handling for null', async () => {
    await element(by.text(DirectDepositConstants.ACCOUNT_TEXT)).tap()
    await element(by.id(DirectDepositConstants.SAVE_ID)).tap()
    await expect(element(by.text('Check your direct deposit information'))).toExist()
    await expect(element(by.text('Enter a 9-digit routing number'))).toExist()
    await expect(element(by.text('Enter an account number'))).toExist()
    await expect(element(by.text('Select an account type'))).toExist()
    await expect(element(by.text('Select checkbox to confirm information'))).toExist()
    await element(by.id(DirectDepositConstants.BACK_ID)).tap()
  })

  it('should check direct deposit error handling incorrect routing number', async () => {
    await element(by.text(DirectDepositConstants.ACCOUNT_TEXT)).tap()
    await scrollToThenTap(DirectDepositConstants.CONFIRM_CHECKBOX_TEXT)
    await element(by.id(DirectDepositConstants.DIRECT_DEPOSIT_EDIT_ACCOUNT_ID)).tap()
    await element(by.text('Checking')).tap()
    await element(by.id(DirectDepositConstants.ACCOUNT_TYPE_CONFIRM_ID)).tap()
    await element(by.id(DirectDepositConstants.DIRECT_DEPOSIT_EDIT_ROUTING_NUM_ID)).typeText('1234567\n')
    await element(by.id('accountNumber')).typeText('12345678901234567\n')
    await element(by.id(DirectDepositConstants.SAVE_ID)).tap()
    await expect(element(by.text('Check your direct deposit information'))).toExist()
    await expect(element(by.text('Enter a 9-digit routing number'))).toExist()
    await element(by.id(DirectDepositConstants.BACK_ID)).tap()
    await element(by.text(DirectDepositConstants.CANCEL_CONFIRM_BUTTON_TEXT)).tap()
  })

  it('should fill out Account form for checking', async () => {
    await element(by.text(DirectDepositConstants.ACCOUNT_TEXT)).tap()
    await expect(element(by.text(DirectDepositConstants.EDIT_ACCOUNT_TEXT))).toExist()
    await scrollToThenTap(DirectDepositConstants.CONFIRM_CHECKBOX_TEXT)

    // Ordering here is intentional because the iOS keyboard sometimes blocks fields at the bottom of the form
    await element(by.id(DirectDepositConstants.DIRECT_DEPOSIT_EDIT_ACCOUNT_ID)).tap()
    await element(by.text('Checking')).tap()
    await element(by.id(DirectDepositConstants.ACCOUNT_TYPE_CONFIRM_ID)).tap()
    await element(by.id(DirectDepositConstants.DIRECT_DEPOSIT_EDIT_ROUTING_NUM_ID)).typeText('053100300\n')
    await element(by.id('accountNumber')).typeText('12345678901234567\n')
    await element(by.id(DirectDepositConstants.SAVE_ID)).tap()

    await expect(element(by.text(DirectDepositConstants.INFORMATION_HEADING))).toExist()
    await expect(element(by.text('FIRST CITIZENS BANK & TRUST COMPANY'))).toExist()
    await expect(element(by.text('*************4567'))).toExist()
    await expect(element(by.text('Checking account'))).toExist()
    await expect(element(by.text('Direct deposit information saved'))).toExist()
    await element(by.text('Dismiss')).tap()
  })

  it('should fill out Account form for savings', async () => {
    await element(by.text(DirectDepositConstants.ACCOUNT_TEXT)).tap()
    await expect(element(by.text(DirectDepositConstants.EDIT_ACCOUNT_TEXT))).toExist()
    await scrollToThenTap(DirectDepositConstants.CONFIRM_CHECKBOX_TEXT)

    // Ordering here is intentional because the iOS keyboard sometimes blocks fields at the bottom of the form
    await element(by.id(DirectDepositConstants.DIRECT_DEPOSIT_EDIT_ACCOUNT_ID)).tap()
    await element(by.text('Savings')).tap()
    await element(by.id(DirectDepositConstants.ACCOUNT_TYPE_CONFIRM_ID)).tap()
    await element(by.id(DirectDepositConstants.DIRECT_DEPOSIT_EDIT_ROUTING_NUM_ID)).typeText('053100300\n')
    await element(by.id('accountNumber')).typeText('12345678901234567\n')
    await element(by.id(DirectDepositConstants.SAVE_ID)).tap()

    await expect(element(by.text('FIRST CITIZENS BANK & TRUST COMPANY'))).toExist()
    await expect(element(by.text('*************4567'))).toExist()
    await expect(element(by.text('Savings account'))).toExist()
    await setTimeout(2000)
    await expect(element(by.text('Direct deposit information saved'))).toExist()
    await element(by.text('Dismiss')).tap()
  })

  it('should show cancel confirmation after user enters information', async () => {
    await element(by.text(DirectDepositConstants.ACCOUNT_TEXT)).tap()
    await expect(element(by.text(DirectDepositConstants.EDIT_ACCOUNT_TEXT))).toExist()

    await element(by.id(DirectDepositConstants.DIRECT_DEPOSIT_EDIT_ROUTING_NUM_ID)).typeText('053100300\n')
    await element(by.id(DirectDepositConstants.BACK_ID)).tap()
    await expect(element(by.text(DirectDepositConstants.CANCEL_CONFIRM_TEXT))).toExist()
    await element(by.text(DirectDepositConstants.CANCEL_CONFIRM_BUTTON_TEXT)).tap()

    await expect(element(by.text(DirectDepositConstants.SCREEN_TITLE))).toExist()
  })

  it('should show "Where can I find these numbers?" information', async () => {
    await element(by.text(DirectDepositConstants.ACCOUNT_TEXT)).tap()
    await expect(element(by.text(DirectDepositConstants.EDIT_ACCOUNT_TEXT))).toExist()

    await element(by.id(DirectDepositConstants.WHERE_CAN_I_FIND_ID)).tap()
    await expect(element(by.label(DirectDepositConstants.CHECKING_EXAMPLE_LABEL)).atIndex(0)).toBeVisible()
    await element(by.id(DirectDepositConstants.WHERE_CAN_I_FIND_ID)).tap()
    await expect(element(by.label(DirectDepositConstants.CHECKING_EXAMPLE_LABEL)).atIndex(0)).not.toBeVisible()
    await element(by.id(DirectDepositConstants.BACK_ID)).tap()
  })

  it('should tap phone and TTY links', async () => {
    if (device.getPlatform() === 'android') {
      await device.disableSynchronization()
      await scrollToThenTap(CommonE2eIdConstants.CALL_VA_PHONE_NUMBER_ID, true)
      await setTimeout(1000)
      await device.takeScreenshot('DirectDepositPhoneNumber')
      await device.launchApp({ newInstance: false })

      await scrollToThenTap(CommonE2eIdConstants.CALL_VA_TTY_PHONE_NUMBER_ID, true)
      await setTimeout(1000)
      await device.takeScreenshot('DirectDepositTTY')
      await device.enableSynchronization()
      await device.launchApp({ newInstance: false })
    }
  })

  it('should navigate back to Payments screen', async () => {
    await element(by.id(DirectDepositConstants.DIRECT_DEPOSIT_PAGE_BACK_ID)).tap()
    await expect(element(by.text(DirectDepositConstants.PAYMENTS_SCREEN_TITLE)).atIndex(0)).toExist()
  })
})
