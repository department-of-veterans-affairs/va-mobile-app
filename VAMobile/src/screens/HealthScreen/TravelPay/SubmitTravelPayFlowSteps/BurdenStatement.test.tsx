import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import BurdernStatement from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps/BurdenStatement'
import { context, mockNavProps, render } from 'testUtils'

context('BurdenStatement', () => {
  const initializeTestInstance = () => {
    const props = mockNavProps()
    render(<BurdernStatement {...props} />)
  }
  it('should initialize correctly', () => {
    initializeTestInstance()

    expect(screen.getByLabelText(t('travelPay.privacyStatement.sheetTitle'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.privacyStatement.header'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.privacyStatement.description'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.privacyAct.header'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.privacyAct.description'))).toBeTruthy()
  })
})
