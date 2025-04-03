import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'
import getEnv from 'utils/env'

import NeedHelpData from './NeedHelpData'

const { LINK_URL_CLAIM_APPEAL_STATUS } = getEnv()

const mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('NeedHelpData', () => {
  const initializeTestInstance = (isAppeal?: boolean) => {
    render(<NeedHelpData isAppeal={isAppeal} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('Renders NeedHelpData', () => {
    expect(screen.getByText('Need help?')).toBeTruthy()
    expect(
      screen.getByText('Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.'),
    ).toBeTruthy()
    expect(screen.getByText('800-827-1000')).toBeTruthy()
    expect(screen.queryByText('To review more details about your appeal, go to VA.gov.')).toBeFalsy()
    expect(screen.queryByText('Go to VA.gov')).toBeFalsy()
    initializeTestInstance(true)
    expect(screen.getByText('To review more details about your appeal, go to VA.gov.')).toBeTruthy()
    expect(screen.getByText('Go to VA.gov')).toBeTruthy()
  })

  it('should launch external link on click of the number', () => {
    fireEvent.press(screen.getByRole('link', { name: '800-827-1000' }))
    expect(Linking.openURL).toHaveBeenCalledWith('tel:8008271000')
  })

  describe('when isAppeal is true', () => {
    it('should launch external link on click of the url', () => {
      initializeTestInstance(true)
      fireEvent.press(screen.getByRole('link', { name: 'Go to VA.gov' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', {
        url: LINK_URL_CLAIM_APPEAL_STATUS,
        displayTitle: 'va.gov',
        loadingMessage: t('webview.claims.loading'),
        useSSO: true,
      })
    })
  })
})
