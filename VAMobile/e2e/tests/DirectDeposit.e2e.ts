import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import { loginToDemoMode, openDirectDeposit, openPayments } from './utils'

export const DirectDepositConstants = {
  SCREEN_TITLE: 'Direct deposit',
  INFORMATION_HEADING: 'Direct deposit information',
  ACCOUNT_TEXT: 'Account',
  PHONE_LINK_TEXT: '800-827-1000',
  TTY_LINK_TEXT: 'TTY: 711',
  EDIT_ACCOUNT_TEXT: 'Edit account',
  CONFIRM_CHECKBOX_TEXT: 'I confirm that this information is correct. (Required)',
  CHECKING_EXAMPLE_LABEL: 'You can find your 9-digit routing number on the bottom left side of a check. You can find your account number in the bottom center of a check.',
}

const scrollToThenTap = async (text: string) => {
  await waitFor(element(by.text(text)))
    .toBeVisible()
    .whileElement(by.id('DirectDepositEditAccount'))
    .scroll(200, 'down')
  await element(by.text(text)).tap()
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
    await expect(element(by.text(DirectDepositConstants.PHONE_LINK_TEXT))).toExist()
    await expect(element(by.text(DirectDepositConstants.TTY_LINK_TEXT))).toExist()
  })

  it('should fill out Account form', async () => {
    await element(by.text(DirectDepositConstants.ACCOUNT_TEXT)).tap()
    await expect(element(by.text(DirectDepositConstants.EDIT_ACCOUNT_TEXT))).toExist()

    await element(by.id('routingNumber')).typeText('123456789\n')
    await element(by.id('accountNumber')).typeText('12345678901234567\n')
    await element(by.id('accountType picker required')).tap()
    await element(by.text('Checking')).tap()
    await element(by.text('Done')).tap()
    await scrollToThenTap(DirectDepositConstants.CONFIRM_CHECKBOX_TEXT)
    await element(by.text('Save')).tap()

    await expect(element(by.text(DirectDepositConstants.INFORMATION_HEADING))).toExist()
    await expect(element(by.text('Bank'))).toExist()
    await expect(element(by.text('12345678901234567'))).toExist()
    await expect(element(by.text('Checking account'))).toExist()
    await expect(element(by.text('Direct deposit information saved'))).toExist()
    await element(by.text('Dismiss')).tap()
  })

  it('should show "Where can I find these numbers?" information', async () => {
    await element(by.text(DirectDepositConstants.ACCOUNT_TEXT)).tap()
    await expect(element(by.text(DirectDepositConstants.EDIT_ACCOUNT_TEXT))).toExist()

    await element(by.text('Where can I find these numbers?')).tap()
    await expect(element(by.label(DirectDepositConstants.CHECKING_EXAMPLE_LABEL)).atIndex(0)).toBeVisible()
    await element(by.text('Cancel')).tap()
  })

  it('should tap phone and TTY links', async () => {
    if (device.getPlatform() === 'android') {
      await scrollToThenTap(DirectDepositConstants.PHONE_LINK_TEXT)
      await setTimeout(1000)
      await device.takeScreenshot('DirectDepositPhoneNumber')
      await device.launchApp({ newInstance: false })

      await scrollToThenTap(DirectDepositConstants.TTY_LINK_TEXT)
      await setTimeout(1000)
      await device.takeScreenshot('DirectDepositTTY')
      await device.launchApp({ newInstance: false })
    }
  })
})
