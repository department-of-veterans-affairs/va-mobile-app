import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

import IndividualMessageErrorComponent from './IndividualMessageErrorComponent'

context('IndividualMessageErrorComponent', () => {
  beforeEach(() => {
    render(<IndividualMessageErrorComponent />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText(t('secureMessaging.viewMessage.errorTitle'))).toBeTruthy()
    expect(screen.getByText(t('errors.callHelpCenter.sorryWithRefresh'))).toBeTruthy()
    expect(screen.getByText(t('secureMessaging.sendError.ifTheAppStill'))).toBeTruthy()
    expect(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8773270022')) })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
    expect(screen.getByRole('button', { name: t('refresh') })).toBeTruthy()
  })

  describe('when the My HealtheVet phone number link is clicked', () => {
    it('should call Linking open url with the parameter tel:8773270022', () => {
      fireEvent.press(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8773270022')) }))
      expect(Linking.openURL).toBeCalledWith('tel:8773270022')
    })
  })
  describe('when the call TTY phone link is clicked', () => {
    it('should call Linking open url with the parameter tel:711', () => {
      fireEvent.press(screen.getByRole('link', { name: t('contactVA.tty.displayText') }))
      expect(Linking.openURL).toBeCalledWith('tel:711')
    })
  })
})
