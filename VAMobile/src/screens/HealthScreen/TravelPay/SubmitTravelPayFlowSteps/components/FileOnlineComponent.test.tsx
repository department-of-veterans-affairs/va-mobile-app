import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { FileOnlineComponent } from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps/components'
import { context, mockNavProps, render } from 'testUtils'
import getEnv from 'utils/env'

const { LINK_URL_TRAVEL_PAY_FILE_CLAIM_BTSSS } = getEnv()

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('FileOnlineComponent', () => {
  const initializeTestInstance = (onPress?: () => void) => {
    const navProps = mockNavProps()
    render(<FileOnlineComponent {...navProps} onBeforeOpenTravelPayWebview={onPress} />)
  }
  it('should initialize correctly', () => {
    initializeTestInstance()
    expect(screen.getByTestId('fileOnlineComponent')).toBeTruthy()
    expect(screen.getByText(t('travelPay.otherWaysToFile'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.otherWaysToFile.method1'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.otherWaysToFile.method2'))).toBeTruthy()
    expect(screen.getByTestId('fileOnlineBTSSSLink')).toBeTruthy()
    expect(screen.getByTestId('fileOnlineVAFormLink')).toBeTruthy()
  })

  it('should navigate to webview for btsss', () => {
    initializeTestInstance()
    fireEvent.press(screen.getByTestId('fileOnlineBTSSSLink'))
    expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', {
      url: LINK_URL_TRAVEL_PAY_FILE_CLAIM_BTSSS,
      displayTitle: t('travelPay.webview.fileForTravelPay.title'),
      loadingMessage: t('loading.vaWebsite'),
      useSSO: true,
    })
  })

  it('should call onBeforeOpenTravelPayWebview when the file online link is tapped', () => {
    const onBeforeOpenTravelPayWebview = jest.fn()
    initializeTestInstance(onBeforeOpenTravelPayWebview)

    fireEvent.press(screen.getByTestId('fileOnlineBTSSSLink'))
    expect(onBeforeOpenTravelPayWebview).toHaveBeenCalled()
  })
})
