import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

import TravelPayHelp from './TravelPayHelp'

context('TravelPayHelp', () => {
  const initializeTestInstance = () => {
    const props = mockNavProps()
    render(<TravelPayHelp {...props} />)
  }
  it('should initialize correctly', () => {
    initializeTestInstance()

    expect(screen.getByTestId('helpTitleID')).toBeTruthy()
    expect(screen.getByText(t('travelPay.helpTitle'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.helpText'))).toBeTruthy()
    expect(screen.getByText(displayedTextPhoneNumber(t('travelPay.phone')))).toBeTruthy()
  })
})
