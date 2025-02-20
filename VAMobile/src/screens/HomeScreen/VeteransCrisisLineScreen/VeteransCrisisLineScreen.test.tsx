import React from 'react'
import { Alert } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'

import VeteransCrisisLineScreen from './VeteransCrisisLineScreen'

context('VeteransCrisisLineScreen', () => {
  beforeEach(() => {
    render(<VeteransCrisisLineScreen />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: t('veteransCrisisLine.weAreHereForYou') })).toBeTruthy()
    expect(screen.getByText(t('veteransCrisisLine.connectWithResponders'))).toBeTruthy()
    expect(screen.getByRole('link', { name: t('veteransCrisisLine.crisisCallNumberDisplayed') })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('veteransCrisisLine.textNumberDisplayed') })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('veteransCrisisLine.startConfidentialChat') })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('veteransCrisisLine.hearingLossNumberDisplayed') })).toBeTruthy()
    expect(screen.getByRole('header', { name: t('veteransCrisisLine.getMoreResources') })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('veteransCrisisLine.urlDisplayed') })).toBeTruthy()
  })

  describe('when the veteransCrisisLine.net link is clicked', () => {
    it('should show alert', () => {
      fireEvent.press(screen.getByRole('link', { name: t('veteransCrisisLine.urlDisplayed') }))
      expect(Alert.alert).toBeCalled()
    })
  })
})
