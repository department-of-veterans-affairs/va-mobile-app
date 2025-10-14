import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { SetUpDirectDepositWebLink } from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps/components'
import { context, render } from 'testUtils'

context('SetUpDirectDepositWebLink', () => {
  const initializeTestInstance = () => {
    render(<SetUpDirectDepositWebLink />)
  }

  it('should initialize correctly', () => {
    initializeTestInstance()

    expect(screen.getByTestId('setUpDirectDepositLinkID')).toBeTruthy()
    expect(screen.getByText(t('travelPay.setUpDirectDeposit.link'))).toBeTruthy()
  })
})
