import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

import NoPaymentsScreen from './NoPaymentsScreen'

context('NoPaymentsScreen', () => {
  beforeEach(() => {
    render(<NoPaymentsScreen />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText(t('payments.noPayments.title'))).toBeTruthy()
    expect(screen.getByText(t('payments.noPayments.body.1'))).toBeTruthy()
    expect(screen.getByText(t('payments.missingOrNoPayments.body.1'))).toBeTruthy()
    expect(screen.getByText(t('payments.noPayments.body.2'))).toBeTruthy()
    expect(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8008271000')) })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
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
