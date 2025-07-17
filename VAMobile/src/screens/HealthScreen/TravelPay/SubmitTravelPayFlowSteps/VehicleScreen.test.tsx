import React from 'react'

import { t } from 'i18next'

import VehicleScreen from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps/VehicleScreen'
import { context, mockNavProps, render, screen } from 'testUtils'

context('VehicleScreen', () => {
  const props = mockNavProps()

  const initializeTestInstance = () => {
    render(<VehicleScreen {...props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByText(t('travelPay.vehicleQuestion'))).toBeTruthy()
  })
})
