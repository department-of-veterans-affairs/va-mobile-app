import React from 'react'

import { t } from 'i18next'

import { context, mockNavProps, render, screen } from 'testUtils'

import NotEligibleTypeScreen from './NotEligibleTypeScreen'

context('NotEligibleTypeScreen', () => {
  const props = mockNavProps()

  const initializeTestInstance = () => {
    render(<NotEligibleTypeScreen {...props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByText(t('travelPay.cannotSubmitThisType'))).toBeTruthy()
    expect(screen.getByTestId('fileOnlineComponent')).toBeTruthy()
    expect(screen.getByTestId('travelPayHelp')).toBeTruthy()
  })
})
