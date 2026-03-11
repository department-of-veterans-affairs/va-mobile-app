import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import StructuredContentLink from 'components/StructuredContentRenderer/StructuredContentLink'
import { context, render } from 'testUtils'
import { logAnalyticsEvent } from 'utils/analytics'

const mockNavigateTo = jest.fn()

jest.mock('utils/analytics', () => ({
  logAnalyticsEvent: jest.fn(),
}))

jest.mock('utils/hooks', () => ({
  ...jest.requireActual<typeof import('utils/hooks')>('utils/hooks'),
  useRouteNavigation: () => mockNavigateTo,
  useExternalLink: () => jest.fn(),
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

  it('navigates to DirectDeposit when href is profile direct deposit', () => {
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

    expect(mockNavigateTo).toHaveBeenCalledWith('DirectDeposit')
  })

  it('renders external link with type url for other URLs', () => {
    render(
      <StructuredContentLink
        content={{
          type: 'link',
          text: 'External link',
          href: 'https://example.com/',
        }}
      />,
    )
    expect(screen.getByRole('link', { name: 'External link' })).toBeTruthy()
  })

  it('treats non-VA.gov URL with same path as external (does not navigate to DirectDeposit)', () => {
    render(
      <StructuredContentLink
        content={{
          type: 'link',
          text: 'Fake direct deposit',
          href: 'https://example.com/profile/direct-deposit',
          isWebview: false,
        }}
      />,
    )
    fireEvent.press(screen.getByRole('link', { name: 'Fake direct deposit' }))
    expect(mockNavigateTo).not.toHaveBeenCalledWith('DirectDeposit')
  })

  it('fires vama_link_click exactly once for webview link', () => {
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

    const linkClickCalls = (logAnalyticsEvent as jest.Mock).mock.calls.filter(
      ([event]) => event?.name === 'vama_link_click',
    )
    expect(linkClickCalls).toHaveLength(1)
  })

  it('fires vama_link_click exactly once for direct deposit link', () => {
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

    const linkClickCalls = (logAnalyticsEvent as jest.Mock).mock.calls.filter(
      ([event]) => event?.name === 'vama_link_click',
    )
    expect(linkClickCalls).toHaveLength(1)
  })

  it('fires vama_link_click exactly once for external link', () => {
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

    const linkClickCalls = (logAnalyticsEvent as jest.Mock).mock.calls.filter(
      ([event]) => event?.name === 'vama_link_click',
    )
    expect(linkClickCalls).toHaveLength(1)
  })
})
