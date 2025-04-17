import React from 'react'
import { Alert, Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

import NeedHelpData from './NeedHelpData'

context('NeedHelpData', () => {
  const initializeTestInstance = (isAppeal?: boolean) => {
    render(<NeedHelpData isAppeal={isAppeal} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('Renders NeedHelpData', () => {
    expect(screen.getByText(t('claimDetails.needHelp'))).toBeTruthy()
    expect(screen.getByText(t('claimDetails.callVA'))).toBeTruthy()
    expect(screen.getByText(displayedTextPhoneNumber(t('8008271000')))).toBeTruthy()
    expect(screen.queryByText(t('appealDetails.viewMoreDetails'))).toBeFalsy()
    expect(screen.queryByText(t('goToVAGov'))).toBeFalsy()
    initializeTestInstance(true)
    expect(screen.getByText(t('appealDetails.viewMoreDetails'))).toBeTruthy()
    expect(screen.getByText(t('goToVAGov'))).toBeTruthy()
  })

  it('should launch external link on click of the number', () => {
    fireEvent.press(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8008271000')) }))
    expect(Linking.openURL).toHaveBeenCalledWith(`tel:${t('8008271000')}`)
  })

  describe('when isAppeal is true', () => {
    it('should launch external link on click of the url', () => {
      initializeTestInstance(true)
      fireEvent.press(screen.getByRole('link', { name: t('goToVAGov') }))
      expect(Alert.alert).toHaveBeenCalled()
    })
  })
})
