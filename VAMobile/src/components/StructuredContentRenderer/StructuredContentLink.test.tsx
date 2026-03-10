import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import LinkWithAnalytics from 'components/LinkWithAnalytics/LinkWithAnalytics'
import StructuredContentLink from 'components/StructuredContentRenderer/StructuredContentLink'
import { context, render } from 'testUtils'
import { logAnalyticsEvent } from 'utils/analytics'

const mockNavigateTo = jest.fn()
const mockLaunchExternalLink = jest.fn()

jest.mock('utils/analytics', () => ({
  logAnalyticsEvent: jest.fn(),
}))

/* eslint-disable @typescript-eslint/no-var-requires */
jest.mock('components/LinkWithAnalytics/LinkWithAnalytics', () => {
  const ReactLib = require('react')
  const RN = require('react-native')
  const { getDefinedAnalyticsProps } = require('components/LinkWithAnalytics/utils')
  const { Events } = require('constants/analytics')
  const { logAnalyticsEvent: logEvent } = require('utils/analytics')
  const Mock = jest.fn((props) =>
    ReactLib.createElement(RN.Pressable, {
      onPress: () => {
        logEvent(Events.vama_link_click(getDefinedAnalyticsProps(props)))
        props.onPress?.()
      },
      accessibilityRole: 'link',
      accessibilityLabel: props.a11yLabel || props.text,
      children: ReactLib.createElement(RN.Text, null, props.text),
    }),
  )
  return { __esModule: true, default: Mock }
})

jest.mock('utils/hooks', () => ({
  ...jest.requireActual<typeof import('utils/hooks')>('utils/hooks'),
  useRouteNavigation: () => mockNavigateTo,
  useExternalLink: () => mockLaunchExternalLink,
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

    expect(mockNavigateTo).toHaveBeenCalledWith('DirectDeposit')
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

  it('does not show the Launch icon for webview links', () => {
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
    expect(LinkWithAnalytics).toHaveBeenLastCalledWith(
      expect.objectContaining({
        icon: 'no icon',
      }),
      expect.anything(),
    )
  })

  it('fires vama_link_click when link is pressed', () => {
    render(
      <StructuredContentLink
        content={{
          type: 'link',
          text: 'Example link',
          href: 'https://example.com/',
        }}
      />,
    )
    fireEvent.press(screen.getByRole('link', { name: 'Example link' }))

    expect(logAnalyticsEvent).toHaveBeenCalledTimes(1)
    expect(logAnalyticsEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'vama_link_click',
        params: expect.objectContaining({ p6: 'custom', p7: 'Example link' }),
      }),
    )
  })
})
