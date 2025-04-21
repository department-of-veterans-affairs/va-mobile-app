import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

import NeedHelpData from './NeedHelpData'

const mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useBeforeNavBackListener: jest.fn(),
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('NeedHelpData', () => {
  const initializeTestInstance = (isAppeal?: boolean, appealId?: string) => {
    render(<NeedHelpData isAppeal={isAppeal} appealId={appealId} />)
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
    it('should launch webview on click of the url', () => {
      initializeTestInstance(true, 'A1113')
      fireEvent.press(screen.getByRole('link', { name: 'Go to VA.gov' }))
      const expectNavArgs = {
        url: 'https://va.gov/track-claims/appeals/' + 'A1113',
        displayTitle: t('webview.vagov'),
        loadingMessage: t('webview.claims.loading'),
        useSSO: true,
      }
      expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', expectNavArgs)
    })
  })
})
