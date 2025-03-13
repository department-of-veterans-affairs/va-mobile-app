import React from 'react'

import { t } from 'i18next'

import { context, mockNavProps, render, screen } from 'testUtils'

import VehicleScreen from './VehicleScreen'

context('VehicleScreen', () => {
  const props = mockNavProps()

  const initializeTestInstance = () => {
    render(<VehicleScreen {...props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByText(t('travelPay.vehicleQuestion'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.vehicleQualifier'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.referToPortal'))).toBeTruthy()
  })
})
