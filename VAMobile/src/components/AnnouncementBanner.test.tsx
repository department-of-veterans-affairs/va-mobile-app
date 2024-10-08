import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import AnnouncementBanner from './AnnouncementBanner'

const mockExternalLinkSpy = jest.fn()
const mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('AnnouncementBanner', () => {
  beforeEach(() => {
    render(<AnnouncementBanner title={'Learn about PACT Act on VA.gov'} link={'https://www.va.gov'} />)
  })

  it('renders title', () => {
    expect(screen.getByRole('link', { name: 'Learn about PACT Act on VA.gov' })).toBeTruthy()
  })

  it('navigates to link when tapped', () => {
    fireEvent.press(screen.getByRole('link', { name: 'Learn about PACT Act on VA.gov' }))
    expect(mockExternalLinkSpy).toBeCalledWith('https://www.va.gov')
  })

  it("opens WebView when 'useWebView' is true", () => {
    const loadingMessage = 'Loading webview opened via announcement banner'

    render(
      <AnnouncementBanner
        title={'Learn about PACT Act on VA.gov'}
        link={'https://www.va.gov'}
        useWebView={true}
        webViewLoadingMessage={loadingMessage}
      />,
    )
    fireEvent.press(screen.getByRole('link', { name: 'Learn about PACT Act on VA.gov' }))
    expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', {
      url: 'https://www.va.gov',
      displayTitle: 'va.gov',
      loadingMessage,
      useSSO: true,
    })
  })
})
