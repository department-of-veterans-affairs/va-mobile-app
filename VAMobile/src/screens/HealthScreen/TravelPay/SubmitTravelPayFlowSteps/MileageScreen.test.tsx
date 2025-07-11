import React from 'react'

import { t } from 'i18next'

import MileageScreen from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps/MileageScreen'
import { context, mockNavProps, render, screen } from 'testUtils'

context('MileageScreen', () => {
  const props = mockNavProps()

  const initializeTestInstance = () => {
    render(<MileageScreen {...props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByText(t('travelPay.mileageQuestion'))).toBeTruthy()
  })
})
