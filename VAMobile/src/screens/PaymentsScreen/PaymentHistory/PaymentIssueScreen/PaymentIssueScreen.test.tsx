import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

import PaymentIssue from './PaymentIssueScreen'

context('PaymentIssueScreen', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    render(<PaymentIssue {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: t('payments.ifMyPaymentDoesNotLookRight') })).toBeTruthy()
    expect(screen.getByText(t('paymentIssues.body'))).toBeTruthy()
  })

  describe('when the help phone number link is clicked', () => {
    it('should call Linking open url with the parameter tel:8008271000', () => {
      fireEvent.press(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8008271000')) }))
      expect(Linking.openURL).toBeCalledWith('tel:8008271000')
    })
  })

  describe('when the call TTY phone link is clicked', () => {
    it('should call Linking open url with the parameter tel:711', () => {
      fireEvent.press(screen.getByRole('link', { name: t('contactVA.tty.displayText') }))
      expect(Linking.openURL).toBeCalledWith('tel:711')
    })
  })
})
