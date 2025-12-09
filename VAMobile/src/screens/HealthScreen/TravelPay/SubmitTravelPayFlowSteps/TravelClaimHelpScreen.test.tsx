import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import TravelClaimHelpScreen from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps/TravelClaimHelpScreen'
import { context, mockNavProps, render } from 'testUtils'

context('TravelClaimHelpScreen', () => {
  const initializeTestInstance = () => {
    const props = mockNavProps()
    render(<TravelClaimHelpScreen {...props} />)
    jest.advanceTimersByTime(50)
  }
  it('should initialize correctly', () => {
    initializeTestInstance()
    expect(screen.getByLabelText(t('travelPay.help.title'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.help.useThisApp'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.help.youCanStillFile'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.help.youCanStillFile.bulletOne'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.help.youCanStillFile.bulletTwo'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.help.youCanStillFile.bulletThree'))).toBeTruthy()

    expect(screen.getByTestId('fileOnlineComponent')).toBeTruthy()
    expect(screen.getByTestId('travelPayHelp')).toBeTruthy()
  })
})
