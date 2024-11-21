import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

import PaymentMissing from './PaymentMissingScreen'

context('PaymentMissing', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    render(<PaymentMissing {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: t('payments.ifIAmMissingPayemt') })).toBeTruthy()
    expect(screen.getByText(t('payments.missingOrNoPayments.body.1'))).toBeTruthy()
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
