import React from 'react'

import { t } from 'i18next'

import { context, mockNavProps, render, screen } from 'testUtils'

import MileageScreen from './MileageScreen'

context('MileageScreen', () => {
  const props = mockNavProps()

  const initializeTestInstance = () => {
    render(<MileageScreen {...props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByText(t('travelPay.mileageQuestion'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.mileageQualifier'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.referToPortal'))).toBeTruthy()
  })
})
