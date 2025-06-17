import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'
import getEnv from 'utils/env'

import FileOnBTSSSLink from './FileOnBTSSSLink'

const { LINK_URL_TRAVEL_PAY_FILE_CLAIM_BTSSS } = getEnv()

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('FileOnBTSSSLink', () => {
  const initializeTestInstance = (
    text: string = 'Test Link Text',
    testID: string = 'testFileOnBTSSSLink',
    onBeforeOpenWebview: () => void = jest.fn(),
  ) => {
    render(<FileOnBTSSSLink text={text} testID={testID} onBeforeOpenWebview={onBeforeOpenWebview} />)
  }

  it('should render correctly with default props', () => {
    initializeTestInstance()

    expect(screen.getByTestId('testFileOnBTSSSLink')).toBeTruthy()
    expect(screen.getByText('Test Link Text')).toBeTruthy()
  })

  it('should render with custom text and testID', () => {
    const customProps = {
      text: 'Custom Link Text',
      testID: 'customTestID',
    }
    initializeTestInstance(customProps.text, customProps.testID)

    expect(screen.getByTestId('customTestID')).toBeTruthy()
    expect(screen.getByText('Custom Link Text')).toBeTruthy()
  })

  it('should call onBeforeOpenWebview when link is pressed', () => {
    const mockOnBeforeOpenWebview = jest.fn()
    initializeTestInstance('Test Link Text', 'testFileOnBTSSSLink', mockOnBeforeOpenWebview)

    const link = screen.getByTestId('testFileOnBTSSSLink')
    fireEvent.press(link)

    expect(mockOnBeforeOpenWebview).toHaveBeenCalled()
  })

  it('should navigate to Webview with correct parameters when link is pressed', () => {
    initializeTestInstance()

    const link = screen.getByTestId('testFileOnBTSSSLink')
    fireEvent.press(link)

    expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', {
      url: LINK_URL_TRAVEL_PAY_FILE_CLAIM_BTSSS,
      displayTitle: t('travelPay.webview.fileForTravelPay.title'),
      loadingMessage: t('loading.vaWebsite'),
      useSSO: true,
    })
  })
})
