import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import StructuredContentLink from 'components/StructuredContentRenderer/StructuredContentLink'
import { context, render } from 'testUtils'

const mockNavigateTo = jest.fn()
const mockLaunchExternalLink = jest.fn()
const mockRootNavigate = jest.fn()

jest.mock('utils/hooks', () => ({
  ...jest.requireActual<typeof import('utils/hooks')>('utils/hooks'),
  useRouteNavigation: () => mockNavigateTo,
  useExternalLink: () => mockLaunchExternalLink,
}))

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    getParent: () => ({
      getParent: () => ({ navigate: mockRootNavigate }),
    }),
  }),
}))

context('StructuredContentLink', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('navigates to Webview when isWebview is true', () => {
    render(
      <StructuredContentLink
        content={{
          type: 'link',
          text: 'View on VA.gov',
          href: 'https://www.va.gov/some-page/',
          isWebview: true,
        }}
      />,
    )
    fireEvent.press(screen.getByRole('link', { name: 'View on VA.gov' }))

    expect(mockNavigateTo).toHaveBeenCalledWith(
      'Webview',
      expect.objectContaining({
        url: 'https://www.va.gov/some-page/',
        loadingMessage: t('webview.claims.loading'),
      }),
    )
  })

  it('navigates to root DirectDeposit when href is profile direct deposit', () => {
    render(
      <StructuredContentLink
        content={{
          type: 'link',
          text: 'Direct deposit',
          href: 'https://www.va.gov/profile/direct-deposit',
          isWebview: false,
        }}
      />,
    )
    fireEvent.press(screen.getByRole('link', { name: 'Direct deposit' }))

    expect(mockRootNavigate).toHaveBeenCalledWith('DirectDeposit')
    expect(mockLaunchExternalLink).not.toHaveBeenCalled()
  })

  it('opens external browser for other URLs', () => {
    render(
      <StructuredContentLink
        content={{
          type: 'link',
          text: 'External link',
          href: 'https://example.com/',
        }}
      />,
    )
    fireEvent.press(screen.getByRole('link', { name: 'External link' }))

    expect(mockLaunchExternalLink).toHaveBeenCalledWith('https://example.com/', expect.any(Object))
  })
})
