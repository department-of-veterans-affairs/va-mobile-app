import React from 'react'
import { Alert } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'

import TermsAndConditions from './TermsAndConditions'

context('TermsAndConditions', () => {
  beforeEach(() => {
    render(<TermsAndConditions />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText(t('termsAndConditions.title'))).toBeTruthy()
    expect(screen.getByText(t('termsAndConditions.toAccept'))).toBeTruthy()
    expect(screen.getByRole('link', { name: t('termsAndConditions.goTo') })).toBeTruthy()
    expect(screen.getByText(t('secureMessaging.doNotUseSM'))).toBeTruthy()
  })

  describe('when Go to My HealtheVet link is clicked', () => {
    it('should launch external link', () => {
      fireEvent.press(screen.getByRole('link', { name: t('termsAndConditions.goTo') }))
      expect(Alert.alert).toBeCalled()
    })
  })
})
