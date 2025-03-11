import React from 'react'

import { t } from 'i18next'

import { context, mockNavProps, render, screen } from 'testUtils'

import ErrorScreen from './ErrorScreen'

context('ErrorScreen', () => {
  const props = mockNavProps()

  const initializeTestInstance = () => {
    render(<ErrorScreen {...props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByText(t('travelPay.error.title'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.error.text'))).toBeTruthy()
  })
})
